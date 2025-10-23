import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    console.log('🔄 Public Images API: Fetching images...');
    const db = await getDatabase();
    const collection = db.collection('images');
    
    const images = await collection.find({}).toArray();
    console.log(`📊 Public Images API: Found ${images.length} images`);
    
    // Transform to a more useful format for frontend
    const imageMap = images.reduce((acc, image) => {
      acc[image.memberId] = image.imageUrl;
      return acc;
    }, {} as Record<number, string>);
    
    return NextResponse.json({ 
      images: imageMap,
      count: images.length 
    });
  } catch (error) {
    console.error('❌ Public Images API: Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
