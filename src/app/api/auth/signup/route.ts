import { NextRequest, NextResponse } from 'next/server';
import { createPublicUser, getPublicUserByEmail, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getPublicUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = await createPublicUser(email, password, name);

    // Return user without password
    const userResponse = {
      id: user._id!,
      email: user.email,
      name: user.name,
      isPaid: user.isPaid,
      subscriptionStatus: user.subscriptionStatus,
    };

    const response = NextResponse.json(
      { message: 'User created successfully', user: userResponse },
      { status: 201 }
    );

    // Generate auth token and set cookie so new users stay signed in
    const token = generateToken(user._id!);
    
    // Prepare cookie options (matching signin route)
    const cookieOptions = {
      httpOnly: true as const,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      ...(process.env.AUTH_COOKIE_DOMAIN
        ? { domain: process.env.AUTH_COOKIE_DOMAIN }
        : {}),
    };
    
    response.cookies.set('user-auth-token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

