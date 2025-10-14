import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET all active bootcamps for public consumption
export async function GET() {
  try {
    const db = await getDatabase();
    const bootcamps = await db.collection('bootcamps')
      .find({ isActive: true })
      .sort({ createdAt: 1 }) // Sort by creation date
      .toArray();

    return NextResponse.json(bootcamps);
  } catch (error) {
    console.error('Failed to fetch bootcamps:', error);
    return NextResponse.json({ error: 'Failed to fetch bootcamps' }, { status: 500 });
  }
}