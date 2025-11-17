import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET all research reports for public access
export async function GET() {
  try {
    const db = await getDatabase();
    const reports = await db.collection('researchReports')
      .find({})
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .toArray();

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Failed to fetch research reports:', error);
    return NextResponse.json({ error: 'Failed to fetch research reports' }, { status: 500 });
  }
}

