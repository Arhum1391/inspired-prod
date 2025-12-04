import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import Stripe from 'stripe';

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

    if (plan !== 'monthly' && plan !== 'annual' && plan !== 'platinum') {
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

    // Fetch plan from database
    const db = await getDatabase();
    const plansCollection = db.collection('plans');
    const planData = await plansCollection.findOne({ planId: plan, isActive: true });

    if (!planData) {
      return NextResponse.json(
        { error: 'Plan not found or inactive' },
        { status: 404 },
      );
    }

    // If plan is free, skip Stripe and return success immediately
    if (planData.isFree) {
      // Create a mock subscription ID for free plans
      const mockSubscriptionId = `free_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return NextResponse.json({
        clientSecret: null, // No payment needed
        subscriptionId: mockSubscriptionId,
        customerId: null,
        plan: {
          name: planData.name,
          amount: 0,
          currency: 'usd',
          interval: planData.billingInterval === '6 months' ? '6 months' : planData.billingInterval,
        },
        isFree: true,
      });
    }

    // Use Stripe Price ID from plan data or environment
    const priceId = planData.stripePriceId || process.env[`STRIPE_PRICE_ID_${plan.toUpperCase()}`];

    if (!priceId) {
      return NextResponse.json(
        {
          error: `Stripe price ID not configured for ${plan} plan. Please configure it in the admin panel or set STRIPE_PRICE_ID_${plan.toUpperCase()} in your environment.`,
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
        name: planData.name,
        amount: planData.priceAmount,
        currency: 'usd',
        interval: planData.billingInterval === '6 months' ? '6 months' : planData.billingInterval,
      },
      isFree: false,
    });
  } catch (error: any) {
    console.error('Error creating subscription intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize subscription' },
      { status: 500 },
    );
  }
}

