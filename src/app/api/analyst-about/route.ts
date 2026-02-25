import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'inspired-analyst';
const COLLECTION_NAME = 'team';

export async function POST(request: NextRequest) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: 'Analyst name is required' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        const client = new MongoClient(MONGODB_URI);
        await client.connect();

        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Find the analyst by name
        const analyst = await collection.findOne({ name: name });

        await client.close();

        if (analyst) {
            return NextResponse.json({
                about: analyst.about || 'No additional information available.'
            });
        } else {
            return NextResponse.json(
                { error: 'Analyst not found' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error fetching analyst about data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
