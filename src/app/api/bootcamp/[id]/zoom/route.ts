import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authHelpers';
import { ObjectId } from 'mongodb';

// GET Zoom link for a bootcamp – only for enrolled users
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error: authError, userId } = await requireAuth(request);
    if (authError || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const userObjectId = new ObjectId(userId);

    // Verify enrollment
    const enrollment = await db.collection('bootcamp_registrations').findOne({
      userId: userObjectId,
      bootcampId: id,
      paymentStatus: 'paid',
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this bootcamp.' },
        { status: 403 }
      );
    }

    // Fetch bootcamp with zoomLink
    const bootcamp = await db.collection('bootcamps').findOne({
      id: id,
      isActive: true,
    });

    if (!bootcamp || !bootcamp.zoomLink) {
      return NextResponse.json(
        { error: 'Zoom link not configured for this bootcamp.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { zoomLink: bootcamp.zoomLink as string },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch bootcamp Zoom link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Zoom link' },
      { status: 500 }
    );
  }
}

