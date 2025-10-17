import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
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
    // Only process checkout.session.completed to avoid duplicates
    // Stripe sends multiple events (payment_intent.succeeded, charge.succeeded, etc.)
    // but we only need to create one database record per successful checkout
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(`✅ Payment completed for session: ${session.id}`);
      console.log(`Amount: $${session.amount_total / 100}`);
      console.log(`Customer: ${session.customer_email}`);
      
      // Extract metadata
      const metadata = session.metadata || {};
      const type = metadata.type;
      
      if (!type) {
        console.log('⚠️ No type in metadata, skipping database save');
        return;
      }

      try {
        // Connect to database
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db(DB_NAME);

        if (type === 'bootcamp') {
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
      }
    } else {
      // Log other events but don't process them
      console.log(`ℹ️ Event ${event.type} received but not processed (to avoid duplicates)`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
  }
}
