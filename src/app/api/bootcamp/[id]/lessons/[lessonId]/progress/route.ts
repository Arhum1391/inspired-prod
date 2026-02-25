import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authHelpers';
import { ObjectId } from 'mongodb';

// POST: Update user's progress for a specific lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  try {
    const { id, lessonId } = await params;
    const body = await request.json();
    
    // Check authentication
    const { error: authError, userId } = await requireAuth(request);
    if (authError || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const userObjectId = new ObjectId(userId);

    // Verify user is enrolled in this bootcamp
    const enrollment = await db.collection('bootcamp_registrations').findOne({
      userId: userObjectId,
      bootcampId: id,
      paymentStatus: 'paid',
      status: 'confirmed'
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this bootcamp' },
        { status: 403 }
      );
    }

    // Verify lesson exists
    const lesson = await db.collection('bootcamp_lessons').findOne({
      lessonId,
      bootcampId: id
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Validate progress value
    const progress = Math.min(Math.max(body.progress || 0, 0), 100);
    const isCompleted = body.completed !== undefined ? body.completed : progress >= 90;

    // Get or create progress document
    let progressDoc = await db.collection('bootcamp_progress').findOne({
      userId: userObjectId,
      bootcampId: id
    });

    if (!progressDoc) {
      // Create new progress document
      progressDoc = {
        userId: userObjectId,
        bootcampId: id,
        lessons: [],
        updatedAt: new Date()
      };
      await db.collection('bootcamp_progress').insertOne(progressDoc);
    }

    // Update or add lesson progress
    const lessons = progressDoc.lessons || [];
    const lessonIndex = lessons.findIndex((l: any) => l.lessonId === lessonId);

    const lessonProgress = {
      lessonId,
      progress,
      lastWatchedAt: new Date(),
      ...(isCompleted && !lessons[lessonIndex]?.completedAt ? { completedAt: new Date() } : {}),
      ...(lessons[lessonIndex]?.completedAt ? { completedAt: lessons[lessonIndex].completedAt } : {})
    };

    if (lessonIndex >= 0) {
      lessons[lessonIndex] = lessonProgress;
    } else {
      lessons.push(lessonProgress);
    }

    // Update progress document
    await db.collection('bootcamp_progress').updateOne(
      { userId: userObjectId, bootcampId: id },
      {
        $set: {
          lessons,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      progress,
      completed: isCompleted,
      lessonId
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to update progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

