import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById, updatePublicUser } from '@/lib/auth';
import { ObjectId } from 'mongodb';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return { error: 'Authentication required', status: 401 as const, user: null };
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return { error: 'Invalid token', status: 401 as const, user: null };
  }
  const user = await getUserById(decoded.userId);
  if (!user) {
    return { error: 'User not found', status: 404 as const, user: null };
  }
  return { error: null, status: 200 as const, user };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['active', 'blocked'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status (active or blocked) is required' },
        { status: 400 }
      );
    }

    const updatedUser = await updatePublicUser(id, { status });
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'}`,
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error('Update user status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
