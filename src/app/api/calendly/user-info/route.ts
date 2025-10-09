import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/calendly/user-info
 * Fetches the current authenticated user's information
 * This helps to get the user URI needed for other API calls
 */
export async function GET(request: NextRequest) {
  try {
    if (!process.env.CALENDLY_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Calendly access token not configured' },
        { status: 500 }
      );
    }

    // Fetch user info from Calendly API
    const response = await fetch('https://api.calendly.com/users/me', {
      headers: {
        'Authorization': `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Calendly API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch user info from Calendly', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const user = data.resource;

    return NextResponse.json({
      success: true,
      user: {
        uri: user.uri,
        name: user.name,
        email: user.email,
        scheduling_url: user.scheduling_url,
        timezone: user.timezone,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    console.error('Error fetching Calendly user info:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

