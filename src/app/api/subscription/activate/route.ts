import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 },
      );
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product', 'latest_invoice.payment_intent', 'customer'],
    });

    const metadata = subscription.metadata || {};
    const userId = metadata.userId || null;
    const fallbackEmail =
      metadata.customerEmail ||
      (typeof subscription.customer === 'object' ? subscription.customer.email : null);

    const db = await getDatabase();
    let userDoc = null;

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

    if (!userDoc) {
      return NextResponse.json(
        { error: 'Unable to locate user for subscription activation' },
        { status: 404 },
      );
    }

    const planInterval =
      subscription.items.data[0]?.price?.recurring?.interval === 'year' ? 'annual' : 'monthly';
    const planName = planInterval === 'annual' ? 'Premium Annual' : 'Premium Monthly';
    const formattedPrice = planInterval === 'annual' ? '$120 USD' : '$30 USD';

    await db.collection('public_users').updateOne(
      { _id: userDoc._id },
      {
        $set: {
          isPaid: true,
          subscriptionStatus: subscription.status ?? 'active',
          lastPaymentAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    const subscriptionRecord = {
      userId: userDoc._id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId:
        typeof subscription.customer === 'object' ? subscription.customer.id : subscription.customer,
      planName,
      planType: planInterval,
      price: formattedPrice,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date(),
    };

    await db.collection('subscriptions').updateOne(
      { stripeSubscriptionId: subscription.id },
      {
        $set: subscriptionRecord,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription activation error:', error);
    return NextResponse.json(
      { error: 'Failed to activate subscription' },
      { status: 500 },
    );
  }
}


