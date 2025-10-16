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
    switch (event.type) {
      case 'checkout.session.completed':
        console.log(`✅ Payment completed for session: ${event.data.object.id}`);
        console.log(`Amount: $${event.data.object.amount_total / 100}`);
        console.log(`Customer: ${event.data.object.customer_email}`);
        break;
      
      case 'payment_intent.succeeded':
        console.log(`✅ Payment intent succeeded: ${event.data.object.id}`);
        break;
      
      case 'charge.succeeded':
        console.log(`✅ Charge succeeded: ${event.data.object.id}`);
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
  }
}

// Database functions removed for now to prevent webhook timeouts
// These can be re-added later when database connection is stable
