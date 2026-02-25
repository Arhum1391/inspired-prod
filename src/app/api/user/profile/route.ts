import { NextRequest, NextResponse } from 'next/server';
import { getPublicUserById, updatePublicUser, verifyToken, verifyPassword, hashPassword } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('user-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await getPublicUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    // Build update object
    const updates: any = {};

    // Update name if provided
    if (name !== undefined) {
      updates.name = name || null;
    }

    // Update email if provided
    if (email !== undefined && email !== user.email) {
      // Check if email is already taken by another user
      const { getDatabase } = await import('@/lib/mongodb');
      const { ObjectId } = await import('mongodb');
      const db = await getDatabase();
      const existingUser = await db.collection('public_users').findOne({
        email: email.toLowerCase(),
        _id: { $ne: new ObjectId(user._id) }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        );
      }

      updates.email = email.toLowerCase();
      // Reset email verification if email is changed
      updates.emailVerified = false;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        );
      }

      // Verify current password
      const isPasswordValid = await verifyPassword(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters long' },
          { status: 400 }
        );
      }

      // Hash new password
      updates.password = await hashPassword(newPassword);
    }

    // Update user in database
    const updatedUser = await updatePublicUser(user._id!, updates);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Return updated user data (without password)
    const userResponse = {
      id: updatedUser._id!,
      email: updatedUser.email,
      name: updatedUser.name || null,
      image: updatedUser.image || null,
      isPaid: updatedUser.isPaid,
      subscriptionStatus: updatedUser.subscriptionStatus,
    };

    return NextResponse.json(
      { user: userResponse, message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

