import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri!);

// POST - Register for bootcamp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bootcamp, name, email, notes } = body;

    // Validate required fields
    if (!bootcamp || !name || !email) {
      return NextResponse.json(
        { error: 'Bootcamp type, name, and email are required' },
        { status: 400 }
      );
    }

    // Convert email to lowercase for consistency
    const normalizedEmail = email.toLowerCase().trim();

    await client.connect();
    const database = client.db('inspired-analyst');
    const collection = database.collection('bootcamp-registrations');

    // Check if email already registered for this bootcamp
    const existingRegistration = await collection.findOne({
      bootcamp: bootcamp,
      email: normalizedEmail,
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You have already registered for this bootcamp' },
        { status: 409 }
      );
    }

    // Create new registration
    const registration = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bootcamp: bootcamp,
      name: name.trim(),
      email: normalizedEmail,
      notes: notes?.trim() || '',
      status: 'pending', // pending, confirmed, completed, cancelled
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(registration);

    return NextResponse.json(
      {
        message: 'Registration successful',
        registration: {
          id: registration.id,
          bootcamp: registration.bootcamp,
          name: registration.name,
          email: registration.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Bootcamp registration error:', error);
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// GET - Retrieve all bootcamp registrations (for admin)
export async function GET(request: NextRequest) {
  try {
    await client.connect();
    const database = client.db('inspired-analyst');
    const collection = database.collection('bootcamp-registrations');

    const registrations = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bootcamp registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// PUT - Update registration status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Registration ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db('inspired-analyst');
    const collection = database.collection('bootcamp-registrations');

    const result = await collection.updateOne(
      { id: id },
      {
        $set: {
          status: status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Registration status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating registration status:', error);
    return NextResponse.json(
      { error: 'Failed to update registration status' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
