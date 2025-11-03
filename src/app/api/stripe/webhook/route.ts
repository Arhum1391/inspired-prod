import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { stripe, verifyWebhookSignature } from '@/lib/stripe';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = 'inspired-analyst';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event;
    try {
      event = verifyWebhookSignature(body, signature);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`✅ Received webhook event: ${event.type}`);

    // Process webhook asynchronously (don't wait for DB operations)
    // This prevents timeouts while still processing the webhook
    setImmediate(() => {
      processWebhookAsync(event).catch(error => {
        console.error('Async webhook processing error:', error);
      });
    });

    // Immediately return success to prevent timeout
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function processWebhookAsync(event: any) {
  console.log(`Processing webhook: ${event.type}`);
  
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    // Handle subscription events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(`✅ Payment completed for session: ${session.id}`);
      
      // Extract metadata
      const metadata = session.metadata || {};
      const type = metadata.type || (session.mode === 'subscription' ? 'subscription' : null);
      
      if (!type) {
        console.log('⚠️ No type in metadata, skipping database save');
        await client.close();
        return;
      }

      try {
        if (type === 'subscription' || session.mode === 'subscription') {
          // Handle subscription checkout completion
          const subscriptionId = session.subscription;
          if (subscriptionId) {
            const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
            
            // Get user ID from metadata or find by email
            let userId = metadata.userId ? new ObjectId(metadata.userId) : null;
            if (!userId && metadata.customerEmail) {
              const user = await db.collection('public_users').findOne({ email: metadata.customerEmail });
              if (user) userId = user._id;
            }

            if (!userId) {
              console.log('⚠️ Could not find user for subscription');
              await client.close();
              return;
            }

            // Check if subscription already exists
            const existingSubscription = await db.collection('subscriptions').findOne({
              stripeSubscriptionId: subscriptionId
            });

            if (existingSubscription) {
              console.log(`ℹ️ Subscription already exists for ${subscriptionId}`);
              await client.close();
              return;
            }

            // Determine plan type and price
            const planType = metadata.plan === 'annual' ? 'annual' : 'monthly';
            const planName = planType === 'annual' ? 'Premium Annual' : 'Premium Monthly';
            const price = planType === 'annual' ? '120 BNB' : '30 BNB';

            // Create subscription record
            const subscription = {
              userId: userId,
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: stripeSubscription.customer,
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
            console.log(`✅ Subscription created for user ${userId}`);

            // Save payment method from subscription
            try {
              const paymentMethodId = stripeSubscription.default_payment_method;
              if (paymentMethodId) {
                const stripePaymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
                
                const paymentMethod = {
                  userId: userId,
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
                  { userId: userId, isDefault: true },
                  { $set: { isDefault: false } }
                );

                // Insert new payment method
                await db.collection('payment_methods').insertOne(paymentMethod);
                console.log(`✅ Payment method saved for user ${userId}`);
              }
            } catch (pmError) {
              console.error('Error saving payment method:', pmError);
              // Continue even if payment method save fails
            }

            // Create initial billing record for the subscription creation
            try {
              const invoice = {
                userId: userId,
                subscriptionId: subscriptionId,
                invoiceId: `INV-${Date.now()}`,
                amount: planType === 'annual' ? 120 : 30,
                currency: 'bnb',
                status: 'paid',
                paidAt: new Date(),
                createdAt: new Date()
              };
              await db.collection('billing_history').insertOne(invoice);
              console.log(`✅ Initial billing record created for subscription ${subscriptionId}`);
            } catch (billingError) {
              console.error('Error creating billing record:', billingError);
              // Continue even if billing record creation fails
            }
          }
        } else if (type === 'bootcamp') {
          // Check if this session already exists to prevent duplicates
          const existingRegistration = await db.collection('bootcamp_registrations').findOne({
            stripeSessionId: session.id
          });

          if (existingRegistration) {
            console.log(`ℹ️ Registration already exists for session ${session.id}, skipping duplicate`);
            await client.close();
            return;
          }

          // Create bootcamp registration record
          const registration = {
            stripeSessionId: session.id,
            bootcampId: metadata.bootcampId,
            customerName: metadata.customerName,
            customerEmail: metadata.customerEmail,
            notes: metadata.notes || '',
            amount: session.amount_total / 100,
            currency: session.currency,
            paymentStatus: 'paid',
            status: 'confirmed',
            createdAt: new Date(),
            updatedAt: new Date()
          };

          await db.collection('bootcamp_registrations').insertOne(registration);
          console.log(`✅ Bootcamp registration saved for ${metadata.customerEmail}`);
          
        } else if (type === 'booking') {
          // Check if this session already exists to prevent duplicates
          const existingBooking = await db.collection('bookings').findOne({
            stripeSessionId: session.id
          });

          if (existingBooking) {
            console.log(`ℹ️ Booking already exists for session ${session.id}, skipping duplicate`);
            await client.close();
            return;
          }

          // Create booking record
          const booking = {
            stripeSessionId: session.id,
            meetingTypeId: metadata.meetingTypeId,
            customerName: metadata.customerName,
            customerEmail: metadata.customerEmail,
            amount: session.amount_total / 100,
            currency: session.currency,
            paymentStatus: 'paid',
            status: 'confirmed',
            createdAt: new Date(),
            updatedAt: new Date()
          };

          await db.collection('bookings').insertOne(booking);
          console.log(`✅ Booking saved for ${metadata.customerEmail}`);
        }

        await client.close();
      } catch (dbError) {
        console.error('Database error in webhook:', dbError);
        await client.close();
      }
    } else if (event.type === 'customer.subscription.updated') {
      // Handle subscription updates (status changes, plan changes, etc.)
      const subscription = event.data.object;
      console.log(`✅ Subscription updated: ${subscription.id}`);

      await db.collection('subscriptions').updateOne(
        { stripeSubscriptionId: subscription.id },
        {
          $set: {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            updatedAt: new Date()
          }
        }
      );

      await client.close();
    } else if (event.type === 'customer.subscription.deleted') {
      // Handle subscription cancellation and delete user account
      const subscription = event.data.object;
      console.log(`✅ Subscription canceled: ${subscription.id}`);

      // Find the subscription in our database
      const dbSubscription = await db.collection('subscriptions').findOne({
        stripeSubscriptionId: subscription.id
      });

      if (dbSubscription && dbSubscription.userId) {
        // Ensure userId is an ObjectId
        const userId = dbSubscription.userId instanceof ObjectId 
          ? dbSubscription.userId 
          : new ObjectId(dbSubscription.userId);
        const userIdString = userId.toString();

        console.log(`Deleting account and all data for user ${userIdString}`);

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

        // Delete bookings (Calendly) - uses string userId
        const bookingsResult = await db.collection('bookings').deleteMany({
          userId: userIdString
        });
        console.log(`Deleted ${bookingsResult.deletedCount} booking(s) for user ${userIdString}`);

        // Delete bootcamp registrations - uses string userId
        const bootcampRegistrationsResult = await db.collection('bootcamp_registrations').deleteMany({
          userId: userIdString
        });
        console.log(`Deleted ${bootcampRegistrationsResult.deletedCount} bootcamp registration(s) for user ${userIdString}`);

        // Finally, delete the user account
        const userResult = await db.collection('public_users').deleteOne({
          _id: userId
        });
        console.log(`Deleted user account: ${userIdString}`);
      } else {
        // Update subscription status even if we can't find user (edge case)
        await db.collection('subscriptions').updateOne(
          { stripeSubscriptionId: subscription.id },
          {
            $set: {
              status: 'canceled',
              canceledAt: new Date(),
              updatedAt: new Date()
            }
          }
        );
      }

      await client.close();
    } else if (event.type === 'invoice.payment_succeeded') {
      // Handle successful subscription renewal payments
      const invoice = event.data.object;
      
      if (invoice.subscription) {
        console.log(`✅ Invoice payment succeeded for subscription: ${invoice.subscription}`);

        // Create billing history record
        const billingRecord = {
          userId: null, // Will be populated from subscription
          subscriptionId: invoice.subscription,
          invoiceId: invoice.id,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: 'paid',
          paidAt: new Date(invoice.created * 1000),
          createdAt: new Date()
        };

        // Get subscription to find userId
        const subscription = await db.collection('subscriptions').findOne({
          stripeSubscriptionId: invoice.subscription
        });

        if (subscription) {
          billingRecord.userId = subscription.userId;
          
          // Add invoice URL if available
          if (invoice.hosted_invoice_url) {
            billingRecord.invoiceUrl = invoice.hosted_invoice_url;
          }
          
          await db.collection('billing_history').insertOne(billingRecord);
          console.log(`✅ Billing record created for subscription ${invoice.subscription}`);
        }
      }

      await client.close();
    } else {
      // Log other events but don't process them
      console.log(`ℹ️ Event ${event.type} received but not processed`);
      await client.close();
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
  }
}
