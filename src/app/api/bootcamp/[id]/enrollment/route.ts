import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authHelpers';
import { ObjectId } from 'mongodb';

// GET enrollment status for a bootcamp
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
    // Try multiple query variations to handle different data formats
    let enrollment = await db.collection('bootcamp_registrations').findOne({
      userId: userObjectId,
      bootcampId: id,
      paymentStatus: 'paid',
      status: 'confirmed'
    });

    // If not found, try without status check (in case status field is missing)
    if (!enrollment) {
      enrollment = await db.collection('bootcamp_registrations').findOne({
        userId: userObjectId,
        bootcampId: id,
        paymentStatus: 'paid'
      });
    }

    // If still not found, try with just userId and bootcampId
    if (!enrollment) {
      enrollment = await db.collection('bootcamp_registrations').findOne({
        userId: userObjectId,
        bootcampId: id
      });
      if (enrollment) {
        console.log(`⚠️ Found enrollment but with different status:`, {
          paymentStatus: enrollment.paymentStatus,
          status: enrollment.status
        });
      }
    }

    // Debug: Check all registrations for this user
    if (!enrollment) {
      const allUserRegistrations = await db.collection('bootcamp_registrations').find({
        userId: userObjectId
      }).toArray();
      console.log(`🔍 All registrations for user ${userId}:`, {
        count: allUserRegistrations.length,
        registrations: allUserRegistrations.map(r => ({
          bootcampId: r.bootcampId,
          paymentStatus: r.paymentStatus,
          status: r.status
        }))
      });

      const allBootcampRegistrations = await db.collection('bootcamp_registrations').find({
        bootcampId: id
      }).toArray();
      console.log(`🔍 All registrations for bootcamp ${id}:`, {
        count: allBootcampRegistrations.length,
        registrations: allBootcampRegistrations.map(r => ({
          userId: r.userId?.toString(),
          paymentStatus: r.paymentStatus,
          status: r.status
        }))
      });
    }

    if (!enrollment) {
      return NextResponse.json(
        { enrolled: false, message: 'You are not enrolled in this bootcamp' },
        { status: 200 }
      );
    }

    // Get bootcamp details
    const bootcamp = await db.collection('bootcamps').findOne({
      id: id,
      isActive: true
    });

    return NextResponse.json({
      enrolled: true,
      enrollment: {
        bootcampId: enrollment.bootcampId,
        enrolledAt: enrollment.createdAt,
        amount: enrollment.amount,
        currency: enrollment.currency
      },
      bootcamp: bootcamp ? {
        id: bootcamp.id,
        title: bootcamp.title,
        description: bootcamp.description
      } : null
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to check enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to check enrollment' },
      { status: 500 }
    );
  }
}

