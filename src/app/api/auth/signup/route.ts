import { NextRequest, NextResponse } from 'next/server';
import { createPublicUser, getPublicUserByEmail, generateSecureToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

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

    // Generate verification token
    const verificationToken = generateSecureToken();

    // Create user with verification token
    const user = await createPublicUser(email, password, name, verificationToken);

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Still return success, but log the error
      // In production, you might want to handle this differently
    }

    // Return user without password
    const userResponse = {
      id: user._id!,
      email: user.email,
      name: user.name,
      isPaid: user.isPaid,
      subscriptionStatus: user.subscriptionStatus,
      emailVerified: user.emailVerified,
    };

    // Don't set auth cookie - user needs to verify email first
    return NextResponse.json(
      { 
        message: 'Account created successfully. Please check your email to verify your account.', 
        user: userResponse,
        requiresVerification: true
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

