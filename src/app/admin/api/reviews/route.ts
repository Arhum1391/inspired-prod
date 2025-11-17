import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { listAllReviews } from '@/lib/reviews';
import { ReviewStatus } from '@/types/admin';

async function getReviews(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status') as ReviewStatus | null;

    if (statusParam && !['pending', 'approved', 'rejected'].includes(statusParam)) {
      return NextResponse.json(
        { error: 'Invalid status filter' },
        { status: 400 }
      );
    }

    const reviews = await listAllReviews(statusParam ?? undefined);
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Admin reviews fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getReviews);

