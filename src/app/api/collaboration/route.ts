import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = 'inspired-analyst';
const COLLECTION_NAME = 'collaborations';

export async function POST(request: NextRequest) {
  try {
    const { brandName, email, website, message } = await request.json();

    // Validate required fields
    if (!brandName || !email || !message) {
      return NextResponse.json(
        { error: 'Brand name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Create new collaboration document
    const newCollaboration = {
      id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
      brandName,
      email: email.toLowerCase(),
      website: website || null,
      message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    const result = await collection.insertOne(newCollaboration);

    await client.close();

    if (result.insertedId) {
      return NextResponse.json(
        {
          success: true,
          message: 'Collaboration request submitted successfully!',
          collaborationId: newCollaboration.id
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to submit collaboration request' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Collaboration submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Get all collaboration requests
    const collaborations = await collection.find({}).sort({ createdAt: -1 }).toArray();

    await client.close();

    return NextResponse.json({
      success: true,
      collaborations: collaborations,
      count: collaborations.length
    });

  } catch (error) {
    console.error('Get collaborations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}