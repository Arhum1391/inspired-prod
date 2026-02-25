import { NextRequest, NextResponse } from 'next/server';
import { getPublicUserByPasswordResetToken, updatePublicUser, hashPassword } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
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

    // Find user by password reset token
    const user = await getPublicUserByPasswordResetToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    await db.collection('public_users').findOneAndUpdate(
      { _id: new ObjectId(user._id) },
      { $set: { password: hashedPassword, passwordResetToken: null, passwordResetTokenExpiry: null } },
      { returnDocument: 'after' }
    );

    // Update user password and clear reset token
    // await updatePublicUser(user._id!, {
    //   password: hashedPassword,
    //   passwordResetToken: null,
    //   passwordResetTokenExpiry: null,
    // });

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
