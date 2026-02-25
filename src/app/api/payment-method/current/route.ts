import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
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

    const db = await getDatabase();
    
    // First try to get from database
    let paymentMethod = await db.collection('payment_methods').findOne({
      userId: new ObjectId(decoded.userId),
      isDefault: true
    }, { sort: { createdAt: -1 } });

    // If not found in database, try to get from Stripe subscription
    if (!paymentMethod) {
      const subscription = await db.collection('subscriptions').findOne({
        userId: new ObjectId(decoded.userId),
        status: { $in: ['active', 'trialing', 'past_due'] }
      }, { sort: { createdAt: -1 } });

      if (subscription?.stripeSubscriptionId) {
        try {
          const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
          const paymentMethodId = stripeSubscription.default_payment_method;

          if (paymentMethodId) {
            const stripePaymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId as string);
            
            // Save to database for future use
            const newPaymentMethod = {
              userId: new ObjectId(decoded.userId),
              stripePaymentMethodId: paymentMethodId,
              stripeCustomerId: stripeSubscription.customer,
              last4: stripePaymentMethod.card?.last4,
              brand: stripePaymentMethod.card?.brand,
              expMonth: stripePaymentMethod.card?.exp_month,
              expYear: stripePaymentMethod.card?.exp_year,
              isDefault: true,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            // Remove existing default payment method for this user
            await db.collection('payment_methods').updateMany(
              { userId: new ObjectId(decoded.userId), isDefault: true },
              { $set: { isDefault: false } }
            );

            // Insert new payment method
            await db.collection('payment_methods').insertOne(newPaymentMethod);
            paymentMethod = newPaymentMethod;
          }
        } catch (stripeError) {
          console.error('Error fetching payment method from Stripe:', stripeError);
          // Continue to return null if Stripe fetch fails
        }
      }
    }

    if (!paymentMethod) {
      return NextResponse.json({
        paymentMethod: null
      });
    }

    return NextResponse.json({
      paymentMethod: {
        id: paymentMethod._id?.toString() || paymentMethod.stripePaymentMethodId,
        last4: paymentMethod.last4,
        brand: paymentMethod.brand,
        expMonth: paymentMethod.expMonth,
        expYear: paymentMethod.expYear,
      }
    });
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

