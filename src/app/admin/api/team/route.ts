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
    const { id, name, role, about, bootcampAbout, calendar, image } = body;

    if (!id || !name || !role || !about || !calendar) {
      return NextResponse.json(
        { error: 'ID, name, role, about, and calendar link are required' },
        { status: 400 }
      );
    }

    // Additional validation
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Check for special characters in name (allow only letters, spaces, hyphens, and apostrophes)
    const namePattern = /^[a-zA-Z\s\-']+$/;
    if (!namePattern.test(name.trim())) {
      return NextResponse.json(
        { error: 'Name can only contain letters, spaces, hyphens, and apostrophes' },
        { status: 400 }
      );
    }

    if (role.trim().length < 2) {
      return NextResponse.json(
        { error: 'Role must be at least 2 characters long' },
        { status: 400 }
      );
    }

    if (about.trim().length < 10) {
      return NextResponse.json(
        { error: 'About must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Validate calendar URL
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(calendar.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid calendar URL (starting with http:// or https://)' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Verify the ID is the next available ID
    const existingMembers = await db.collection('team').find({}).toArray();
    const maxId = Math.max(...existingMembers.map(member => member.id || 0), -1);
    const expectedId = maxId + 1;
    
    if (id !== expectedId) {
      return NextResponse.json(
        { error: `Invalid ID. Expected ${expectedId}, got ${id}` },
        { status: 400 }
      );
    }

    const teamMember: Omit<TeamMember, '_id'> = {
      id,
      name,
      role,
      about,
      bootcampAbout: bootcampAbout || '',
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
