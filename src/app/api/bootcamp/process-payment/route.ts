import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { stripe } from '@/lib/stripe';
import { ObjectId } from 'mongodb';
import { sendBootcampSignupRequiredEmail } from '@/lib/email';

// POST: Process bootcamp payment and send email (for guest purchases, fallback when webhook isn't available)
export async function POST(request: NextRequest) {
  try {
    const { sessionId, bootcampId } = await request.json();

    if (!sessionId || !bootcampId) {
      return NextResponse.json(
        { error: 'Session ID and bootcamp ID are required' },
        { status: 400 }
      );
    }

    console.log('🔄 [PROCESS-PAYMENT] Processing bootcamp payment...', {
      sessionId,
      bootcampId
    });

    const db = await getDatabase();

    // Check if enrollment already exists
    const existingEnrollment = await db.collection('bootcamp_registrations').findOne({
      stripeSessionId: sessionId
    });

    if (existingEnrollment) {
      console.log(`✅ [PROCESS-PAYMENT] Enrollment already exists for session ${sessionId}`);
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
      console.log('📋 [PROCESS-PAYMENT] Stripe session retrieved:', {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        status: session.status
      });
    } catch (error: any) {
      console.error('❌ [PROCESS-PAYMENT] Error retrieving Stripe session:', error);
      return NextResponse.json(
        { error: 'Invalid payment session' },
        { status: 400 }
      );
    }

    // Verify payment is completed
    if (session.payment_status !== 'paid') {
      console.log('⚠️ [PROCESS-PAYMENT] Payment not completed:', {
        paymentStatus: session.payment_status,
        status: session.status
      });
      return NextResponse.json(
        { error: 'Payment not completed', paymentStatus: session.payment_status },
        { status: 400 }
      );
    }

    // Extract metadata
    const metadata = session.metadata || {};
    console.log('📋 [PROCESS-PAYMENT] Session metadata:', metadata);

    // Verify bootcampId matches
    if (metadata.bootcampId !== bootcampId) {
      console.error('❌ [PROCESS-PAYMENT] Bootcamp ID mismatch:', {
        metadataBootcampId: metadata.bootcampId,
        providedBootcampId: bootcampId
      });
      return NextResponse.json(
        { error: 'Bootcamp ID mismatch' },
        { status: 400 }
      );
    }

    // Get bootcamp details
    const bootcamp = await db.collection('bootcamps').findOne({
      id: bootcampId,
      isActive: true
    });

    const bootcampTitle = bootcamp?.title || bootcampId;
    console.log('📚 [PROCESS-PAYMENT] Bootcamp details:', {
      bootcampId,
      bootcampTitle,
      found: !!bootcamp
    });

    // Get user ID from metadata or find by email
    let userId = null;
    const customerEmail = metadata.customerEmail || session.customer_email || '';

    console.log('🔍 [PROCESS-PAYMENT] Looking for user account...', {
      userIdInMetadata: metadata.userId,
      customerEmail
    });

    if (metadata.userId) {
      try {
        userId = new ObjectId(metadata.userId);
        console.log(`📝 [PROCESS-PAYMENT] Found userId in metadata: ${userId}`);
      } catch (error) {
        console.error(`⚠️ [PROCESS-PAYMENT] Invalid userId in metadata: ${metadata.userId}`, error);
      }
    }

    if (!userId && customerEmail) {
      console.log(`🔍 [PROCESS-PAYMENT] Looking up user by email: ${customerEmail}`);
      const user = await db.collection('public_users').findOne({ 
        email: customerEmail.toLowerCase().trim() 
      });
      if (user) {
        userId = user._id;
        console.log(`✅ [PROCESS-PAYMENT] Found user by email: ${userId}`);
      } else {
        console.log(`ℹ️ [PROCESS-PAYMENT] No user found with email: ${customerEmail}`);
      }
    }

    // Create bootcamp registration record
    const registration = {
      userId: userId || null,
      stripeSessionId: sessionId,
      bootcampId: bootcampId,
      customerName: metadata.customerName || '',
      customerEmail: customerEmail,
      notes: metadata.notes || '',
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency || 'usd',
      paymentStatus: 'paid',
      status: 'confirmed',
      requiresSignup: !userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('bootcamp_registrations').insertOne(registration);
    console.log(`✅ [PROCESS-PAYMENT] Bootcamp registration created:`, {
      registrationId: result.insertedId,
      userId: userId ? userId.toString() : null,
      bootcampId: bootcampId,
      customerEmail: customerEmail,
      requiresSignup: !userId
    });

    // If user doesn't exist, send signup email
    if (!userId && customerEmail) {
      console.log('📧 [PROCESS-PAYMENT] User not found - sending signup required email...', {
        customerEmail,
        bootcampTitle,
        bootcampId
      });

      try {
        await sendBootcampSignupRequiredEmail(
          customerEmail,
          metadata.customerName || '',
          bootcampTitle,
          bootcampId
        );
        console.log(`✅ [PROCESS-PAYMENT] Signup required email sent successfully to ${customerEmail}`);
      } catch (emailError: any) {
        console.error('❌ [PROCESS-PAYMENT] Failed to send signup required email:', {
          error: emailError?.message || emailError,
          stack: emailError?.stack,
          customerEmail,
          bootcampTitle
        });
        // Don't fail the request if email fails - registration is still saved
      }
    } else if (userId) {
      console.log(`ℹ️ [PROCESS-PAYMENT] User exists, sending enrollment email...`, {
        customerEmail,
        bootcampTitle,
        bootcampId
      });

      // Send enrollment confirmation email to existing user
      try {
        const { sendBootcampEnrollmentEmail } = await import('@/lib/email');
        
        await sendBootcampEnrollmentEmail(
          customerEmail,
          metadata.customerName || '',
          bootcampTitle,
          bootcampId,
          bootcamp?.description
        );
        
        console.log(`✅ [PROCESS-PAYMENT] Enrollment email sent successfully to ${customerEmail}`, {
          email: customerEmail,
          bootcampTitle,
          bootcampId
        });
      } catch (emailError: any) {
        console.error('❌ [PROCESS-PAYMENT] Failed to send enrollment email:', {
          error: emailError?.message || emailError,
          stack: emailError?.stack,
          customerEmail,
          bootcampTitle,
          bootcampId
        });
        // Don't fail the request if email fails - registration is still saved
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      enrollment: {
        id: result.insertedId,
        bootcampId: bootcampId,
        requiresSignup: !userId
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ [PROCESS-PAYMENT] Error processing payment:', {
      error: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

