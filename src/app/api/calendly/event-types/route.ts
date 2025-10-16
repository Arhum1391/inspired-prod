import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/calendly/event-types
 * Fetches all event types for a specific Calendly user
 * Query params: analystId (required)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const analystId = searchParams.get('analystId');

    if (!analystId) {
      return NextResponse.json(
        { error: 'Analyst ID is required' },
        { status: 400 }
      );
    }

    // Fetch analyst's Calendly credentials from database
    const credentialsResponse = await fetch(
      `${request.nextUrl.origin}/api/analysts/calendly-credentials?analystId=${analystId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!credentialsResponse.ok) {
      const errorData = await credentialsResponse.json();
      console.error('❌ Failed to fetch analyst credentials:', errorData);
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch analyst credentials' },
        { status: credentialsResponse.status }
      );
    }

    const credentialsData = await credentialsResponse.json();
    const { userUri, accessToken } = credentialsData.credentials;

    // Debug logging
    console.log('=== CALENDLY EVENT TYPES API DEBUG ===');
    console.log('1. Request parameters:');
    console.log('   - analystId:', analystId);
    console.log('   - analyst name:', credentialsData.analyst.name);
    console.log('2. Credentials check:');
    console.log('   - userUri exists:', !!userUri);
    console.log('   - accessToken exists:', !!accessToken);
    console.log('   - userUri value:', userUri);
    console.log('=====================================');

    // Fetch event types from Calendly API
        // First, get the current user's info to ensure we're using the right user URI
        const userResponse = await fetch('https://api.calendly.com/users/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.json().catch(() => ({}));
            console.error('Failed to get current user info:', errorData);
            return NextResponse.json(
                { error: 'Failed to get current user info', details: errorData },
                { status: userResponse.status }
            );
        }

        const userData = await userResponse.json();
        const currentUserUri = userData.resource.uri;
        
        console.log('Current user URI from token:', currentUserUri);
        console.log('Requested user URI:', userUri);
        
        // Use the current user's URI if it matches, otherwise use the requested URI
        const targetUserUri = currentUserUri === userUri ? currentUserUri : userUri;

        const response = await fetch(
            `https://api.calendly.com/event_types?user=${encodeURIComponent(targetUserUri)}&active=true`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
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
    const allEventTypes = data.collection?.map((eventType: any) => ({
      id: eventType.uri,
      slug: eventType.slug,
      name: eventType.name,
      duration: eventType.duration,
      description: eventType.description_plain || eventType.description_html || '',
      active: eventType.active,
      booking_url: eventType.scheduling_url,
      color: eventType.color || '#000000',
    })) || [];

    // Filter event types to only include those that belong to the current user
    // We can identify this by checking if the booking_url contains the user's scheduling URL
    const userSchedulingUrl = userData.resource.scheduling_url;
    console.log('User scheduling URL:', userSchedulingUrl);
    
    const eventTypes = allEventTypes.filter((eventType: any) => {
      // Check if the booking URL belongs to the current user
      const belongsToUser = eventType.booking_url && eventType.booking_url.includes(userSchedulingUrl);
      console.log(`Event "${eventType.name}": ${eventType.booking_url} -> belongs to user: ${belongsToUser}`);
      return belongsToUser;
    });
    
    console.log(`✅ Filtered event types: ${allEventTypes.length} -> ${eventTypes.length}`);

    return NextResponse.json({
      success: true,
      eventTypes,
      count: eventTypes.length,
      analystId: parseInt(analystId),
      userUri: targetUserUri,
      userSchedulingUrl: userSchedulingUrl,
      originalCount: allEventTypes.length
    });
  } catch (error) {
    console.error('Error fetching Calendly event types:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

