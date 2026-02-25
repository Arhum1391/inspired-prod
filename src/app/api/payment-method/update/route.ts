import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('user-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { cardNumber, expiryDate, cvc } = body;

    if (!cardNumber || !expiryDate || !cvc) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse expiry date
    const [month, year] = expiryDate.split('/');
    const last4 = cardNumber.replace(/\s/g, '').slice(-4);

    const db = await getDatabase();

    // Update existing default payment method or create new one
    await db.collection('payment_methods').updateOne(
      { userId: new ObjectId(decoded.userId), isDefault: true },
      {
        $set: {
          last4: last4,
          expMonth: parseInt(month),
          expYear: parseInt(year.length === 2 ? `20${year}` : year),
          updatedAt: new Date(),
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Payment method updated successfully'
    });
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

