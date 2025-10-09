import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/calendly/create-booking
 * Creates a single-use scheduling link for a Calendly event
 * This allows users to book directly without going through Calendly's UI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventTypeUri, name, email, startTime, notes } = body;

    if (!process.env.CALENDLY_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Calendly access token not configured' },
        { status: 500 }
      );
    }

    if (!eventTypeUri || !name || !email || !startTime) {
      return NextResponse.json(
        { error: 'Event type URI, name, email, and start time are required' },
        { status: 400 }
      );
    }

    console.log('Creating Calendly booking:', { eventTypeUri, name, email, startTime });

    // Create a single-use scheduling link
    const response = await fetch('https://api.calendly.com/scheduling_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        max_event_count: 1,
        owner: eventTypeUri,
        owner_type: 'EventType'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Calendly API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create scheduling link', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Calendly scheduling link created:', data);

    // Build the booking URL with pre-filled information
    const schedulingUrl = data.resource.booking_url;
    const bookingUrl = new URL(schedulingUrl);
    
    // Add query parameters for pre-filling
    bookingUrl.searchParams.append('name', name);
    bookingUrl.searchParams.append('email', email);
    if (notes) {
      bookingUrl.searchParams.append('a1', notes); // a1 is the first custom answer field
    }
    
    // Add the selected time if it matches a slot
    if (startTime) {
      bookingUrl.searchParams.append('date_and_time', startTime);
    }

    return NextResponse.json({
      success: true,
      bookingUrl: bookingUrl.toString(),
      schedulingLink: data.resource.booking_url,
      message: 'Scheduling link created successfully'
    });
  } catch (error) {
    console.error('Error creating Calendly booking:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

