import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authHelpers';
import { stripe } from '@/lib/stripe';
import { ObjectId } from 'mongodb';

// POST: Verify payment and create enrollment if missing (fallback if webhook hasn't processed)
export async function POST(request: NextRequest) {
  try {
    const { sessionId, bootcampId } = await request.json();

    if (!sessionId || !bootcampId) {
      return NextResponse.json(
        { error: 'Session ID and bootcamp ID are required' },
        { status: 400 }
      );
    }

    // Check authentication
    const { error: authError, userId } = await requireAuth(request);
    if (authError || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const userObjectId = new ObjectId(userId);

    // Check if enrollment already exists
    const existingEnrollment = await db.collection('bootcamp_registrations').findOne({
      stripeSessionId: sessionId
    });

    if (existingEnrollment) {
      console.log(`✅ Enrollment already exists for session ${sessionId}`);
      return NextResponse.json({
        success: true,
        message: 'Enrollment already exists',
        enrollment: existingEnrollment
      }, { status: 200 });
    }

    // Verify payment with Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error: any) {
      console.error('Error retrieving Stripe session:', error);
      return NextResponse.json(
        { error: 'Invalid payment session' },
        { status: 400 }
      );
    }

    // Verify payment is completed
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed', paymentStatus: session.payment_status },
        { status: 400 }
      );
    }

    // Extract metadata
    const metadata = session.metadata || {};
    
    // Verify bootcampId matches
    if (metadata.bootcampId !== bootcampId) {
      return NextResponse.json(
        { error: 'Bootcamp ID mismatch' },
        { status: 400 }
      );
    }

    // Get user to ensure they exist
    const user = await db.collection('public_users').findOne({ _id: userObjectId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify email matches (if provided in metadata)
    if (metadata.customerEmail && user.email.toLowerCase() !== metadata.customerEmail.toLowerCase()) {
      console.warn(`⚠️ Email mismatch: user=${user.email}, session=${metadata.customerEmail}`);
    }

    // Create bootcamp registration record
    const registration = {
      userId: userObjectId,
      stripeSessionId: sessionId,
      bootcampId: bootcampId,
      customerName: metadata.customerName || user.name || '',
      customerEmail: user.email,
      notes: metadata.notes || '',
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'usd',
      paymentStatus: 'paid',
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('bootcamp_registrations').insertOne(registration);
    console.log(`✅ Bootcamp registration created via verify-payment API:`, {
      registrationId: result.insertedId,
      userId: userId,
      bootcampId: bootcampId,
      sessionId: sessionId
    });

    // Verify the registration was saved
    const verifyRegistration = await db.collection('bootcamp_registrations').findOne({
      _id: result.insertedId
    });

    if (!verifyRegistration) {
      console.error('❌ Registration verification failed - registration not found after insert');
      return NextResponse.json(
        { error: 'Failed to save registration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Enrollment created successfully',
      enrollment: verifyRegistration
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to verify payment and create enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

