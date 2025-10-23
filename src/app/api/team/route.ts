import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

// Analyst interface for frontend compatibility
interface Analyst {
  id: number;
  name: string;
  description: string; // This will be the role
  image: string;
  about: string; // This will be the about field
}

export async function GET() {
    try {
        await client.connect();
        const database = client.db('inspired-analyst');
        const collection = database.collection('team');

        const teamMembers = await collection.find({}).toArray();

        // Transform TeamMember[] to Analyst[] format
        const analysts: Analyst[] = teamMembers.map(member => {
            console.log('🔄 Mapping team member:', {
                id: member.id,
                name: member.name,
                role: member.role,
                about: member.about?.substring(0, 50) + '...', // Log first 50 chars
                hasImage: !!member.image
            });
            
            return {
                id: member.id,
                name: member.name,
                description: member.role || 'Role unavailable',
                image: member.image || `/team dark/${member.name}.png`, // Fallback to static images
                about: member.about || 'About info unavailable'
            };
        });

        return NextResponse.json({ 
            team: analysts,
            rawTeam: teamMembers // Keep raw data for admin panel
        });
    } catch (error) {
        console.error('MongoDB connection or query error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.close();
    }
}
