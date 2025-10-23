import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function updateTeamMember(req: NextRequest, userId: string, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    console.log('🔄 API: Updating team member with ID:', id);
    console.log('📝 API: Received data:', body);
    const { id: memberId, name, role, about, bootcampAbout, calendar, image } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid team member ID' },
        { status: 400 }
      );
    }

    // Prevent ID changes - ID field is read-only for existing members
    if (memberId !== undefined) {
      return NextResponse.json(
        { error: 'ID cannot be changed for existing team members' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const updateData = {
      ...(name !== undefined && { name }),
      ...(role !== undefined && { role }),
      ...(about !== undefined && { about }),
      ...(bootcampAbout !== undefined && { bootcampAbout }),
      ...(calendar !== undefined && { calendar }),
      ...(image !== undefined && { image }),
      updatedAt: new Date(),
    };

    console.log('📝 API: Update data to be applied:', updateData);

    const result = await db.collection('team').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    console.log('📊 API: Update result:', result);

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
    
    // Get the team member first to get their ID for image cleanup
    const teamMember = await db.collection('team').findOne({ _id: new ObjectId(id) });
    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    console.log('🗑️ Deleting team member:', teamMember.name, 'ID:', teamMember.id);
    
    // Delete from team collection
    const result = await db.collection('team').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    
    console.log('✅ Team member and associated image deleted successfully');
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
