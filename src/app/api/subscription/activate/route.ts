import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken, getPublicUserById } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, planId, customerEmail: requestCustomerEmail } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    
    // Check if this is a free plan (subscriptionId starts with "free_")
    const isFreePlan = subscriptionId.startsWith('free_');
    
    let userDoc = null;
    let planInterval: string;
    let planName: string;
    let formattedPrice: string;
    let subscription: any = null;

    if (isFreePlan && planId) {
      // Free plan - fetch plan details from database
      const plansCollection = db.collection('plans');
      const planData = await plansCollection.findOne({ planId, isActive: true });
      
      if (!planData) {
        return NextResponse.json(
          { error: 'Plan not found' },
          { status: 404 },
        );
      }

      planInterval = planData.planId;
      planName = planData.name;
      formattedPrice = planData.isFree ? 'FREE' : planData.priceDisplay;

      // Get user from request body, session token, or email
      let customerEmail = requestCustomerEmail;
      
      console.log('Free plan activation - planId:', planId, 'customerEmail:', customerEmail);
      
      // Try to get user from auth token if email not provided
      if (!customerEmail) {
        try {
          const token = request.cookies.get('user-auth-token')?.value;
          console.log('Token found:', !!token);
          if (token) {
            const decoded = verifyToken(token);
            console.log('Token decoded:', !!decoded, decoded ? `userId: ${decoded.userId}` : '');
            if (decoded) {
              // Use getPublicUserById for public users (not admin users)
              const user = await getPublicUserById(decoded.userId);
              console.log('User found from token:', !!user, user ? `email: ${user.email}` : '');
              if (user) {
                customerEmail = user.email;
                userDoc = await db.collection('public_users').findOne({ _id: new ObjectId(decoded.userId) });
                console.log('User doc found:', !!userDoc);
              }
            }
          }
        } catch (tokenError) {
          console.error('Error getting user from token:', tokenError);
        }
      }
      
      // If still no user, try to find by email
      if (!userDoc && customerEmail) {
        console.log('Looking up user by email:', customerEmail);
        userDoc = await db.collection('public_users').findOne({ email: customerEmail });
        console.log('User found by email:', !!userDoc);
      }
      
      // If still no user found, return error with helpful message
      if (!userDoc) {
        console.error('User lookup failed - customerEmail:', customerEmail, 'planId:', planId);
        return NextResponse.json(
          { error: `User not found. Email: ${customerEmail || 'not provided'}. Please ensure you are logged in.` },
          { status: 404 },
        );
      }
    } else {
      // Regular Stripe subscription
      subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['items.data.price.product', 'latest_invoice.payment_intent', 'customer'],
      });

      const metadata = subscription.metadata || {};
      const userId = metadata.userId || null;
      const fallbackEmail =
        metadata.customerEmail ||
        (typeof subscription.customer === 'object' ? subscription.customer.email : null);

      if (userId) {
        try {
          userDoc = await db.collection('public_users').findOne({ _id: new ObjectId(userId) });
        } catch (error) {
          console.error('Invalid userId in subscription metadata:', error);
        }
      }

      if (!userDoc && fallbackEmail) {
        userDoc = await db.collection('public_users').findOne({ email: fallbackEmail });
      }

      // Fetch plan from database based on Stripe subscription
      const priceItem = subscription.items.data[0]?.price;
      const interval = priceItem?.recurring?.interval;
      const intervalCount = priceItem?.recurring?.interval_count || 1;
      const amount = priceItem?.unit_amount ? priceItem.unit_amount / 100 : 0;

      // Try to find plan in database by matching Stripe price ID or plan attributes
      const plansCollection = db.collection('plans');
      let planData = await plansCollection.findOne({ stripePriceId: priceItem?.id });
      
      if (!planData) {
        // Fallback to matching by interval and amount
        if (interval === 'year' && amount === 100) {
          planData = await plansCollection.findOne({ planId: 'annual' });
        } else if (interval === 'month' && intervalCount === 6 && amount === 60) {
          planData = await plansCollection.findOne({ planId: 'platinum' });
        } else if (interval === 'month' && intervalCount === 1 && amount === 30) {
          planData = await plansCollection.findOne({ planId: 'monthly' });
        }
      }

      if (planData) {
        planInterval = planData.planId;
        planName = planData.name;
        formattedPrice = planData.isFree ? 'FREE' : planData.priceDisplay;
      } else {
        // Fallback to hardcoded logic
        if (interval === 'year') {
          planInterval = 'annual';
          planName = 'Diamond';
          formattedPrice = '$100 USD';
        } else if (interval === 'month' && intervalCount === 6) {
          planInterval = 'platinum';
          planName = 'Platinum';
          formattedPrice = '$60 USD';
        } else {
          planInterval = 'monthly';
          planName = 'Premium';
          formattedPrice = '$30 USD';
        }
      }
    }

    if (!userDoc) {
      return NextResponse.json(
        { error: 'Unable to locate user for subscription activation' },
        { status: 404 },
      );
    }

    // Calculate period dates
    const now = new Date();
    let currentPeriodStart = now;
    let currentPeriodEnd = now;
    
    if (subscription) {
      currentPeriodStart = new Date(subscription.current_period_start * 1000);
      currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    } else if (isFreePlan) {
      // For free plans, set period based on plan interval
      currentPeriodStart = now;
      if (planInterval === 'annual') {
        currentPeriodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      } else if (planInterval === 'platinum') {
        currentPeriodEnd = new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
      } else {
        currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      }
    }

    await db.collection('public_users').updateOne(
      { _id: userDoc._id },
      {
        $set: {
          isPaid: true,
          subscriptionStatus: subscription?.status ?? 'active',
          lastPaymentAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    const subscriptionRecord = {
      userId: userDoc._id,
      stripeSubscriptionId: subscription?.id || subscriptionId,
      stripeCustomerId: subscription
        ? (typeof subscription.customer === 'object' ? subscription.customer.id : subscription.customer)
        : null,
      planName,
      planType: planInterval,
      price: formattedPrice,
      status: subscription?.status ?? 'active',
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
      isFree: isFreePlan,
      updatedAt: new Date(),
    };

    await db.collection('subscriptions').updateOne(
      { stripeSubscriptionId: subscriptionId },
      {
        $set: subscriptionRecord,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );

    // Check if initial billing history exists, if not create it (only for paid plans)
    if (!isFreePlan && subscription) {
      try {
        const existingBilling = await db.collection('billing_history').findOne({
          subscriptionId: subscription.id
        });

        if (!existingBilling) {
          // Get the latest invoice for this subscription
          const invoices = await stripe.invoices.list({
            subscription: subscription.id,
            limit: 1,
          });

          if (invoices.data.length > 0) {
            const latestInvoice = invoices.data[0];
            
            // Only create billing history if invoice is paid
            if (latestInvoice.status === 'paid' || latestInvoice.paid) {
              const billingRecord = {
                userId: userDoc._id,
                subscriptionId: subscription.id,
                invoiceId: latestInvoice.id,
                amount: latestInvoice.amount_paid / 100,
                currency: latestInvoice.currency || 'usd',
                status: 'paid',
                paidAt: new Date(latestInvoice.created * 1000),
                invoiceUrl: latestInvoice.hosted_invoice_url || null,
                createdAt: new Date()
              };

              await db.collection('billing_history').insertOne(billingRecord);
              console.log(`✅ Initial billing history created for subscription ${subscription.id}`);
            }
          }
        }
      } catch (billingError) {
        console.error('Error creating billing history in activation:', billingError);
        // Don't fail the activation if billing history creation fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription activation error:', error);
    return NextResponse.json(
      { error: 'Failed to activate subscription' },
      { status: 500 },
    );
  }
}


