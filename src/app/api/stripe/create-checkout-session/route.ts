import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { stripe, createLineItem, createSessionMetadata, SessionData, getSuccessUrl, getCancelUrl } from '@/lib/stripe';
import Joi from 'joi';
import { Bootcamp } from '@/types/admin';

// Get base URL for the application
// In production on Vercel, this should be set to: https://inspired-analyst.vercel.app
const getBaseUrl = () => {
  // Check if NEXT_PUBLIC_BASE_URL is set (preferred method - always use this if set)
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  }
  
  // For production on Vercel, check VERCEL_ENV to distinguish production from preview
  if (process.env.VERCEL_ENV === 'production') {
    // Use the production domain directly
    return 'https://inspired-analyst.vercel.app';
  }
  
  // For preview/development on Vercel (if env var not set)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback for local development
  return 'http://localhost:3000';
};

// Environment-based pricing configuration
const isTestMode = process.env.NODE_ENV === 'development' || process.env.STRIPE_TEST_MODE === 'true';

// Meeting types configuration - matches your existing data
const meetingTypes = [
  {
    id: 'initial-consultation',
    name: 'Initial Consultation',
    duration: 30,
    price: isTestMode ? 1 : 50, // $1 for testing, $50 for production
    description: 'Quick overview and needs assessment'
  },
  {
    id: 'initial-consultation-1',
    name: 'Extended Initial Consultation',
    duration: 45,
    price: isTestMode ? 1 : 75, // $1 for testing, $75 for production
    description: 'Extended consultation with detailed analysis'
  },
  {
    id: 'strategy-workshop',
    name: 'Strategy Workshop',
    duration: 90,
    price: isTestMode ? 1 : 150, // $1 for testing, $150 for production
    description: 'Intensive planning and implementation workshop'
  },
  {
    id: 'follow-up-session',
    name: 'Follow-up Session',
    duration: 45,
    price: isTestMode ? 1 : 75, // $1 for testing, $75 for production
    description: 'Progress review and next steps'
  }
];

// Bootcamp configuration removed - now fetched from database

// Validation schemas
const bookingSchema = Joi.object({
  type: Joi.string().valid('booking').required(),
  meetingTypeId: Joi.string().required(),
  priceAmount: Joi.number().positive().optional(), // Price from frontend (in USD)
  customerEmail: Joi.string().email().required(),
  customerName: Joi.string().optional()
});

const bootcampSchema = Joi.object({
  type: Joi.string().valid('bootcamp').required(),
  bootcampId: Joi.string().required(),
  customerEmail: Joi.string().email().required(),
  customerName: Joi.string().required(),
  notes: Joi.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    console.log(`💰 Pricing Mode: ${isTestMode ? 'TEST ($1 charges)' : 'PRODUCTION (real prices)'}`);
    const body = await request.json();
    console.log('Stripe checkout request body:', JSON.stringify(body, null, 2));

    // Simple validation
    if (!body.type || !body.customerEmail) {
      console.error('Missing required fields:', { type: body.type, customerEmail: body.customerEmail });
      return NextResponse.json(
        { error: 'Missing required fields', missing: { type: !body.type, customerEmail: !body.customerEmail } },
        { status: 400 }
      );
    }

    // Validate bootcamp-specific fields
    if (body.type === 'bootcamp' && !body.bootcampId) {
      console.error('Missing bootcampId for bootcamp type');
      return NextResponse.json(
        { error: 'Missing bootcampId for bootcamp type' },
        { status: 400 }
      );
    }

    let productDetails;
    let amount;

    if (body.type === 'booking') {
      const meetingType = meetingTypes.find(mt => mt.id === body.meetingTypeId);
      if (!meetingType) {
        return NextResponse.json(
          { error: 'Invalid meeting type' },
          { status: 400 }
        );
      }
      
      // Use price from frontend if provided, otherwise fall back to meeting type default
      let priceValue: number;
      if (body.priceAmount && typeof body.priceAmount === 'number' && body.priceAmount > 0) {
        priceValue = body.priceAmount;
        console.log(`Using frontend price: $${priceValue}`);
      } else {
        priceValue = meetingType.price;
        console.log(`Using default meeting type price: $${priceValue}`);
      }
      
      productDetails = {
        name: meetingType.name,
        description: meetingType.description,
        price: priceValue
      };
      amount = priceValue * 100; // Convert to cents
    } else if (body.type === 'bootcamp') {
      // Fetch bootcamp from database
      const db = await getDatabase();
      const bootcampId = body.bootcampId?.trim(); // IDs are now numeric strings
      
      console.log('Looking for bootcamp with ID:', bootcampId);
      
      // Find bootcamp by ID (IDs are now simple numeric strings like "1", "2", "3")
      const bootcamp: Bootcamp | null = await db.collection('bootcamps').findOne({ 
        id: bootcampId,
        isActive: true 
      });
      
      if (!bootcamp) {
        // Try to find any bootcamp with this ID (even if not active) for debugging
        const anyBootcamp = await db.collection('bootcamps').findOne({ id: bootcampId });
        
        // List all bootcamp IDs for debugging
        const allBootcamps = await db.collection('bootcamps').find({}, { projection: { id: 1, title: 1, isActive: 1 } }).toArray();
        console.error('Bootcamp not found:', {
          requestedId: bootcampId,
          foundAnyBootcamp: !!anyBootcamp,
          isActive: anyBootcamp?.isActive,
          bootcampTitle: anyBootcamp?.title,
          allBootcampIds: allBootcamps.map(b => ({ id: b.id, title: b.title, isActive: b.isActive }))
        });
        
        return NextResponse.json(
          { 
            error: 'Invalid bootcamp or bootcamp not active',
            details: `Bootcamp with ID "${bootcampId}" not found or not active`,
            availableIds: allBootcamps.map(b => ({ id: b.id, title: b.title, isActive: b.isActive }))
          },
          { status: 400 }
        );
      }
      
      console.log('Found bootcamp:', { 
        id: bootcamp.id, 
        title: bootcamp.title, 
        isActive: bootcamp.isActive,
        price: bootcamp.price,
        priceAmount: bootcamp.priceAmount
      });

      // Parse price value - try priceAmount first, then parse from price string
      let priceValue: number;
      if (typeof bootcamp.priceAmount === 'number' && bootcamp.priceAmount > 0) {
        priceValue = bootcamp.priceAmount;
      } else if (bootcamp.price && typeof bootcamp.price === 'string') {
        const parsed = parseFloat(bootcamp.price.replace(/[^0-9.]/g, ''));
        priceValue = (!isNaN(parsed) && parsed > 0) ? parsed : (isTestMode ? 1 : 30);
      } else {
        priceValue = isTestMode ? 1 : 30;
        console.warn('No valid price found for bootcamp, using fallback:', priceValue);
      }

      // Prepare product details for Stripe
      productDetails = {
        name: bootcamp.title || 'Bootcamp',
        description: bootcamp.description || '',
        price: priceValue
      };

      amount = priceValue * 100; // Convert to cents
      console.log('Price calculation:', { priceValue, amount, currency: 'USD' });
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "booking" or "bootcamp"' },
        { status: 400 }
      );
    }

    // Validate amount before creating Stripe session
    if (!amount || amount <= 0) {
      console.error('Invalid amount for Stripe session:', amount);
      return NextResponse.json(
        { 
          error: 'Invalid price for bootcamp',
          details: `Amount must be greater than 0, got: ${amount}`
        },
        { status: 400 }
      );
    }

    console.log('Creating Stripe checkout session with:', {
      productName: productDetails.name,
      amount: amount,
      currency: 'usd',
      customerEmail: body.customerEmail,
      type: body.type
    });

    // Create Stripe checkout session
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        currency: 'usd',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: productDetails.name,
                description: productDetails.description || undefined,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        customer_email: body.customerEmail,
        metadata: {
          type: body.type,
          customerEmail: body.customerEmail,
          customerName: body.customerName || '',
          ...(body.type === 'booking' ? {
            meetingTypeId: body.meetingTypeId
          } : {
            bootcampId: body.bootcampId,
            notes: body.notes || ''
          })
        },
        success_url: body.type === 'bootcamp' 
          ? `${getBaseUrl()}/bootcamp/${encodeURIComponent(body.bootcampId)}/register?payment=success&session_id={CHECKOUT_SESSION_ID}`
          : `${getBaseUrl()}/meetings?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: body.type === 'bootcamp'
          ? `${getBaseUrl()}/bootcamp/${encodeURIComponent(body.bootcampId)}/register?payment=cancelled`
          : `${getBaseUrl()}/meetings?payment=cancelled`,
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes from now
      });
      
      console.log('Stripe session created successfully:', session.id);
    } catch (stripeError: any) {
      console.error('Stripe API error:', {
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code,
        param: stripeError.param,
        raw: stripeError
      });
      return NextResponse.json(
        { 
          error: 'Failed to create Stripe checkout session',
          details: stripeError.message || 'Unknown Stripe error',
          stripeError: stripeError.type || 'unknown'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      amount: amount,
      currency: 'USD',
      productName: productDetails.name,
      expiresAt: new Date(session.expires_at! * 1000).toISOString()
    });

  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
