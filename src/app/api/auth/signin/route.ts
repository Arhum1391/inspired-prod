import { NextRequest, NextResponse } from 'next/server';
import { getPublicUserByEmail, verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await getPublicUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if account is blocked (treat missing status as active for legacy users)
    if (user.status === 'blocked') {
      return NextResponse.json(
        { error: 'Your account has been blocked.', accountBlocked: true },
        { status: 403 }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { 
          error: 'Please verify your email address before signing in. Check your inbox for the verification link.',
          requiresVerification: true
        },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id!);

    // Return user data (without password)
    const userResponse = {
      id: user._id!,
      email: user.email,
      name: user.name || null,
      isPaid: user.isPaid,
      subscriptionStatus: user.subscriptionStatus,
    };

    // Prepare cookie options
    const cookieOptions = {
      httpOnly: true as const,
      secure: false, // Set to true when using HTTPS
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      ...(process.env.AUTH_COOKIE_DOMAIN
        ? { domain: process.env.AUTH_COOKIE_DOMAIN }
        : {}),
    };

    // Create response with user data
    const response = NextResponse.json(
      { message: 'Login successful', user: userResponse },
      { status: 200 }
    );

    // Set HTTP-only cookie with token
    response.cookies.set('user-auth-token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

