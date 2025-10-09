import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/calendly/event-types
 * Fetches all event types for a specific Calendly user
 * Query params: userUri (optional, defaults to Assassin's URI)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userUri = searchParams.get('userUri') || process.env.CALENDLY_ASSASSIN_USER_URI;

    if (!process.env.CALENDLY_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Calendly access token not configured' },
        { status: 500 }
      );
    }

    if (!userUri) {
      return NextResponse.json(
        { error: 'User URI is required' },
        { status: 400 }
      );
    }

    // Fetch event types from Calendly API
    const response = await fetch(
      `https://api.calendly.com/event_types?user=${encodeURIComponent(userUri)}&active=true`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Calendly API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch event types from Calendly', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform the data to a simpler format
    const eventTypes = data.collection?.map((eventType: any) => ({
      id: eventType.uri,
      slug: eventType.slug,
      name: eventType.name,
      duration: eventType.duration,
      description: eventType.description_plain || eventType.description_html || '',
      active: eventType.active,
      booking_url: eventType.scheduling_url,
      color: eventType.color || '#000000',
    })) || [];

    return NextResponse.json({
      success: true,
      eventTypes,
      count: eventTypes.length,
    });
  } catch (error) {
    console.error('Error fetching Calendly event types:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

