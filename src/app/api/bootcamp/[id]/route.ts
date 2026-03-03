import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET single bootcamp by ID (public – does NOT expose zoomLink)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const bootcamp = await db.collection('bootcamps').findOne({
      id: id,
      isActive: true,
    });

    if (!bootcamp) {
      return NextResponse.json({ error: 'Bootcamp not found' }, { status: 404 });
    }

    // Exclude zoomLink from public response to avoid exposing meeting URL
    const { zoomLink, ...safeBootcamp } = bootcamp;

    return NextResponse.json(safeBootcamp);
  } catch (error) {
    console.error('Failed to fetch bootcamp:', error);
    return NextResponse.json({ error: 'Failed to fetch bootcamp' }, { status: 500 });
  }
}
