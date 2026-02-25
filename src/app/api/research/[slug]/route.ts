import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET single research report by slug for public access
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await getDatabase();
    
    const report = await db.collection('researchReports').findOne({ slug });

    if (!report) {
      return NextResponse.json({ error: 'Research report not found' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Failed to fetch research report:', error);
    return NextResponse.json({ error: 'Failed to fetch research report' }, { status: 500 });
  }
}

