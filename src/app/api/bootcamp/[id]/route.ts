import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET single bootcamp by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const bootcamp = await db.collection('bootcamps').findOne({ 
      id: id,
      isActive: true 
    });

    if (!bootcamp) {
      return NextResponse.json({ error: 'Bootcamp not found' }, { status: 404 });
    }

    return NextResponse.json(bootcamp);
  } catch (error) {
    console.error('Failed to fetch bootcamp:', error);
    return NextResponse.json({ error: 'Failed to fetch bootcamp' }, { status: 500 });
  }
}
