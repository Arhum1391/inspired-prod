import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { getDatabase } from '@/lib/mongodb';

// Image interface for the images collection
interface Image {
  _id?: string;
  memberId: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

async function getImages(req: NextRequest, userId: string) {
  try {
    console.log('🔄 Images API: Fetching images...');
    const db = await getDatabase();
    const collection = db.collection('images');
    
    const images = await collection.find({}).toArray();
    console.log(`📊 Images API: Found ${images.length} images`);
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('❌ Images API: Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

async function createImage(req: NextRequest, userId: string) {
  try {
    const body = await req.json();
    const { memberId, imageUrl } = body;
    
    console.log('🔄 Images API: Creating image for member:', memberId);
    
    if (!memberId || !imageUrl) {
      return NextResponse.json(
        { error: 'Member ID and image URL are required' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const collection = db.collection('images');
    
    // Check if image already exists for this member
    const existingImage = await collection.findOne({ memberId });
    if (existingImage) {
      // Update existing image
      const result = await collection.updateOne(
        { memberId },
        { 
          $set: { 
            imageUrl, 
            updatedAt: new Date() 
          } 
        }
      );
      console.log('✅ Images API: Updated existing image');
      return NextResponse.json({ success: true, updated: true });
    } else {
      // Create new image
      const image: Omit<Image, '_id'> = {
        memberId,
        imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await collection.insertOne(image);
      console.log('✅ Images API: Created new image');
      return NextResponse.json({ 
        success: true, 
        id: result.insertedId,
        created: true 
      });
    }
  } catch (error) {
    console.error('❌ Images API: Error creating image:', error);
    return NextResponse.json(
      { error: 'Failed to create image' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getImages);
export const POST = withAuth(createImage);
