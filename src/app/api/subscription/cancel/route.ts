import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('user-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = new ObjectId(decoded.userId);
    const db = await getDatabase();
    
    // Find subscription(s) for this user
    const subscriptions = await db.collection('subscriptions').find({
      userId: userId,
      status: { $in: ['active', 'trialing', 'past_due'] }
    }).toArray();

    if (subscriptions.length === 0) {
      return NextResponse.json({
        message: 'No active subscription found. Your account remains on the free plan.'
      });
    }

    // Cancel subscriptions in Stripe immediately
    for (const subscription of subscriptions) {
      if (subscription.stripeSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
          console.log(`Canceled Stripe subscription: ${subscription.stripeSubscriptionId}`);
        } catch (stripeError: any) {
          console.error('Error canceling Stripe subscription:', stripeError);
          if (stripeError.code !== 'resource_missing') {
            throw stripeError;
          }
        }
      }
    }

    // Update subscription records locally
    await db.collection('subscriptions').updateMany(
      { userId },
      {
        $set: {
          status: 'canceled',
          cancelAtPeriodEnd: false,
          canceledAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // Keep the user account but mark them as unpaid
    await db.collection('public_users').updateOne(
      { _id: userId },
      {
        $set: {
          isPaid: false,
          subscriptionStatus: 'canceled',
          updatedAt: new Date(),
        },
      }
    );

    const updatedUser = await db.collection('public_users').findOne({ _id: userId });

    return NextResponse.json({
      message: 'Subscription canceled. Your account remains active on the free plan.',
      user: updatedUser
        ? {
            id: updatedUser._id.toString(),
            email: updatedUser.email,
            name: updatedUser.name || null,
            isPaid: updatedUser.isPaid ?? false,
            subscriptionStatus: updatedUser.subscriptionStatus ?? 'canceled',
          }
        : null,
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

