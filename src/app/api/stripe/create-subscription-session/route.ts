import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { verifyToken } from '@/lib/auth';
import Stripe from 'stripe';

const planConfig = {
  monthly: {
    priceEnvKey: 'STRIPE_PRICE_ID_MONTHLY',
    amount: 30,
    currency: 'usd',
    name: 'Premium Monthly',
  },
  annual: {
    priceEnvKey: 'STRIPE_PRICE_ID_ANNUAL',
    amount: 120,
    currency: 'usd',
    name: 'Premium Annual',
  },
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, customerEmail, customerName } = body;

    if (!plan || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (plan !== 'monthly' && plan !== 'annual') {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 },
      );
    }

    const token = request.cookies.get('user-auth-token')?.value;
    let userId: string | null = null;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    const config = planConfig[plan];
    const priceId = process.env[config.priceEnvKey];

    if (!priceId) {
      return NextResponse.json(
        {
          error: `Stripe price ID not configured for ${plan} plan. Set ${config.priceEnvKey} in your environment.`,
        },
        { status: 500 },
      );
    }

    // Find or create customer
    let customer: Stripe.Customer | Stripe.DeletedCustomer | null = null;
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      if (!customer.deleted && customerName && !customer.name) {
        await stripe.customers.update(customer.id, { name: customerName });
      }
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName || undefined,
      });
    }

    if (!customer || customer.deleted) {
      return NextResponse.json(
        { error: 'Unable to create customer' },
        { status: 400 },
      );
    }

    // Create subscription in incomplete state to obtain PaymentIntent client secret
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId,
          metadata: {
            plan,
          },
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        plan,
        userId: userId || '',
        customerEmail,
        customerName: customerName || '',
      },
    });

    const paymentIntent = subscription.latest_invoice &&
      typeof subscription.latest_invoice !== 'string'
      ? subscription.latest_invoice.payment_intent
      : null;

    const clientSecret =
      paymentIntent &&
      typeof paymentIntent !== 'string' &&
      paymentIntent.client_secret
        ? paymentIntent.client_secret
        : null;

    if (!clientSecret) {
      return NextResponse.json(
        { error: 'Unable to initialize payment intent' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      clientSecret,
      subscriptionId: subscription.id,
      customerId: customer.id,
      plan: {
        name: config.name,
        amount: config.amount,
        currency: config.currency,
        interval: plan === 'monthly' ? 'month' : 'year',
      },
    });
  } catch (error: any) {
    console.error('Error creating subscription intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize subscription' },
      { status: 500 },
    );
  }
}

