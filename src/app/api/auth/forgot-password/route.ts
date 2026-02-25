import { NextRequest, NextResponse } from 'next/server';
import { getPublicUserByEmail, updatePublicUser, generateSecureToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';

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
    // But only send email if user exists
    if (user) {
      // Generate password reset token
      const resetToken = generateSecureToken();
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Update user with reset token
      await updatePublicUser(user._id!, {
        passwordResetToken: resetToken,
        passwordResetTokenExpiry: resetTokenExpiry,
      });

      // Send password reset email
      try {
        await sendPasswordResetEmail(email, resetToken);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Still return success to prevent email enumeration
      }
    }

    // Always return the same message regardless of whether user exists
    return NextResponse.json(
      {
        message: 'If an account with that email exists, we have sent a password reset link.'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
