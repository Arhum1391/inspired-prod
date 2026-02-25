import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { stripe } from '@/lib/stripe';

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

    // If not in DB, fall back to Stripe API (webhook may not have run yet, e.g. in dev or delay)
    if (!record) {
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, { expand: [] });
        const metadata = stripeSession.metadata || {};
        const type = metadata.type as string | undefined;

        if (stripeSession.payment_status === 'paid' && type === 'booking') {
          // Build a record-shaped object so we can use the same response logic below
          record = {
            stripeSessionId: stripeSession.id,
            meetingTypeId: metadata.meetingTypeId,
            customerName: metadata.customerName ?? '',
            customerEmail: (metadata.customer_email || metadata.customerEmail) ?? '',
            amount: (stripeSession.amount_total ?? 0) / 100,
            currency: stripeSession.currency ?? 'usd',
            paymentStatus: 'paid',
            status: 'confirmed',
            selectedAnalyst: metadata.bookingSelectedAnalyst === '' || metadata.bookingSelectedAnalyst === undefined ? null : (parseInt(String(metadata.bookingSelectedAnalyst), 10) || null),
            selectedMeeting: metadata.bookingSelectedMeeting === '' || metadata.bookingSelectedMeeting === undefined ? null : (parseInt(String(metadata.bookingSelectedMeeting), 10) || null),
            selectedDate: metadata.bookingSelectedDate ?? '',
            selectedTime: metadata.bookingSelectedTime ?? '',
            selectedTimezone: metadata.bookingSelectedTimezone ?? '',
            notes: metadata.bookingNotes ?? '',
            createdAt: new Date(),
            updatedAt: new Date()
          } as any;

          // Upsert into DB so webhook can be idempotent and future lookups hit DB
          const client2 = new MongoClient(MONGODB_URI);
          await client2.connect();
          const db2 = client2.db(DB_NAME);
          await db2.collection('bookings').updateOne(
            { stripeSessionId: sessionId },
            { $setOnInsert: record },
            { upsert: true }
          );
          await client2.close();
          console.log(`✅ Payment-status: created booking from Stripe session ${sessionId} (webhook not yet received)`);
        } else if (stripeSession.payment_status === 'paid' && type === 'bootcamp') {
          record = {
            stripeSessionId: stripeSession.id,
            bootcampId: metadata.bootcampId,
            customerName: metadata.customerName ?? '',
            customerEmail: (metadata.customer_email || metadata.customerEmail) ?? '',
            notes: metadata.notes ?? '',
            paymentStatus: 'paid',
            status: 'confirmed',
            amount: (stripeSession.amount_total ?? 0) / 100,
            currency: stripeSession.currency ?? 'usd',
            createdAt: new Date(),
            updatedAt: new Date()
          } as any;
          recordType = 'bootcamp';
          const client2 = new MongoClient(MONGODB_URI);
          await client2.connect();
          const db2 = client2.db(DB_NAME);
          await db2.collection('bootcamp_registrations').updateOne(
            { stripeSessionId: sessionId },
            { $setOnInsert: record },
            { upsert: true }
          );
          await client2.close();
        } else {
          return NextResponse.json(
            { error: 'Payment session not found' },
            { status: 404 }
          );
        }
      } catch (stripeError: any) {
        console.warn('Payment-status: Stripe fallback failed:', stripeError?.message || stripeError);
        return NextResponse.json(
          { error: 'Payment session not found' },
          { status: 404 }
        );
      }
    }

    // TypeScript: at this point we have either a DB record or one built from Stripe
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
      // FormData source order: (1) booking_drafts (2) DB record (3) Stripe metadata (4) minimal from record (Fix 1)
      // SECURITY: We only return formData when payment is already verified (410/409 checks passed) and recordType is booking.

      // (1) Try booking_drafts first — full data stored at checkout creation; most reliable.
      if (!response.formData) {
        try {
          const draftClient = new MongoClient(MONGODB_URI);
          await draftClient.connect();
          const draftDb = draftClient.db(DB_NAME);
          const draft = await draftDb.collection('booking_drafts').findOne({ stripeSessionId: sessionId });
          if (draft) {
            response.formData = {
              fullName: draft.fullName ?? '',
              email: draft.email ?? '',
              notes: draft.notes ?? '',
              selectedAnalyst: draft.selectedAnalyst ?? null,
              selectedMeeting: draft.selectedMeeting ?? null,
              selectedDate: draft.selectedDate ?? '',
              selectedTime: draft.selectedTime ?? '',
              selectedTimezone: draft.selectedTimezone ?? ''
            };
            await draftDb.collection('booking_drafts').deleteOne({ stripeSessionId: sessionId });
            console.log(`✅ Payment-status: formData from booking_drafts for session ${sessionId} (draft deleted)`);
          }
          await draftClient.close();
        } catch (draftErr: any) {
          console.warn('Payment-status: booking_drafts lookup failed:', draftErr?.message || draftErr);
        }
      }

      // (2) Use DB booking record if we have form fields and no draft was used.
      if (!response.formData) {
        const hasFormDataFromRecord = record.customerName != null || record.customerEmail != null || record.selectedAnalyst != null || record.selectedMeeting != null || record.selectedDate != null || record.selectedTime != null || record.selectedTimezone != null || record.notes != null;
        if (hasFormDataFromRecord) {
          response.formData = {
            fullName: record.customerName ?? '',
            email: record.customerEmail ?? '',
            notes: record.notes ?? '',
            selectedAnalyst: record.selectedAnalyst ?? null,
            selectedMeeting: record.selectedMeeting ?? null,
            selectedDate: record.selectedDate ?? '',
            selectedTime: record.selectedTime ?? '',
            selectedTimezone: record.selectedTimezone ?? ''
          };
        }
      }

      // (3) Stripe metadata fallback (Fix 2: relax type — use mode + booking-like metadata if type missing).
      if (!response.formData) {
        try {
          const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, { expand: [] });
          const metadata = stripeSession.metadata || {};
          const isBookingSession = metadata.type === 'booking' ||
            (stripeSession.mode === 'payment' && (metadata.meetingTypeId != null || metadata.bookingSelectedAnalyst !== undefined));
          if (stripeSession.payment_status === 'paid' && isBookingSession) {
            response.formData = {
              fullName: (metadata.customerName as string) ?? '',
              email: (metadata.customer_email || metadata.customerEmail) as string ?? '',
              notes: (metadata.bookingNotes as string) ?? '',
              selectedAnalyst: metadata.bookingSelectedAnalyst === '' || metadata.bookingSelectedAnalyst === undefined ? null : (parseInt(String(metadata.bookingSelectedAnalyst), 10) || null),
              selectedMeeting: metadata.bookingSelectedMeeting === '' || metadata.bookingSelectedMeeting === undefined ? null : (parseInt(String(metadata.bookingSelectedMeeting), 10) || null),
              selectedDate: (metadata.bookingSelectedDate as string) ?? '',
              selectedTime: (metadata.bookingSelectedTime as string) ?? '',
              selectedTimezone: (metadata.bookingSelectedTimezone as string) ?? ''
            };
            console.log(`✅ Payment-status: formData from Stripe metadata for session ${sessionId}`);
          }
        } catch (stripeErr: any) {
          console.warn('Payment-status: could not fill formData from Stripe:', stripeErr?.message || stripeErr);
        }
      }

      // (4) Fix 1: Last resort — partial formData from record so we never return 200 with no formData when we have at least name/email.
      if (!response.formData && (record.customerName != null || record.customerEmail != null)) {
        response.formData = {
          fullName: record.customerName ?? '',
          email: record.customerEmail ?? '',
          notes: record.notes ?? '',
          selectedAnalyst: record.selectedAnalyst ?? null,
          selectedMeeting: record.selectedMeeting ?? null,
          selectedDate: record.selectedDate ?? '',
          selectedTime: record.selectedTime ?? '',
          selectedTimezone: record.selectedTimezone ?? ''
        };
        console.log(`✅ Payment-status: minimal formData from record for session ${sessionId} (Stripe/draft unavailable)`);
      }
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
