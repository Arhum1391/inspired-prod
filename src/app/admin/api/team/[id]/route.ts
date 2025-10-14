import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function updateTeamMember(req: NextRequest, userId: string, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { id: memberId, name, role, about, calendar, image } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid team member ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const updateData = {
      ...(memberId && { id: memberId }),
      ...(name && { name }),
      ...(role && { role }),
      ...(about !== undefined && { about }),
      ...(calendar !== undefined && { calendar }),
      ...(image !== undefined && { image }),
      updatedAt: new Date(),
    };

    const result = await db.collection('team').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Team member updated successfully' });
  } catch (error) {
    console.error('Update team member error:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

async function deleteTeamMember(req: NextRequest, userId: string, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid team member ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection('team').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { verifyToken } = await import('@/lib/auth');
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    return updateTeamMember(req, decoded.userId, { params: resolvedParams });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { verifyToken } = await import('@/lib/auth');
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    return deleteTeamMember(req, decoded.userId, { params: resolvedParams });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
