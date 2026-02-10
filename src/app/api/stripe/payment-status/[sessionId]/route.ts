import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = 'inspired-analyst';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    // Check both collections for the session
    const bookingsCollection = db.collection('bookings');
    const bootcampRegistrationsCollection = db.collection('bootcamp_registrations');

    // Try to find in bookings collection first
    let record = await bookingsCollection.findOne({
      $or: [
        { stripeSessionId: sessionId },
        { id: sessionId }
      ]
    });

    let recordType = 'booking';

    // If not found in bookings, check bootcamp registrations
    if (!record) {
      record = await bootcampRegistrationsCollection.findOne({
        $or: [
          { stripeSessionId: sessionId },
          { id: sessionId }
        ]
      });
      recordType = 'bootcamp';
    }

    await client.close();

    if (!record) {
      return NextResponse.json(
        { error: 'Payment session not found' },
        { status: 404 }
      );
    }

    // SECURITY: Check if payment has expired
    const now = new Date();
    const expired = record.expiresAt && now > record.expiresAt;

    // SECURITY: Check if paid session is too old (prevent reuse of old sessions)
    // Allow sessions to be used within 24 hours of payment completion
    const MAX_SESSION_AGE_HOURS = 1;
    let sessionTooOld = false;
    if (record.status === 'PAID' || record.status === 'CONFIRMED' || record.paymentStatus === 'paid') {
      const paidAt = record.paidAt || record.confirmedAt || record.createdAt;
      if (paidAt) {
        const paidDate = new Date(paidAt);
        const hoursSincePayment = (now.getTime() - paidDate.getTime()) / (1000 * 60 * 60);
        sessionTooOld = hoursSincePayment > MAX_SESSION_AGE_HOURS;
        
        if (sessionTooOld) {
          console.warn(`⚠️ Session ${sessionId} is too old: ${hoursSincePayment.toFixed(2)} hours since payment`);
        }
      }
    }

    // SECURITY: Check if booking was already completed (prevent reuse)
    let alreadyUsed = false;
    if (recordType === 'booking') {
      // Check if there's a Calendly event already created for this booking
      // This would indicate the booking was already completed
      if (record.calendlyEventUri || record.calendlyInviteeUri) {
        alreadyUsed = true;
        console.warn(`⚠️ Session ${sessionId} already has Calendly booking`);
      }
    }

    // If expired and still pending, update status
    if (expired && record.status === 'PENDING') {
      const client2 = new MongoClient(MONGODB_URI);
      await client2.connect();
      const db2 = client2.db(DB_NAME);

      if (recordType === 'booking') {
        await db2.collection('bookings').updateOne(
          { _id: record._id },
          {
            $set: {
              status: 'EXPIRED',
              paymentStatus: 'EXPIRED',
              updatedAt: new Date()
            }
          }
        );
      } else {
        await db2.collection('bootcamp_registrations').updateOne(
          { _id: record._id },
          {
            $set: {
              status: 'EXPIRED',
              paymentStatus: 'EXPIRED',
              updatedAt: new Date()
            }
          }
        );
      }

      await client2.close();
      record.status = 'EXPIRED';
      record.paymentStatus = 'EXPIRED';
    }

    // SECURITY: Reject if session is too old or already used
    if (sessionTooOld) {
      return NextResponse.json(
        { 
          error: 'Session expired',
          message: `This payment session is too old (older than ${MAX_SESSION_AGE_HOURS} hours). Please create a new booking.`,
          expired: true,
          sessionAge: 'too_old'
        },
        { status: 410 } // 410 Gone - resource is no longer available
      );
    }

    if (alreadyUsed) {
      return NextResponse.json(
        { 
          error: 'Session already used',
          message: 'This payment session has already been used to complete a booking.',
          expired: false,
          alreadyUsed: true
        },
        { status: 409 } // 409 Conflict - resource already used
      );
    }

    // Prepare response based on record type
    const response: any = {
      success: true,
      sessionId: record.stripeSessionId || record.id,
      type: recordType,
      status: record.status,
      paymentStatus: record.paymentStatus,
      amount: record.amount,
      currency: record.currency,
      customerEmail: record.customerEmail,
      customerName: record.customerName,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      expiresAt: record.expiresAt,
      expired: expired || false,
      sessionTooOld: false,
      alreadyUsed: false
    };

    // Add type-specific fields
    if (recordType === 'booking') {
      response.meetingDetails = {
        meetingTypeId: record.meetingTypeId,
        meetingName: record.meetingName,
        meetingDescription: record.meetingDescription
      };
    } else {
      response.bootcampDetails = {
        bootcampId: record.bootcampId,
        bootcampName: record.bootcampName,
        bootcampDescription: record.bootcampDescription,
        notes: record.notes
      };
    }

    // Add payment details if paid
    if (record.status === 'PAID' || record.status === 'CONFIRMED') {
      response.paymentDetails = {
        stripePaymentIntentId: record.stripePaymentIntentId,
        stripeCustomerId: record.stripeCustomerId,
        paidAt: record.paidAt,
        confirmedAt: record.confirmedAt
      };
    }

    // Add Stripe checkout URL if still pending
    if (record.status === 'PENDING' && !expired) {
      response.checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}`;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add a POST endpoint for manual status refresh
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // This endpoint could be used to manually refresh status from Stripe
    // For now, we'll just return the current status from our database
    // In the future, you could add Stripe API calls here to sync status

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    // Check both collections
    const bookingsCollection = db.collection('bookings');
    const bootcampRegistrationsCollection = db.collection('bootcamp_registrations');

    let record = await bookingsCollection.findOne({
      $or: [
        { stripeSessionId: sessionId },
        { id: sessionId }
      ]
    });

    let recordType = 'booking';

    if (!record) {
      record = await bootcampRegistrationsCollection.findOne({
        $or: [
          { stripeSessionId: sessionId },
          { id: sessionId }
        ]
      });
      recordType = 'bootcamp';
    }

    await client.close();

    if (!record) {
      return NextResponse.json(
        { error: 'Payment session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Status refreshed',
      sessionId: record.stripeSessionId || record.id,
      type: recordType,
      status: record.status,
      paymentStatus: record.paymentStatus,
      lastUpdated: record.updatedAt
    });

  } catch (error) {
    console.error('Payment status refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
