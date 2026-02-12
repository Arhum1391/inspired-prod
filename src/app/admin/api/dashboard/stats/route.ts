import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { getDatabase } from '@/lib/mongodb';

async function handler(req: NextRequest, userId: string) {
  try {
    const db = await getDatabase();

    // Get team members count
    const teamMembersCount = await db.collection('team').countDocuments();

    // Get total users count from public_users collection
    const totalUsersCount = await db.collection('public_users').countDocuments();

    // Get bookings for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookingsTodayCount = await db.collection('bookings').countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // Get active bootcamps count
    const activeBootcampsCount = await db.collection('bootcamps').countDocuments({
      isActive: true,
    });

    const stats = {
      teamMembers: teamMembersCount,
      subscribers: totalUsersCount,
      bookingsToday: bookingsTodayCount,
      activeBootcamps: activeBootcampsCount,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
