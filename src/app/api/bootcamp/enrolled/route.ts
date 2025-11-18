import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authHelpers';
import { ObjectId } from 'mongodb';

// GET all enrolled bootcamps for the authenticated user
export async function GET(request: NextRequest) {
  try {
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

    // Get all enrolled bootcamps for this user
    // Try multiple query variations to handle different data formats
    let enrollments = await db.collection('bootcamp_registrations').find({
      userId: userObjectId,
      paymentStatus: 'paid',
      status: 'confirmed'
    }).sort({ createdAt: -1 }).toArray();

    // If no enrollments found with strict criteria, try without status check
    if (enrollments.length === 0) {
      enrollments = await db.collection('bootcamp_registrations').find({
        userId: userObjectId,
        paymentStatus: 'paid'
      }).sort({ createdAt: -1 }).toArray();
    }

    // Debug: Log all registrations for this user
    if (enrollments.length === 0) {
      const allRegistrations = await db.collection('bootcamp_registrations').find({
        userId: userObjectId
      }).toArray();
      console.log(`🔍 All registrations for user ${userId}:`, {
        count: allRegistrations.length,
        registrations: allRegistrations.map(r => ({
          bootcampId: r.bootcampId,
          paymentStatus: r.paymentStatus,
          status: r.status,
          userId: r.userId?.toString()
        }))
      });
    }

    if (enrollments.length === 0) {
      return NextResponse.json({
        enrolledBootcamps: []
      }, { status: 200 });
    }

    // Get bootcamp details for each enrollment and progress data
    const enrolledBootcamps = await Promise.all(
      enrollments.map(async (enrollment) => {
        const bootcamp = await db.collection('bootcamps').findOne({
          id: enrollment.bootcampId,
          isActive: true
        });

        if (!bootcamp) {
          return null;
        }

        // Get progress data for this bootcamp
        const progressData = await db.collection('bootcamp_progress').findOne({
          userId: userObjectId,
          bootcampId: enrollment.bootcampId
        });

        // Fetch actual lessons from bootcamp_lessons collection
        const lessons = await db.collection('bootcamp_lessons')
          .find({ bootcampId: enrollment.bootcampId })
          .sort({ order: 1 })
          .toArray();

        const totalLessons = lessons.length;

        // Calculate overall progress from lessons
        let overallProgress = 0;
        let completedLessons = 0;

        if (totalLessons > 0) {
          // Create a map of lesson progress for quick lookup
          const progressMap = new Map<string, number>();
          const completedMap = new Map<string, boolean>();
          
          if (progressData?.lessons && Array.isArray(progressData.lessons)) {
            progressData.lessons.forEach((lessonProgress: any) => {
              progressMap.set(lessonProgress.lessonId, lessonProgress.progress || 0);
              if (lessonProgress.completedAt || lessonProgress.progress >= 90) {
                completedMap.set(lessonProgress.lessonId, true);
              }
            });
          }

          // Calculate progress for all lessons
          let totalProgress = 0;
          lessons.forEach((lesson) => {
            const progress = progressMap.get(lesson.lessonId) || 0;
            totalProgress += progress;
            if (completedMap.get(lesson.lessonId) || progress >= 90) {
              completedLessons++;
            }
          });

          overallProgress = Math.round(totalProgress / totalLessons);
        }

        return {
          bootcamp: {
            id: bootcamp.id,
            title: bootcamp.title,
            description: bootcamp.description,
            price: bootcamp.price,
            duration: bootcamp.duration,
            format: bootcamp.format,
            mentors: bootcamp.mentors || [],
            curriculumSections: bootcamp.curriculumSections || []
          },
          enrollment: {
            bootcampId: enrollment.bootcampId,
            enrolledAt: enrollment.createdAt,
            amount: enrollment.amount,
            currency: enrollment.currency
          },
          progress: {
            overallProgress,
            completedLessons,
            totalLessons,
            lastUpdated: progressData?.updatedAt || enrollment.createdAt
          }
        };
      })
    );

    // Filter out null values (bootcamps that no longer exist)
    const validEnrolledBootcamps = enrolledBootcamps.filter(b => b !== null);

    return NextResponse.json({
      enrolledBootcamps: validEnrolledBootcamps
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch enrolled bootcamps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrolled bootcamps' },
      { status: 500 }
    );
  }
}

