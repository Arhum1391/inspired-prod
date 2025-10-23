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
        console.log('🔄 Team API: Starting database connection...');
        await client.connect();
        const database = client.db('inspired-analyst');
        const collection = database.collection('team');

        console.log('📊 Team API: Fetching team members...');
        const teamMembers = await collection.find({}).toArray();
        console.log(`📊 Team API: Found ${teamMembers.length} team members`);


        // Transform TeamMember[] to Analyst[] format
        const analysts: Analyst[] = teamMembers.map(member => {
            // Validate and sanitize image URL
            let imageUrl = member.image;
            if (!imageUrl || imageUrl.trim() === '' || imageUrl === 'null' || imageUrl === 'undefined') {
                imageUrl = `/team dark/${member.name}.png`;
            }
            
            console.log('🔄 Mapping team member:', {
                id: member.id,
                name: member.name,
                role: member.role,
                about: member.about?.substring(0, 50) + '...', // Log first 50 chars
                hasImage: !!imageUrl,
                imageSource: member.image && member.image.trim() !== '' ? 'team member field' : 'static fallback'
            });
            
            return {
                id: member.id,
                name: member.name,
                description: member.role || 'Role unavailable',
                image: imageUrl,
                about: member.about || 'About info unavailable'
            };
        });

        console.log('✅ Team API: Successfully processed team data');
        return NextResponse.json({ 
            team: analysts,
            rawTeam: teamMembers // Keep raw data for admin panel
        });
    } catch (error) {
        console.error('❌ Team API: MongoDB connection or query error:', error);
        console.error('❌ Team API: Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json({ 
            error: 'Internal Server Error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    } finally {
        try {
            await client.close();
            console.log('🔌 Team API: Database connection closed');
        } catch (closeError) {
            console.error('⚠️ Team API: Error closing connection:', closeError);
        }
    }
}
