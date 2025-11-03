import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { verifyToken } from '@/lib/auth';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_ENV === 'production') {
    return 'https://inspired-analyst.vercel.app';
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

const planConfig = {
  monthly: {
    priceId: process.env.STRIPE_PRICE_ID_MONTHLY || 'price_monthly',
    amount: 30, // BNB amount
    currency: 'usd',
    name: 'Premium Monthly',
  },
  annual: {
    priceId: process.env.STRIPE_PRICE_ID_ANNUAL || 'price_annual',
    amount: 120, // BNB amount
    currency: 'usd',
    name: 'Premium Annual',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, customerEmail, customerName } = body;

    if (!plan || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (plan !== 'monthly' && plan !== 'annual') {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Get user from token if available
    const token = request.cookies.get('user-auth-token')?.value;
    let userId: string | null = null;
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    const config = planConfig[plan];
    const baseUrl = getBaseUrl();

    // Create Stripe checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: config.currency,
            product_data: {
              name: config.name,
              description: `Premium subscription - ${plan === 'monthly' ? 'Monthly' : 'Annual'} billing`,
            },
            unit_amount: config.amount * 100, // Convert to cents (assuming 1 BNB = $1 for now)
            recurring: {
              interval: plan === 'monthly' ? 'month' : 'year',
            },
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        plan: plan,
        userId: userId || '',
        customerEmail: customerEmail,
        customerName: customerName || '',
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Error creating subscription session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

