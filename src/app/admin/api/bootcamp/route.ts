import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Bootcamp } from '@/types/admin';

// GET all bootcamps
export async function GET() {
  try {
    const db = await getDatabase();
    const bootcamps = await db.collection('bootcamps').find({}).toArray();

    return NextResponse.json(bootcamps);
  } catch (error) {
    console.error('Failed to fetch bootcamps:', error);
    return NextResponse.json({ error: 'Failed to fetch bootcamps' }, { status: 500 });
  }
}

// POST create new bootcamp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    const bootcampData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('bootcamps').insertOne(bootcampData);

    return NextResponse.json({
      message: 'Bootcamp created successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Failed to create bootcamp:', error);
    return NextResponse.json({ error: 'Failed to create bootcamp' }, { status: 500 });
  }
}
