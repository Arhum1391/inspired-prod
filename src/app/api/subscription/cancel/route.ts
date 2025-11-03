import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { stripe } from '@/lib/stripe';

/**
 * Deletes user account and all related data from MongoDB
 */
async function deleteUserAccount(userId: ObjectId) {
  const db = await getDatabase();
  const userIdString = userId.toString();

  try {
    // Delete user subscriptions
    const subscriptionsResult = await db.collection('subscriptions').deleteMany({
      userId: userId
    });
    console.log(`Deleted ${subscriptionsResult.deletedCount} subscription(s) for user ${userIdString}`);

    // Delete payment methods
    const paymentMethodsResult = await db.collection('payment_methods').deleteMany({
      userId: userId
    });
    console.log(`Deleted ${paymentMethodsResult.deletedCount} payment method(s) for user ${userIdString}`);

    // Delete billing history
    const billingHistoryResult = await db.collection('billing_history').deleteMany({
      userId: userId
    });
    console.log(`Deleted ${billingHistoryResult.deletedCount} billing record(s) for user ${userIdString}`);

    // Delete bookings (Calendly)
    const bookingsResult = await db.collection('bookings').deleteMany({
      userId: userIdString
    });
    console.log(`Deleted ${bookingsResult.deletedCount} booking(s) for user ${userIdString}`);

    // Delete bootcamp registrations
    const bootcampRegistrationsResult = await db.collection('bootcamp_registrations').deleteMany({
      userId: userIdString
    });
    console.log(`Deleted ${bootcampRegistrationsResult.deletedCount} bootcamp registration(s) for user ${userIdString}`);

    // Finally, delete the user account
    const userResult = await db.collection('public_users').deleteOne({
      _id: userId
    });
    console.log(`Deleted user account: ${userIdString}`);

    return {
      success: userResult.deletedCount > 0,
      deletedCounts: {
        subscriptions: subscriptionsResult.deletedCount,
        paymentMethods: paymentMethodsResult.deletedCount,
        billingHistory: billingHistoryResult.deletedCount,
        bookings: bookingsResult.deletedCount,
        bootcampRegistrations: bootcampRegistrationsResult.deletedCount,
        user: userResult.deletedCount
      }
    };
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
}

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

    const body = await request.json();
    const { reason } = body;

    const userId = new ObjectId(decoded.userId);
    const db = await getDatabase();
    
    // Find subscription(s) for this user
    const subscriptions = await db.collection('subscriptions').find({
      userId: userId,
      status: { $in: ['active', 'trialing', 'past_due'] }
    }).toArray();

    // Cancel subscriptions in Stripe immediately
    for (const subscription of subscriptions) {
      if (subscription.stripeSubscriptionId) {
        try {
          // Cancel immediately instead of at period end
          await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
          console.log(`Canceled Stripe subscription: ${subscription.stripeSubscriptionId}`);
        } catch (stripeError: any) {
          console.error('Error canceling Stripe subscription:', stripeError);
          // If subscription is already canceled or doesn't exist, continue
          if (stripeError.code !== 'resource_missing') {
            // Continue with deletion even if Stripe fails
          }
        }
      }
    }

    // Delete user account and all related data from MongoDB
    const deletionResult = await deleteUserAccount(userId);

    if (!deletionResult.success) {
      return NextResponse.json(
        { error: 'Failed to delete user account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Account and all related data have been deleted',
      deleted: deletionResult.deletedCounts
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

