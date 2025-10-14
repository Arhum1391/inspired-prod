import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { getDatabase } from '@/lib/mongodb';
import { TeamMember } from '@/types/admin';

async function getTeamMembers(req: NextRequest, userId: string) {
  try {
    const db = await getDatabase();
    const teamMembers = await db.collection('team').find({}).toArray();

    return NextResponse.json(teamMembers.map(member => ({
      ...member,
      _id: member._id.toString()
    })));
  } catch (error) {
    console.error('Get team members error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

async function createTeamMember(req: NextRequest, userId: string) {
  try {
    const body = await req.json();
    const { id, name, role, about, calendar, image } = body;

    if (!id || !name || !role || !about) {
      return NextResponse.json(
        { error: 'ID, name, role, and about are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const teamMember: Omit<TeamMember, '_id'> = {
      id,
      name,
      role,
      about,
      calendar: calendar || '',
      image: image || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('team').insertOne(teamMember);

    return NextResponse.json({
      ...teamMember,
      _id: result.insertedId.toString()
    }, { status: 201 });
  } catch (error) {
    console.error('Create team member error:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getTeamMembers);
export const POST = withAuth(createTeamMember);
