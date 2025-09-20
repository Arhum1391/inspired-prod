import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'inspired-analyst';
const COLLECTION_NAME = 'newsletter';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
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

    // Check if email already exists
    const existingSubscriber = await collection.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      await client.close();
      return NextResponse.json(
        { error: 'Email is already subscribed to our newsletter' },
        { status: 409 }
      );
    }

    // Create new subscriber document
    const newSubscriber = {
      id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      status: 'unsent',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    const result = await collection.insertOne(newSubscriber);
    
    await client.close();

    if (result.insertedId) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Successfully subscribed to newsletter!',
          subscriberId: newSubscriber.id
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Newsletter subscription error:', error);
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

    // Get all subscribers
    const subscribers = await collection.find({}).toArray();
    
    await client.close();

    return NextResponse.json({
      success: true,
      subscribers: subscribers,
      count: subscribers.length
    });

  } catch (error) {
    console.error('Get subscribers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    // Validate input
    if (!id || !status || !['sent', 'unsent'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid id and status (sent/unsent) are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Update subscriber status
    const result = await collection.updateOne(
      { id: id },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        }
      }
    );
    
    await client.close();

    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Status updated to ${status}`
      });
    } else {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Update subscriber error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
