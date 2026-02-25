import { NextRequest, NextResponse } from 'next/server';
import { getReviewStatsForAnalyst } from '@/lib/reviews';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const analystParam = searchParams.get('analystId');

    if (!analystParam) {
      return NextResponse.json(
        { error: 'analystId query parameter is required' },
        { status: 400 }
      );
    }

    const analystId = Number(analystParam);
    if (Number.isNaN(analystId)) {
      return NextResponse.json(
        { error: 'analystId must be numeric' },
        { status: 400 }
      );
    }

    const stats = await getReviewStatsForAnalyst(analystId);
    const response = NextResponse.json({ stats });
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch review stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review stats' },
      { status: 500 }
    );
  }
}

