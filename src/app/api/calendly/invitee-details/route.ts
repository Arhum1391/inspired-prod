import { NextRequest, NextResponse } from 'next/server';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function findStartTimeInResponse(obj: unknown, depth = 0): string | null {
  if (depth > 6 || obj == null) return null;
  if (typeof obj === 'string' && ISO_DATE_RE.test(obj)) return obj;
  if (typeof obj !== 'object') return null;
  const o = obj as Record<string, unknown>;
  for (const key of ['start_time', 'scheduled_event_start_time', 'start', 'scheduled_start_time']) {
    const v = o[key];
    if (typeof v === 'string' && ISO_DATE_RE.test(v)) return v;
  }
  for (const v of Object.values(o)) {
    const found = findStartTimeInResponse(v, depth + 1);
    if (found) return found;
  }
  return null;
}

/**
 * GET /api/calendly/invitee-details
 * Fetches a scheduled invitee from Calendly API to get the actual booked start_time.
 * Query params: inviteeUri (full Calendly invitee API URL), analystId (for auth)
 * Returns { start_time } in ISO format so the success page can show the slot the user actually booked.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const inviteeUri = searchParams.get('inviteeUri');
    const analystId = searchParams.get('analystId');

    if (!inviteeUri || !analystId) {
      return NextResponse.json(
        { error: 'inviteeUri and analystId are required' },
        { status: 400 }
      );
    }

    // Must be Calendly API URL for security
    if (!inviteeUri.startsWith('https://api.calendly.com/')) {
      return NextResponse.json(
        { error: 'Invalid invitee URI' },
        { status: 400 }
      );
    }

    const credentialsResponse = await fetch(
      `${request.nextUrl.origin}/api/analysts/calendly-credentials?analystId=${analystId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!credentialsResponse.ok) {
      const err = await credentialsResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.error || 'Failed to get analyst credentials' },
        { status: credentialsResponse.status }
      );
    }

    const { credentials } = await credentialsResponse.json();
    const accessToken = credentials?.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Calendly access token for this analyst' },
        { status: 401 }
      );
    }

    const response = await fetch(inviteeUri, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Calendly invitee fetch failed:', response.status, errBody);
      return NextResponse.json(
        { error: 'Failed to fetch invitee from Calendly' },
        { status: response.status }
      );
    }

    const data = await response.json();
    let startTime = findStartTimeInResponse(data);

    // Invitee response may not include start_time; it can be on the event. Derive event URI and fetch.
    if (!startTime && inviteeUri.includes('/scheduled_events/') && inviteeUri.includes('/invitees/')) {
      const eventUri = inviteeUri.split('/invitees/')[0];
      if (eventUri.startsWith('https://api.calendly.com/')) {
        const eventRes = await fetch(eventUri, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (eventRes.ok) {
          const eventData = await eventRes.json();
          startTime = findStartTimeInResponse(eventData);
        }
      }
    }

    if (!startTime) {
      console.error('Calendly invitee response missing start_time. Top-level keys:', Object.keys(data ?? {}));
      return NextResponse.json(
        { error: 'No start_time in invitee response' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      start_time: startTime,
    });
  } catch (error) {
    console.error('Invitee details API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
