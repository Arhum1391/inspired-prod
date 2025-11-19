import { NextRequest, NextResponse } from 'next/server';
import { getPublicUserByEmail, updatePublicUser, generateSecureToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Find user by email
    const user = await getPublicUserByEmail(email);

    // Always return success to prevent email enumeration
    if (user) {
      // Check if already verified
      if (user.emailVerified) {
        return NextResponse.json(
          { message: 'Email is already verified. You can sign in now.' },
          { status: 200 }
        );
      }

      // Generate new verification token
      const verificationToken = generateSecureToken();
      const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

      // Update user with new verification token
      await updatePublicUser(user._id!, {
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: verificationTokenExpiry,
      });

      // Send verification email
      try {
        await sendVerificationEmail(email, verificationToken);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Still return success to prevent email enumeration
      }
    }

    // Always return the same message regardless of whether user exists
    return NextResponse.json(
      { 
        message: 'If an account with that email exists and is not verified, we have sent a new verification link.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}

