import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// Cache this route response for 60 seconds on the edge
export const revalidate = 60;

// GET all research reports for public access
export async function GET() {
  try {
    const db = await getDatabase();
    const reports = await db.collection('researchReports')
      .find({})
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .toArray();

    const response = NextResponse.json(reports);
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch research reports:', error);
    return NextResponse.json({ error: 'Failed to fetch research reports' }, { status: 500 });
  }
}

