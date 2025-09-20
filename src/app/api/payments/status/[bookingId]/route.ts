import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = 'inspired-analyst';

export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const bookingsCollection = db.collection('bookings');

    // Find booking
    const booking = await bookingsCollection.findOne({
      $or: [
        { id: bookingId },
        { merchantTradeNo: bookingId }
      ]
    });

    await client.close();

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if payment has expired
    const now = new Date();
    const expired = now > booking.expiresAt;

    if (expired && booking.status === 'PENDING') {
      // Update status to expired
      const client2 = new MongoClient(MONGODB_URI);
      await client2.connect();
      const db2 = client2.db(DB_NAME);
      const bookingsCollection2 = db2.collection('bookings');

      await bookingsCollection2.updateOne(
        { _id: booking._id },
        {
          $set: {
            status: 'EXPIRED',
            paymentStatus: 'EXPIRED',
            updatedAt: new Date()
          }
        }
      );
      await client2.close();

      booking.status = 'EXPIRED';
      booking.paymentStatus = 'EXPIRED';
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      amount: booking.amount,
      currency: booking.currency,
      network: booking.network,
      createdAt: booking.createdAt,
      expiresAt: booking.expiresAt,
      expired,
      paymentDetails: booking.status === 'PAID' ? {
        transactionId: booking.transactionId,
        paidAt: booking.paidAt,
        confirmedAt: booking.confirmedAt
      } : undefined,
      qrCodeUrl: booking.qrCodeUrl,
      deepLinkUrl: booking.deepLinkUrl,
      checkoutUrl: booking.checkoutUrl
    });

  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}