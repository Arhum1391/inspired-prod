import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/calendly/availability
 * Fetches available time slots for a specific event type
 * Query params: 
 *   - eventTypeUri: URI of the event type
 *   - startDate: Start date in YYYY-MM-DD format
 *   - endDate: End date in YYYY-MM-DD format (optional, defaults to startDate)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventTypeUri = searchParams.get('eventTypeUri');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate') || startDate;

    if (!process.env.CALENDLY_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Calendly access token not configured' },
        { status: 500 }
      );
    }

    if (!eventTypeUri || !startDate) {
      return NextResponse.json(
        { error: 'Event type URI and start date are required' },
        { status: 400 }
      );
    }

    // Format dates for Calendly API (ISO 8601 format)
    const startTime = `${startDate}T00:00:00Z`;
    const endTime = `${endDate}T23:59:59Z`;

    // Fetch available time slots from Calendly API
    const url = new URL('https://api.calendly.com/event_type_available_times');
    url.searchParams.append('event_type', eventTypeUri);
    url.searchParams.append('start_time', startTime);
    url.searchParams.append('end_time', endTime);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Calendly API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch availability from Calendly', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('Calendly API Response:', {
      collectionLength: data.collection?.length || 0,
      firstSlot: data.collection?.[0]
    });

    // Transform the data to group by date
    const availabilityByDate: Record<string, string[]> = {};
    const slotUrlsByDateTime: Record<string, string> = {};
    const rawSlotsByDateTime: Record<string, string> = {}; // Store raw ISO timestamps
    
    if (data.collection && Array.isArray(data.collection)) {
      data.collection.forEach((slot: any) => {
        // Parse the UTC time from Calendly
        const utcDate = new Date(slot.start_time);
        
        // Get date in YYYY-MM-DD format (in UTC to match calendar)
        const year = utcDate.getUTCFullYear();
        const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(utcDate.getUTCDate()).padStart(2, '0');
        const date = `${year}-${month}-${day}`;
        
        // Format time consistently (keep as UTC for reference)
        const hours = utcDate.getUTCHours();
        const minutes = utcDate.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = String(minutes).padStart(2, '0');
        const time = `${displayHours}:${displayMinutes} ${ampm}`;

        if (!availabilityByDate[date]) {
          availabilityByDate[date] = [];
        }
        availabilityByDate[date].push(time);
        
        // Store the scheduling URL and raw timestamp for this specific date/time combination
        const dateTimeKey = `${date}|${time}`;
        slotUrlsByDateTime[dateTimeKey] = slot.scheduling_url;
        rawSlotsByDateTime[dateTimeKey] = slot.start_time; // Store ISO timestamp
      });
    }

    // Get available dates (dates with at least one slot)
    const availableDates = Object.keys(availabilityByDate).sort();

    console.log('Transformed availability:', {
      availableDatesCount: availableDates.length,
      availableDates,
      sampleDate: availableDates[0],
      sampleTimes: availableDates[0] ? availabilityByDate[availableDates[0]] : []
    });

    return NextResponse.json({
      success: true,
      availableDates,
      availabilityByDate,
      slotUrls: slotUrlsByDateTime,
      rawTimestamps: rawSlotsByDateTime,
      totalSlots: data.collection?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching Calendly availability:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

