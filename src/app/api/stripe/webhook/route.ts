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

// Helper function to get subscription ID from invoice
async function getSubscriptionFromInvoice(invoiceIdOrObject: string | any): Promise<string | null> {
  try {
    const invoice = typeof invoiceIdOrObject === 'string'
      ? await stripe.invoices.retrieve(invoiceIdOrObject)
      : invoiceIdOrObject;
    return invoice.subscription as string | null;
  } catch (error) {
    console.error('Error getting subscription from invoice:', error);
    return null;
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

            await db.collection('public_users').updateOne(
              { _id: userId },
              {
                $set: {
                  isPaid: true,
                  subscriptionStatus: stripeSubscription.status ?? 'active',
                  lastPaymentAt: new Date(),
                  updatedAt: new Date(),
                },
              }
            );
            console.log(`✅ Updated user ${userId} to paid status`);

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
            // Try to get the actual invoice from Stripe
            try {
              // Get the latest invoice for this subscription
              const invoices = await stripe.invoices.list({
                subscription: subscriptionId,
                limit: 1,
              });

              let invoiceId = `INV-${Date.now()}`;
              let amount = planType === 'annual' ? 120 : 30;
              let currency = 'usd';
              let invoiceUrl = null;
              let paidAt = new Date();

              if (invoices.data.length > 0) {
                const latestInvoice = invoices.data[0];
                invoiceId = latestInvoice.id;
                amount = latestInvoice.amount_paid / 100;
                currency = latestInvoice.currency || 'usd';
                invoiceUrl = latestInvoice.hosted_invoice_url || null;
                paidAt = new Date(latestInvoice.created * 1000);
              }

              // Check if billing record already exists
              const existingBilling = await db.collection('billing_history').findOne({
                invoiceId: invoiceId
              });

              if (!existingBilling) {
                const invoice = {
                  userId: userId,
                  subscriptionId: subscriptionId,
                  invoiceId: invoiceId,
                  amount: amount,
                  currency: currency,
                  status: 'paid',
                  paidAt: paidAt,
                  invoiceUrl: invoiceUrl,
                  createdAt: new Date()
                };
                await db.collection('billing_history').insertOne(invoice);
                console.log(`✅ Initial billing record created for subscription ${subscriptionId}`);
              } else {
                console.log(`ℹ️ Billing record already exists for invoice ${invoiceId}`);
              }
            } catch (billingError) {
              console.error('Error creating billing record:', billingError);
              // Continue even if billing record creation fails
            }
          }
        } else if (type === 'bootcamp') {
          console.log('🎓 [WEBHOOK] Processing bootcamp payment...', {
            sessionId: session.id,
            customerEmail: metadata.customerEmail,
            bootcampId: metadata.bootcampId,
            customerName: metadata.customerName,
            userIdInMetadata: metadata.userId
          });

          // Check if this session already exists to prevent duplicates
          const existingRegistration = await db.collection('bootcamp_registrations').findOne({
            stripeSessionId: session.id
          });

          if (existingRegistration) {
            console.log(`ℹ️ Registration already exists for session ${session.id}, skipping duplicate`);
            await client.close();
            return;
          }

          // Get user ID from metadata or find by email
          let userId = null;
          console.log('🔍 [WEBHOOK] Looking for user account...', {
            userIdInMetadata: metadata.userId,
            customerEmail: metadata.customerEmail
          });

          if (metadata.userId) {
            try {
              userId = new ObjectId(metadata.userId);
              console.log(`📝 [WEBHOOK] Found userId in metadata: ${userId}`);
            } catch (error) {
              console.error(`⚠️ [WEBHOOK] Invalid userId in metadata: ${metadata.userId}`, error);
            }
          }

          if (!userId && metadata.customerEmail) {
            console.log(`🔍 [WEBHOOK] Looking up user by email: ${metadata.customerEmail}`);
            const user = await db.collection('public_users').findOne({ 
              email: metadata.customerEmail.toLowerCase().trim() 
            });
            if (user) {
              userId = user._id;
              console.log(`✅ [WEBHOOK] Found user by email: ${userId}`);
            } else {
              console.log(`ℹ️ [WEBHOOK] No user found with email: ${metadata.customerEmail} (lowercase)`);
              // Try without lowercasing in case email format differs
              const userAlt = await db.collection('public_users').findOne({ 
                email: metadata.customerEmail.trim() 
              });
              if (userAlt) {
                userId = userAlt._id;
                console.log(`✅ [WEBHOOK] Found user with alternate email format: ${userId}`);
              } else {
                console.log(`ℹ️ [WEBHOOK] No user found with email: ${metadata.customerEmail} (original format)`);
              }
            }
          }

          console.log('👤 [WEBHOOK] User lookup result:', {
            userId: userId ? userId.toString() : null,
            willRequireSignup: !userId
          });

          // Validate bootcampId exists
          if (!metadata.bootcampId) {
            console.error('❌ Missing bootcampId in metadata', { metadata, sessionId: session.id });
            await client.close();
            return;
          }

          // Get bootcamp details for email
          const bootcamp = await db.collection('bootcamps').findOne({
            id: metadata.bootcampId,
            isActive: true
          });

          const bootcampTitle = bootcamp?.title || metadata.bootcampId;

          // If user doesn't exist, still create registration but send signup email
          if (!userId) {
            console.log('ℹ️ [WEBHOOK] No user account found for bootcamp purchase - will require signup', {
              customerEmail: metadata.customerEmail,
              bootcampId: metadata.bootcampId,
              sessionId: session.id,
              bootcampTitle: bootcampTitle
            });

            // Create bootcamp registration record with userId: null
            // This will be linked to the user when they sign up with the same email
            const registration = {
              userId: null,
              stripeSessionId: session.id,
              bootcampId: metadata.bootcampId,
              customerName: metadata.customerName || '',
              customerEmail: metadata.customerEmail || '',
              notes: metadata.notes || '',
              amount: session.amount_total / 100,
              currency: session.currency || 'usd',
              paymentStatus: 'paid',
              status: 'confirmed',
              requiresSignup: true, // Flag to indicate user needs to sign up
              createdAt: new Date(),
              updatedAt: new Date()
            };

            const result = await db.collection('bootcamp_registrations').insertOne(registration);
            console.log(`✅ Bootcamp registration saved (pending signup):`, {
              registrationId: result.insertedId,
              bootcampId: metadata.bootcampId,
              customerEmail: metadata.customerEmail,
              sessionId: session.id
            });

            // Send email to customer asking them to sign up
            console.log('📧 [WEBHOOK] Attempting to send bootcamp signup required email...', {
              customerEmail: metadata.customerEmail,
              customerName: metadata.customerName || '',
              bootcampTitle: bootcampTitle,
              bootcampId: metadata.bootcampId
            });
            
            try {
              const { sendBootcampSignupRequiredEmail } = await import('@/lib/email');
              console.log('📧 [WEBHOOK] Email function imported, calling sendBootcampSignupRequiredEmail...');
              
              await sendBootcampSignupRequiredEmail(
                metadata.customerEmail,
                metadata.customerName || '',
                bootcampTitle,
                metadata.bootcampId
              );
              
              console.log(`✅ [WEBHOOK] Signup required email sent successfully to ${metadata.customerEmail}`, {
                email: metadata.customerEmail,
                bootcampTitle: bootcampTitle,
                bootcampId: metadata.bootcampId
              });
            } catch (emailError: any) {
              console.error('❌ [WEBHOOK] Failed to send signup required email:', {
                error: emailError?.message || emailError,
                stack: emailError?.stack,
                customerEmail: metadata.customerEmail,
                bootcampTitle: bootcampTitle,
                bootcampId: metadata.bootcampId,
                errorDetails: emailError
              });
              // Don't fail the webhook if email fails - registration is still saved
            }

            await client.close();
            return;
          }

          // User exists - create registration normally
          const registration = {
            userId: userId,
            stripeSessionId: session.id,
            bootcampId: metadata.bootcampId,
            customerName: metadata.customerName || '',
            customerEmail: metadata.customerEmail || '',
            notes: metadata.notes || '',
            amount: session.amount_total / 100,
            currency: session.currency || 'usd',
            paymentStatus: 'paid',
            status: 'confirmed',
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const result = await db.collection('bootcamp_registrations').insertOne(registration);
          console.log(`✅ Bootcamp registration saved successfully:`, {
            registrationId: result.insertedId,
            userId: userId.toString(),
            bootcampId: metadata.bootcampId,
            customerEmail: metadata.customerEmail,
            sessionId: session.id
          });

          // Verify the registration was saved
          const verifyRegistration = await db.collection('bootcamp_registrations').findOne({
            _id: result.insertedId
          });
          if (!verifyRegistration) {
            console.error('❌ Registration verification failed - registration not found after insert');
          } else {
            console.log('✅ Registration verified in database');
          }

          // Send enrollment confirmation email to existing user
          try {
            const { sendBootcampEnrollmentEmail } = await import('@/lib/email');
            console.log('📧 [WEBHOOK] Attempting to send bootcamp enrollment email...', {
              customerEmail: metadata.customerEmail,
              customerName: metadata.customerName || '',
              bootcampTitle: bootcampTitle,
              bootcampId: metadata.bootcampId
            });
            
            await sendBootcampEnrollmentEmail(
              metadata.customerEmail || '',
              metadata.customerName || '',
              bootcampTitle,
              metadata.bootcampId,
              bootcamp?.description
            );
            
            console.log(`✅ [WEBHOOK] Enrollment email sent successfully to ${metadata.customerEmail}`, {
              email: metadata.customerEmail,
              bootcampTitle: bootcampTitle,
              bootcampId: metadata.bootcampId
            });
          } catch (emailError: any) {
            console.error('❌ [WEBHOOK] Failed to send enrollment email:', {
              error: emailError?.message || emailError,
              stack: emailError?.stack,
              customerEmail: metadata.customerEmail,
              bootcampTitle: bootcampTitle,
              bootcampId: metadata.bootcampId
            });
            // Don't fail the webhook if email fails - registration is still saved
          }
          
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

          // Create booking record (include form data for post-payment restore if client storage was lost)
          const booking = {
            stripeSessionId: session.id,
            meetingTypeId: metadata.meetingTypeId,
            customerName: metadata.customerName,
            customerEmail: metadata.customerEmail,
            amount: session.amount_total / 100,
            currency: session.currency,
            paymentStatus: 'paid',
            status: 'confirmed',
            ...(metadata.bookingSelectedAnalyst !== undefined && { selectedAnalyst: metadata.bookingSelectedAnalyst === '' ? null : (parseInt(metadata.bookingSelectedAnalyst, 10) || null) }),
            ...(metadata.bookingSelectedMeeting !== undefined && { selectedMeeting: metadata.bookingSelectedMeeting === '' ? null : (parseInt(metadata.bookingSelectedMeeting, 10) || null) }),
            ...(metadata.bookingSelectedDate !== undefined && { selectedDate: metadata.bookingSelectedDate || '' }),
            ...(metadata.bookingSelectedTime !== undefined && { selectedTime: metadata.bookingSelectedTime || '' }),
            ...(metadata.bookingSelectedTimezone !== undefined && { selectedTimezone: metadata.bookingSelectedTimezone || '' }),
            ...(metadata.bookingNotes !== undefined && { notes: metadata.bookingNotes || '' }),
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
    } else if (event.type === 'customer.subscription.created') {
      // Handle subscription creation - create subscription record early
      const subscription = event.data.object;
      console.log(`✅ Subscription created: ${subscription.id}`);

      try {
        const metadata = subscription.metadata || {};
        
        // Get user ID from metadata or find by customer email
        let userId = metadata.userId ? new ObjectId(metadata.userId) : null;
        
        if (!userId) {
          // Try to find customer and get email
          let customerEmail = metadata.customerEmail;
          
          if (!customerEmail && subscription.customer) {
            try {
              const customer = typeof subscription.customer === 'string'
                ? await stripe.customers.retrieve(subscription.customer)
                : subscription.customer;
              customerEmail = customer.email || null;
            } catch (error) {
              console.error('Error retrieving customer:', error);
            }
          }

          if (customerEmail) {
            const user = await db.collection('public_users').findOne({ 
              email: customerEmail.toLowerCase().trim() 
            });
            if (user) {
              userId = user._id;
              console.log(`✅ Found user by email: ${userId}`);
            }
          }
        }

        if (!userId) {
          console.log('⚠️ Could not find user for subscription creation, will retry on invoice.payment_succeeded');
          await client.close();
          return;
        }

        // Check if subscription already exists
        const existingSubscription = await db.collection('subscriptions').findOne({
          stripeSubscriptionId: subscription.id
        });

        if (existingSubscription) {
          console.log(`ℹ️ Subscription already exists for ${subscription.id}`);
          await client.close();
          return;
        }

        // Determine plan type from subscription items
        const priceItem = subscription.items.data[0]?.price;
        const interval = priceItem?.recurring?.interval;
        const intervalCount = priceItem?.recurring?.interval_count || 1;
        const amount = priceItem?.unit_amount ? priceItem.unit_amount / 100 : 0;

        // Fetch plan from database
        const plansCollection = db.collection('plans');
        
        // Try to find plan by Stripe price ID first
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

        let planType: string;
        let planName: string;
        let price: string;

        if (planData) {
          planType = planData.planId;
          planName = planData.name;
          price = planData.isFree ? 'FREE' : planData.priceDisplay;
        } else {
          // Fallback to hardcoded values
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

        // Create subscription record
        const subscriptionRecord = {
          userId: userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: typeof subscription.customer === 'string' 
            ? subscription.customer 
            : subscription.customer.id,
          planName: planName,
          planType: planType,
          price: price,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await db.collection('subscriptions').insertOne(subscriptionRecord);
        console.log(`✅ Subscription record created for user ${userId}`);

        await client.close();
      } catch (error) {
        console.error('Error processing customer.subscription.created:', error);
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

      const updatedSubscription = await db.collection('subscriptions').findOne({
        stripeSubscriptionId: subscription.id,
      });

      if (updatedSubscription?.userId) {
        const userId =
          updatedSubscription.userId instanceof ObjectId
            ? updatedSubscription.userId
            : new ObjectId(updatedSubscription.userId);

        const isSubscriptionActive = ['active', 'trialing', 'past_due'].includes(subscription.status);

        const userUpdate: Record<string, any> = {
          isPaid: isSubscriptionActive,
          subscriptionStatus: subscription.status ?? 'canceled',
          updatedAt: new Date(),
        };

        if (isSubscriptionActive) {
          userUpdate.lastPaymentAt = new Date();
        }

        await db.collection('public_users').updateOne(
          { _id: userId },
          {
            $set: userUpdate,
          }
        );
        console.log(`✅ Synced user ${userId} subscription status to ${subscription.status}`);
      }

      await client.close();
    } else if (event.type === 'customer.subscription.deleted') {
      // Handle subscription cancellation and keep user account for free access
      const subscription = event.data.object;
      console.log(`✅ Subscription canceled: ${subscription.id}`);

      // Find the subscription in our database
      const dbSubscription = await db.collection('subscriptions').findOne({
        stripeSubscriptionId: subscription.id
      });

      if (dbSubscription?.userId) {
        const userId = dbSubscription.userId instanceof ObjectId 
          ? dbSubscription.userId 
          : new ObjectId(dbSubscription.userId);

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

        console.log(`✅ Updated user ${userId} to unpaid status after cancellation`);
      } else {
        await db.collection('subscriptions').updateOne(
          { stripeSubscriptionId: subscription.id },
          {
            $set: {
              status: 'canceled',
              canceledAt: new Date(),
              updatedAt: new Date(),
            },
          }
        );
      }

      await client.close();
    } else if (event.type === 'invoice.payment_succeeded') {
      // Handle successful subscription payments (initial + renewals)
      const invoice = event.data.object;
      
      if (invoice.subscription) {
        console.log(`✅ Invoice payment succeeded for subscription: ${invoice.subscription}`);

        // Get subscription to find userId
        let subscription = await db.collection('subscriptions').findOne({
          stripeSubscriptionId: invoice.subscription
        });

        let userId = null;

        // If subscription doesn't exist in database yet, create it
        if (!subscription) {
          console.log(`⚠️ Subscription not found in database, creating it from invoice...`);
          
          try {
            // Retrieve subscription from Stripe
            const stripeSubscription = await stripe.subscriptions.retrieve(invoice.subscription);
            const metadata = stripeSubscription.metadata || {};
            
            // Get user ID from metadata or find by customer email
            userId = metadata.userId ? new ObjectId(metadata.userId) : null;
            
            if (!userId) {
              // Try to get customer email
              let customerEmail = metadata.customerEmail;
              
              if (!customerEmail && invoice.customer_email) {
                customerEmail = invoice.customer_email;
              } else if (!customerEmail && stripeSubscription.customer) {
                try {
                  const customer = typeof stripeSubscription.customer === 'string'
                    ? await stripe.customers.retrieve(stripeSubscription.customer)
                    : stripeSubscription.customer;
                  customerEmail = customer.email || null;
                } catch (error) {
                  console.error('Error retrieving customer:', error);
                }
              }

              if (customerEmail) {
                const user = await db.collection('public_users').findOne({ 
                  email: customerEmail.toLowerCase().trim() 
                });
                if (user) {
                  userId = user._id;
                  console.log(`✅ Found user by email: ${userId}`);
                }
              }
            }

            if (userId) {
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

              // Create subscription record
              subscription = {
                userId: userId,
                stripeSubscriptionId: stripeSubscription.id,
                stripeCustomerId: typeof stripeSubscription.customer === 'string' 
                  ? stripeSubscription.customer 
                  : stripeSubscription.customer.id,
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
              console.log(`✅ Subscription record created from invoice for user ${userId}`);
            } else {
              console.log('⚠️ Could not find user for subscription, skipping billing history');
              await client.close();
              return;
            }
          } catch (error) {
            console.error('Error creating subscription from invoice:', error);
            await client.close();
            return;
          }
        } else {
          userId = subscription.userId instanceof ObjectId
            ? subscription.userId
            : new ObjectId(subscription.userId);
        }

        // Check if billing record already exists (idempotency)
        const existingBilling = await db.collection('billing_history').findOne({
          invoiceId: invoice.id
        });

        if (existingBilling) {
          console.log(`ℹ️ Billing record already exists for invoice ${invoice.id}`);
        } else {
          // Create billing history record
          const billingRecord = {
            userId: userId,
            subscriptionId: invoice.subscription,
            invoiceId: invoice.id,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency || 'usd',
            status: 'paid',
            paidAt: new Date(invoice.created * 1000),
            invoiceUrl: invoice.hosted_invoice_url || null,
            createdAt: new Date()
          };
          
          await db.collection('billing_history').insertOne(billingRecord);
          console.log(`✅ Billing record created for subscription ${invoice.subscription}`);
        }

        // Update user payment status
        await db.collection('public_users').updateOne(
          { _id: userId },
          {
            $set: {
              isPaid: true,
              subscriptionStatus: subscription.status ?? 'active',
              lastPaymentAt: new Date(),
              updatedAt: new Date(),
            },
          }
        );
        console.log(`✅ Updated user ${userId} payment timestamp from invoice`);
      }

      await client.close();
    } else if (event.type === 'payment_intent.succeeded') {
      // Fallback handler for payment success (in case invoice.payment_succeeded doesn't fire)
      const paymentIntent = event.data.object;
      console.log(`✅ Payment intent succeeded: ${paymentIntent.id}`);

      try {
        // Check if this payment is for a subscription
        const subscriptionId = paymentIntent.metadata?.subscription_id || 
                               (paymentIntent.invoice ? await getSubscriptionFromInvoice(paymentIntent.invoice) : null);

        if (!subscriptionId) {
          console.log('ℹ️ Payment intent not for subscription, skipping');
          await client.close();
          return;
        }

        // Get subscription to find userId
        let subscription = await db.collection('subscriptions').findOne({
          stripeSubscriptionId: subscriptionId
        });

        if (!subscription) {
          console.log('ℹ️ Subscription not found for payment intent, invoice.payment_succeeded will handle it');
          await client.close();
          return;
        }

        const userId = subscription.userId instanceof ObjectId
          ? subscription.userId
          : new ObjectId(subscription.userId);

        // Check if we need to get invoice details
        let invoiceId = paymentIntent.metadata?.invoice_id;
        let amount = paymentIntent.amount / 100;
        let currency = paymentIntent.currency || 'usd';
        let invoiceUrl = null;
        let shouldCreateRecord = true;

        if (paymentIntent.invoice) {
          try {
            const invoice = typeof paymentIntent.invoice === 'string'
              ? await stripe.invoices.retrieve(paymentIntent.invoice)
              : paymentIntent.invoice;
            
            invoiceId = invoice.id;
            amount = invoice.amount_paid / 100;
            currency = invoice.currency || 'usd';
            invoiceUrl = invoice.hosted_invoice_url || null;

            // Check if billing record already exists
            const existingBilling = await db.collection('billing_history').findOne({
              invoiceId: invoiceId
            });

            if (existingBilling) {
              console.log(`ℹ️ Billing record already exists for invoice ${invoiceId}`);
              shouldCreateRecord = false;
            }
          } catch (error) {
            console.error('Error retrieving invoice:', error);
            // Continue with payment intent data, use generated invoice ID if needed
            if (!invoiceId) {
              invoiceId = `pi_${paymentIntent.id}`;
            }
          }
        } else {
          // No invoice attached, use payment intent ID as fallback
          if (!invoiceId) {
            invoiceId = `pi_${paymentIntent.id}`;
          }
        }

        // Create billing history record if needed
        if (shouldCreateRecord && invoiceId) {
          // Check one more time if record exists (in case invoiceId was generated)
          const existingBilling = await db.collection('billing_history').findOne({
            invoiceId: invoiceId
          });

          if (!existingBilling) {
            const billingRecord = {
              userId: userId,
              subscriptionId: subscriptionId,
              invoiceId: invoiceId,
              amount: amount,
              currency: currency,
              status: 'paid',
              paidAt: new Date(paymentIntent.created * 1000),
              invoiceUrl: invoiceUrl,
              createdAt: new Date()
            };

            await db.collection('billing_history').insertOne(billingRecord);
            console.log(`✅ Billing record created from payment intent for subscription ${subscriptionId}`);
          } else {
            console.log(`ℹ️ Billing record already exists for ${invoiceId}`);
          }
        }

        await client.close();
      } catch (error) {
        console.error('Error processing payment_intent.succeeded:', error);
        await client.close();
      }
    } else {
      // Log other events but don't process them
      console.log(`ℹ️ Event ${event.type} received but not processed`);
      await client.close();
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
  }
}
