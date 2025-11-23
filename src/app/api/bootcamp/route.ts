import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// Cache this route response for 60 seconds on the edge
export const revalidate = 60;

// GET all active bootcamps for public consumption
export async function GET() {
  try {
    const db = await getDatabase();
    const bootcamps = await db.collection('bootcamps')
      .find({ isActive: true })
      .sort({ createdAt: 1 }) // Sort by creation date
      .toArray();

    const response = NextResponse.json(bootcamps);
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch bootcamps:', error);
    return NextResponse.json({ error: 'Failed to fetch bootcamps' }, { status: 500 });
  }
}