import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';

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

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const db = await getDatabase();
    const users = await db
      .collection('public_users')
      .find({})
      .sort({ createdAt: -1 })
      .project({ password: 0 })
      .toArray();

    const list = users.map((u) => ({
      _id: u._id.toString(),
      email: u.email,
      name: u.name ?? null,
      status: (u.status as 'active' | 'blocked') || 'active',
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      users: list,
      count: list.length,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
