import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getDatabase } from '@/lib/mongodb';

/**
 * POST /api/calendly/create-booking
 * Creates a single-use scheduling link for a Calendly event
 * This allows users to book directly without going through Calendly's UI
 * 
 * SECURITY: Requires a valid paid Stripe session ID to prevent unauthorized bookings
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventTypeUri, name, email, startTime, notes, sessionId } = body;

    if (!process.env.CALENDLY_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Calendly access token not configured' },
        { status: 500 }
      );
    }

    if (!eventTypeUri || !name || !email || !startTime) {
      return NextResponse.json(
        { error: 'Event type URI, name, email, and start time are required' },
        { status: 400 }
      );
    }

    // SECURITY: Require and verify Stripe session ID
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Payment session ID is required. Please complete payment first.' },
        { status: 400 }
      );
    }

    // Verify payment with Stripe
    let stripeSession;
    try {
      stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error: any) {
      console.error('Error retrieving Stripe session:', error);
      return NextResponse.json(
        { error: 'Invalid payment session' },
        { status: 400 }
      );
    }

    // Verify payment is completed
    if (stripeSession.payment_status !== 'paid') {
      console.error('Payment not completed:', {
        sessionId,
        paymentStatus: stripeSession.payment_status,
        status: stripeSession.status
      });
      return NextResponse.json(
        { 
          error: 'Payment not completed', 
          paymentStatus: stripeSession.payment_status,
          message: 'Please complete payment before booking'
        },
        { status: 402 } // 402 Payment Required
      );
    }

    // SECURITY: Check if session is too old (prevent reuse of old sessions)
    const MAX_SESSION_AGE_HOURS = 1;
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const sessionCreated = stripeSession.created; // Stripe session created timestamp
    
    if (sessionCreated) {
      const hoursSinceCreation = (now - sessionCreated) / 3600;
      if (hoursSinceCreation > MAX_SESSION_AGE_HOURS) {
        console.warn(`⚠️ Session ${sessionId} is too old: ${hoursSinceCreation.toFixed(2)} hours`);
        return NextResponse.json(
          { 
            error: 'Session expired',
            message: `This payment session is too old (older than ${MAX_SESSION_AGE_HOURS} hours). Please create a new booking.`,
            sessionAge: hoursSinceCreation.toFixed(2)
          },
          { status: 410 } // 410 Gone
        );
      }
    }

    // SECURITY: Verify booking exists and check if already completed
    try {
      const db = await getDatabase();
      const booking = await db.collection('bookings').findOne({
        stripeSessionId: sessionId,
        paymentStatus: 'paid'
      });

      if (!booking) {
        console.warn('Booking not found in database for paid session:', sessionId);
        // Don't block - webhook might not have processed yet, but Stripe says it's paid
        // Log for monitoring
      } else {
        // SECURITY: Check if booking already has Calendly URIs (already completed)
        if (booking.calendlyEventUri || booking.calendlyInviteeUri) {
          console.warn(`⚠️ Booking ${sessionId} already has Calendly booking completed`);
          return NextResponse.json(
            { 
              error: 'Booking already completed',
              message: 'This payment session has already been used to complete a booking.',
              alreadyUsed: true,
              calendlyEventUri: booking.calendlyEventUri,
              calendlyInviteeUri: booking.calendlyInviteeUri
            },
            { status: 409 } // 409 Conflict
          );
        }
      }
    } catch (dbError) {
      console.error('Database check error:', dbError);
      // Don't block if database check fails - Stripe verification is primary
      // But log it for monitoring
    }

    console.log('Creating Calendly booking for paid session:', { 
      sessionId, 
      eventTypeUri, 
      name, 
      email, 
      startTime,
      paymentStatus: stripeSession.payment_status
    });

    // Create a single-use scheduling link
    const response = await fetch('https://api.calendly.com/scheduling_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        max_event_count: 1,
        owner: eventTypeUri,
        owner_type: 'EventType'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Calendly API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create scheduling link', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Calendly scheduling link created:', data);

    // Build the booking URL with pre-filled information
    const schedulingUrl = data.resource.booking_url;
    const bookingUrl = new URL(schedulingUrl);
    
    // Add query parameters for pre-filling
    bookingUrl.searchParams.append('name', name);
    bookingUrl.searchParams.append('email', email);
    if (notes) {
      bookingUrl.searchParams.append('a1', notes); // a1 is the first custom answer field
    }
    
    // Add the selected time if it matches a slot
    if (startTime) {
      bookingUrl.searchParams.append('date_and_time', startTime);
    }

    // Update booking record with scheduling URL (for tracking)
    try {
      const db = await getDatabase();
      await db.collection('bookings').updateOne(
        { stripeSessionId: sessionId },
        {
          $set: {
            calendlySchedulingUrl: bookingUrl.toString(),
            calendlySchedulingLinkCreatedAt: new Date(),
            updatedAt: new Date()
          }
        }
      );
      console.log(`✅ Updated booking ${sessionId} with Calendly scheduling URL`);
    } catch (dbError) {
      console.error('Error updating booking with scheduling URL (non-blocking):', dbError);
      // Don't block if update fails - scheduling link is already created
    }

    return NextResponse.json({
      success: true,
      bookingUrl: bookingUrl.toString(),
      schedulingLink: data.resource.booking_url,
      message: 'Scheduling link created successfully',
      sessionId: sessionId, // Return session ID for verification
      verified: true // Indicate payment was verified
    });
  } catch (error) {
    console.error('Error creating Calendly booking:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

