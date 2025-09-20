import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { binancePayClient } from '@/lib/binance-pay';
import Joi from 'joi';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = 'inspired-analyst';

// Validation schema
const createPaymentSchema = Joi.object({
  meetingTypeId: Joi.string().required(),
  customerEmail: Joi.string().email().required(),
  customerName: Joi.string().optional(),
  network: Joi.string().valid('TRC20', 'BEP20', 'ERC20').default('TRC20')
});

// Meeting types (from your existing book page)
const meetingTypes = [
  {
    id: 'initial-consultation',
    name: 'Initial Consultation',
    price: 50,
    duration: 30,
    description: 'Quick overview and needs assessment'
  },
  {
    id: 'initial-consultation-1',
    name: 'Extended Initial Consultation',
    price: 75,
    duration: 45,
    description: 'Extended consultation with detailed analysis'
  },
  {
    id: 'strategy-workshop',
    name: 'Strategy Workshop',
    price: 150,
    duration: 90,
    description: 'Intensive planning and implementation workshop'
  },
  {
    id: 'follow-up-session',
    name: 'Follow-up Session',
    price: 75,
    duration: 45,
    description: 'Progress review and next steps'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const { error, value } = createPaymentSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const { meetingTypeId, customerEmail, customerName, network } = value;

    // Find meeting type
    const meetingType = meetingTypes.find(mt => mt.id === meetingTypeId);
    if (!meetingType) {
      return NextResponse.json(
        { error: 'Invalid meeting type' },
        { status: 400 }
      );
    }

    // Generate unique merchant trade number
    const merchantTradeNo = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create booking record
    const booking = {
      id: merchantTradeNo,
      merchantTradeNo,
      meetingTypeId,
      amount: meetingType.price,
      currency: 'USDT',
      network,
      customerEmail,
      customerName,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    };

    // Save to database
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const bookingsCollection = db.collection('bookings');

    await bookingsCollection.insertOne(booking);
    await client.close();

    // Create Binance Pay order
    const orderData = {
      merchantTradeNo,
      orderAmount: meetingType.price,
      currency: 'USDT',
      goods: {
        goodsType: '02', // Service
        goodsCategory: 'Z000', // Others
        referenceGoodsId: meetingTypeId,
        goodsName: meetingType.name,
        goodsDetail: meetingType.description
      }
    };

    const binanceResponse = await binancePayClient.createOrder(orderData);

    if (binanceResponse.status === 'SUCCESS') {
      // Update booking with Binance Pay details
      const client2 = new MongoClient(MONGODB_URI);
      await client2.connect();
      const db2 = client2.db(DB_NAME);
      const bookingsCollection2 = db2.collection('bookings');

      await bookingsCollection2.updateOne(
        { merchantTradeNo },
        {
          $set: {
            binanceOrderId: binanceResponse.data.prepayId,
            qrCodeUrl: binanceResponse.data.qrcodeLink,
            deepLinkUrl: binanceResponse.data.deeplink,
            checkoutUrl: binanceResponse.data.checkoutUrl,
            updatedAt: new Date()
          }
        }
      );
      await client2.close();

      return NextResponse.json({
        success: true,
        bookingId: merchantTradeNo,
        binanceOrderId: binanceResponse.data.prepayId,
        qrCodeUrl: binanceResponse.data.qrcodeLink,
        deepLinkUrl: binanceResponse.data.deeplink,
        checkoutUrl: binanceResponse.data.checkoutUrl,
        amount: meetingType.price,
        currency: 'USDT',
        expiresAt: booking.expiresAt.toISOString(),
        meetingDetails: {
          name: meetingType.name,
          duration: meetingType.duration,
          description: meetingType.description
        }
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}