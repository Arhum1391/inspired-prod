import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT update bootcamp
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log('PUT request received for bootcamp ID:', params.id);
    console.log('Update data:', body);
    
    const db = await getDatabase();

    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    console.log('Final update data:', updateData);

    const result = await db.collection('bootcamps').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    console.log('MongoDB update result:', result);

    if (result.matchedCount === 0) {
      console.log('No bootcamp found with ID:', params.id);
      return NextResponse.json({ error: 'Bootcamp not found' }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      console.log('Bootcamp found but no changes made');
      return NextResponse.json({ message: 'Bootcamp found but no changes were made' });
    }

    console.log('Bootcamp updated successfully');
    return NextResponse.json({ message: 'Bootcamp updated successfully' });
  } catch (error) {
    console.error('Failed to update bootcamp:', error);
    return NextResponse.json({ 
      error: 'Failed to update bootcamp', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// DELETE bootcamp
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();

    const result = await db.collection('bootcamps').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Bootcamp not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Bootcamp deleted successfully' });
  } catch (error) {
    console.error('Failed to delete bootcamp:', error);
    return NextResponse.json({ error: 'Failed to delete bootcamp' }, { status: 500 });
  }
}
