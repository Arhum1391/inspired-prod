import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export async function GET() {
    try {
        await client.connect();
        const database = client.db('inspired-analyst');
        const collection = database.collection('team');

        const teamMembers = await collection.find({}).toArray();

        return NextResponse.json({ team: teamMembers });
    } catch (error) {
        console.error('MongoDB connection or query error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.close();
    }
}
