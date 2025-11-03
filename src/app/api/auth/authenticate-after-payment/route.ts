import { NextRequest, NextResponse } from 'next/server';
import { getPublicUserByEmail, generateToken } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

/**
 * Authenticate user after successful Stripe payment
 * This endpoint verifies the payment session and creates an auth cookie
 */
export async function POST(request: NextRequest) {
  try {
    const { email, sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Verify the Stripe session is valid and completed
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error('Error retrieving Stripe session:', error);
      return NextResponse.json(
        { error: 'Invalid payment session' },
        { status: 400 }
      );
    }

    // Check if session is completed
    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Get email from session (customer_email or metadata)
    const sessionEmail = session.customer_email || 
                        session.customer_details?.email || 
                        session.metadata?.customerEmail;
    
    if (!sessionEmail) {
      return NextResponse.json(
        { error: 'No email found in payment session' },
        { status: 400 }
      );
    }

    // Verify email matches if provided
    if (email && sessionEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email mismatch' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await getPublicUserByEmail(sessionEmail);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id!);

    // Return user data and set cookie
    const userResponse = {
      id: user._id!,
      email: user.email,
      name: user.name || null,
    };

    const response = NextResponse.json(
      { user: userResponse },
      { status: 200 }
    );

    // Set HTTP-only cookie with token
    response.cookies.set('user-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Authenticate after payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

