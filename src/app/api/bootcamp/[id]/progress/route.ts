import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authHelpers';
import { ObjectId } from 'mongodb';

interface ProgressLesson {
  id: string;
  lessonId: string;
  title: string;
  thumbnail: string;
  youtubeVideoId: string;
  progress: number;
  status: 'completed' | 'in-progress';
  duration?: number;
}

// GET user's progress for a bootcamp
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // Check if user is enrolled in this bootcamp
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

    // Get bootcamp details
    const bootcamp = await db.collection('bootcamps').findOne({
      id: id,
      isActive: true
    });

    if (!bootcamp) {
      return NextResponse.json(
        { error: 'Bootcamp not found' },
        { status: 404 }
      );
    }

    // Get user's progress from bootcamp_progress collection
    const progressData = await db.collection('bootcamp_progress').findOne({
      userId: userObjectId,
      bootcampId: id
    });

    // Fetch lessons from database
    const lessons = await db.collection('bootcamp_lessons')
      .find({ bootcampId: id })
      .sort({ order: 1 })
      .toArray();

    // Create a map of lesson progress for quick lookup
    const progressMap = new Map<string, number>();
    const completedMap = new Map<string, boolean>();
    
    if (progressData?.lessons && Array.isArray(progressData.lessons)) {
      progressData.lessons.forEach((lessonProgress: any) => {
        progressMap.set(lessonProgress.lessonId, lessonProgress.progress || 0);
        if (lessonProgress.completedAt) {
          completedMap.set(lessonProgress.lessonId, true);
        }
      });
    }

    // Map database lessons to ProgressLesson format
    const progressLessons: ProgressLesson[] = lessons.map((lesson) => {
      const progress = progressMap.get(lesson.lessonId) || 0;
      const isCompleted = completedMap.get(lesson.lessonId) || progress >= 90;
      
      return {
        id: lesson.lessonId,
        lessonId: lesson.lessonId,
        title: lesson.title,
        thumbnail: lesson.thumbnail || `https://i.ytimg.com/vi/${lesson.youtubeVideoId}/maxresdefault.jpg`,
        youtubeVideoId: lesson.youtubeVideoId,
        progress,
        status: isCompleted ? 'completed' : 'in-progress',
        duration: lesson.duration,
      };
    });

    // Calculate overall progress
    const totalProgress = progressLessons.length > 0
      ? progressLessons.reduce((sum, lesson) => sum + lesson.progress, 0) / progressLessons.length
      : 0;
    const completedCount = progressLessons.filter(lesson => lesson.status === 'completed').length;

    return NextResponse.json({
      bootcamp: {
        id: bootcamp.id,
        title: bootcamp.title,
        description: bootcamp.description
      },
      enrollment: {
        enrolledAt: enrollment.createdAt,
        bootcampId: enrollment.bootcampId
      },
      lessons: progressLessons,
      overallProgress: Math.round(totalProgress),
      completedLessons: completedCount,
      totalLessons: progressLessons.length,
      lastUpdated: progressData?.updatedAt || enrollment.createdAt
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

