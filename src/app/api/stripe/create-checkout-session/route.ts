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

    // Simple validation
    if (!body.type || !body.customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
      productDetails = meetingType;
      amount = meetingType.price * 100; // Convert to cents
    } else if (body.type === 'bootcamp') {
      // Fetch bootcamp from database
      const db = await getDatabase();
      const bootcamp: Bootcamp | null = await db.collection('bootcamps').findOne({ 
        id: body.bootcampId,
        isActive: true 
      });
      
      if (!bootcamp) {
        return NextResponse.json(
          { error: 'Invalid bootcamp or bootcamp not active' },
          { status: 400 }
        );
      }

      // Prepare product details for Stripe
      productDetails = {
        name: bootcamp.title,
        description: bootcamp.description,
        price: bootcamp.priceAmount || parseFloat(bootcamp.price.replace(/[^0-9.]/g, '')) || (isTestMode ? 1 : 30)
      };

      // Use priceAmount if available, otherwise parse from price string, with fallback
      const priceValue = bootcamp.priceAmount || parseFloat(bootcamp.price.replace(/[^0-9.]/g, '')) || (isTestMode ? 1 : 30);
      amount = priceValue * 100; // Convert to cents
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "booking" or "bootcamp"' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'usd',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productDetails.name,
              description: productDetails.description,
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
        ? `${getBaseUrl()}/bootcamp/${body.bootcampId}/register?payment=success&session_id={CHECKOUT_SESSION_ID}`
        : `${getBaseUrl()}/meetings?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.type === 'bootcamp'
        ? `${getBaseUrl()}/bootcamp/${body.bootcampId}/register?payment=cancelled`
        : `${getBaseUrl()}/meetings?payment=cancelled`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes from now
    });

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
