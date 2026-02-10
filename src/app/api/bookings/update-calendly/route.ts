import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

/**
 * PUT /api/bookings/update-calendly
 * Updates a booking record with Calendly event URIs after booking is confirmed
 * 
 * SECURITY: Requires valid sessionId to prevent unauthorized updates
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, calendlyEventUri, calendlyInviteeUri } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    if (!calendlyEventUri && !calendlyInviteeUri) {
      return NextResponse.json(
        { error: 'At least one Calendly URI is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const bookingsCollection = db.collection('bookings');

    // Find booking by session ID
    const booking = await bookingsCollection.findOne({
      stripeSessionId: sessionId
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking with Calendly URIs
    const updateData: any = {
      updatedAt: new Date()
    };

    if (calendlyEventUri) {
      updateData.calendlyEventUri = calendlyEventUri;
    }

    if (calendlyInviteeUri) {
      updateData.calendlyInviteeUri = calendlyInviteeUri;
    }

    // Mark as completed if both URIs are present
    if (calendlyEventUri && calendlyInviteeUri) {
      updateData.bookingCompleted = true;
      updateData.bookingCompletedAt = new Date();
    }

    const result = await bookingsCollection.updateOne(
      { stripeSessionId: sessionId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Updated booking ${sessionId} with Calendly URIs`);

    return NextResponse.json({
      success: true,
      message: 'Booking updated with Calendly information',
      updated: result.modifiedCount > 0
    });

  } catch (error) {
    console.error('Error updating booking with Calendly URIs:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
