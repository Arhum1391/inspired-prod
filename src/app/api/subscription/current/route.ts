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
    
    // First, try to find subscription in database (any status)
    let subscription = await db.collection('subscriptions').findOne({
      userId: new ObjectId(decoded.userId)
    }, { sort: { createdAt: -1 } });

    // If not in database, try to find user and check Stripe by email
    if (!subscription) {
      try {
        const user = await db.collection('public_users').findOne({
          _id: new ObjectId(decoded.userId)
        });

        if (user?.email) {
          // Search for customer in Stripe by email
          const customers = await stripe.customers.list({
            email: user.email,
            limit: 1
          });

          if (customers.data.length > 0) {
            const customer = customers.data[0];
            
            // Get subscriptions for this customer
            const subscriptions = await stripe.subscriptions.list({
              customer: customer.id,
              status: 'all',
              limit: 1
            });

            if (subscriptions.data.length > 0) {
              const stripeSubscription = subscriptions.data[0];
              
              // Fetch plan from database
              const priceItem = stripeSubscription.items.data[0]?.price;
              const plansCollection = db.collection('plans');
              
              // Try to find plan by Stripe price ID first
              let planData = await plansCollection.findOne({ stripePriceId: priceItem?.id });
              
              if (!planData) {
                // Fallback to matching by interval and amount
                const interval = priceItem?.recurring?.interval;
                const intervalCount = priceItem?.recurring?.interval_count || 1;
                const amount = priceItem?.unit_amount ? priceItem.unit_amount / 100 : 0;
                
                if (interval === 'year' && amount === 100) {
                  planData = await plansCollection.findOne({ planId: 'annual' });
                } else if (interval === 'month' && intervalCount === 6 && amount === 60) {
                  planData = await plansCollection.findOne({ planId: 'platinum' });
                } else if (interval === 'month' && intervalCount === 1 && amount === 30) {
                  planData = await plansCollection.findOne({ planId: 'monthly' });
                }
              }

              let planType: string;
              let planName: string;
              let price: string;

              if (planData) {
                planType = planData.planId;
                planName = planData.name;
                price = planData.isFree ? 'FREE' : planData.priceDisplay;
              } else {
                // Fallback to hardcoded values
                const interval = priceItem?.recurring?.interval;
                const intervalCount = priceItem?.recurring?.interval_count || 1;
                
                if (interval === 'year') {
                  planType = 'annual';
                  planName = 'Diamond';
                  price = '$100 USD';
                } else if (interval === 'month' && intervalCount === 6) {
                  planType = 'platinum';
                  planName = 'Platinum';
                  price = '$60 USD';
                } else {
                  planType = 'monthly';
                  planName = 'Premium';
                  price = '$30 USD';
                }
              }

              // Save subscription to database
              subscription = {
                userId: new ObjectId(decoded.userId),
                stripeSubscriptionId: stripeSubscription.id,
                stripeCustomerId: customer.id,
                planName: planName,
                planType: planType,
                price: price,
                status: stripeSubscription.status,
                currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
                currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
                createdAt: new Date(),
                updatedAt: new Date()
              };

              await db.collection('subscriptions').insertOne(subscription);
              console.log(`✅ Subscription synced from Stripe for user ${decoded.userId}`);
            }
          }
        }
      } catch (stripeError) {
        console.error('Error fetching subscription from Stripe:', stripeError);
      }
    }

    // If subscription found, sync with Stripe to ensure it's up to date
    if (subscription?.stripeSubscriptionId) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
        
        // Update subscription in database with latest Stripe data
        await db.collection('subscriptions').updateOne(
          { _id: subscription._id },
          {
            $set: {
              status: stripeSubscription.status,
              currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
              currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
              cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
              updatedAt: new Date()
            }
          }
        );

        // Refresh subscription from database
        subscription = await db.collection('subscriptions').findOne({
          _id: subscription._id
        });
      } catch (stripeError) {
        console.error('Error syncing subscription with Stripe:', stripeError);
        // Continue with database subscription even if Stripe sync fails
      }
    }

    // Check if subscription has valid status for access
    if (!subscription || !subscription.status) {
      return NextResponse.json({
        subscription: null
      });
    }

    // Only return subscription if it's in an active state
    if (!['active', 'trialing', 'past_due'].includes(subscription.status)) {
      return NextResponse.json({
        subscription: null
      });
    }

    // Fetch plan details from database for accurate display
    const plansCollection = db.collection('plans');
    const planData = await plansCollection.findOne({ planId: subscription.planType });
    
    // Format price for display
    let displayPrice = subscription.price;
    if (planData) {
      displayPrice = planData.isFree ? 'FREE' : planData.priceDisplay;
    } else {
      // Fallback to hardcoded formatting
      if (subscription.planType === 'annual') {
        displayPrice = subscription.price + ' /year';
      } else if (subscription.planType === 'platinum') {
        displayPrice = subscription.price + '/6 months';
      } else {
        displayPrice = subscription.price + ' /month';
      }
    }

    return NextResponse.json({
      subscription: {
        id: subscription._id.toString(),
        planName: subscription.planName,
        planType: subscription.planType,
        price: subscription.price, // Keep original for calculations
        displayPrice: displayPrice, // Formatted for display
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        currentPeriodStart: subscription.currentPeriodStart,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
      }
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

