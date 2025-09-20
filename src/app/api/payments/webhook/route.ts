import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { binancePayClient } from '@/lib/binance-pay';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = 'inspired-analyst';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const timestamp = request.headers.get('BinancePay-Timestamp');
    const nonce = request.headers.get('BinancePay-Nonce');
    const signature = request.headers.get('BinancePay-Signature');

    if (!timestamp || !nonce || !signature) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValidSignature = binancePayClient.verifyWebhookSignature(
      timestamp,
      nonce,
      body,
      signature
    );

    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookData = JSON.parse(body);
    console.log('Webhook received:', webhookData);

    // Log webhook for debugging
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const logsCollection = db.collection('payment_logs');

    await logsCollection.insertOne({
      id: `webhook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      event: 'WEBHOOK_RECEIVED',
      binanceData: webhookData,
      signature,
      timestamp: new Date()
    });

    // Process webhook based on bizType and bizStatus
    if (webhookData.bizType === 'PAY') {
      const paymentData = JSON.parse(webhookData.data);
      const { merchantTradeNo, transactionId, transactTime } = paymentData;

      const bookingsCollection = db.collection('bookings');

      if (webhookData.bizStatus === 'PAY_SUCCESS') {
        // Payment successful
        await bookingsCollection.updateOne(
          { merchantTradeNo },
          {
            $set: {
              status: 'PAID',
              paymentStatus: 'PAY_SUCCESS',
              transactionId,
              paidAt: new Date(transactTime),
              updatedAt: new Date()
            }
          }
        );

        // Log successful payment
        await logsCollection.insertOne({
          id: `payment-success-${Date.now()}`,
          bookingId: merchantTradeNo,
          event: 'PAID',
          binanceData: paymentData,
          timestamp: new Date()
        });

        console.log(`Payment successful for booking: ${merchantTradeNo}`);

      } else if (webhookData.bizStatus === 'PAY_CLOSED') {
        // Payment completed and closed
        await bookingsCollection.updateOne(
          { merchantTradeNo },
          {
            $set: {
              status: 'CONFIRMED',
              paymentStatus: 'PAY_CLOSED',
              confirmedAt: new Date(),
              updatedAt: new Date()
            }
          }
        );

        console.log(`Payment confirmed for booking: ${merchantTradeNo}`);

      } else if (webhookData.bizStatus === 'PAY_FAILED') {
        // Payment failed
        await bookingsCollection.updateOne(
          { merchantTradeNo },
          {
            $set: {
              status: 'FAILED',
              paymentStatus: 'PAY_FAILED',
              updatedAt: new Date()
            }
          }
        );

        console.log(`Payment failed for booking: ${merchantTradeNo}`);
      }
    }

    await client.close();

    // Always return SUCCESS to acknowledge webhook
    return new NextResponse('SUCCESS', { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new NextResponse('ERROR', { status: 500 });
  }
}