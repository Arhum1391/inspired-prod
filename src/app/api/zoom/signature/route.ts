import { NextRequest, NextResponse } from 'next/server';
import { KJUR } from 'jsrsasign';

const ZOOM_SDK_KEY = process.env.ZOOM_MEETING_SDK_KEY;
const ZOOM_SDK_SECRET = process.env.ZOOM_MEETING_SDK_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!ZOOM_SDK_KEY || !ZOOM_SDK_SECRET) {
      return NextResponse.json(
        { error: 'Zoom Meeting SDK not configured. Set ZOOM_MEETING_SDK_KEY and ZOOM_MEETING_SDK_SECRET.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const meetingNumber = String(body.meetingNumber || '').replace(/\D/g, '');
    const role = body.role !== undefined ? Number(body.role) : 0;
    const expirationSeconds = body.expirationSeconds
      ? Math.min(172800, Math.max(1800, Number(body.expirationSeconds)))
      : 7200; // 2 hours default

    if (!meetingNumber) {
      return NextResponse.json(
        { error: 'meetingNumber is required' },
        { status: 400 }
      );
    }

    if (role !== 0 && role !== 1) {
      return NextResponse.json(
        { error: 'role must be 0 (participant) or 1 (host)' },
        { status: 400 }
      );
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + expirationSeconds;

    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const oPayload = {
      appKey: ZOOM_SDK_KEY,
      sdkKey: ZOOM_SDK_KEY,
      mn: meetingNumber,
      role,
      iat,
      exp,
      tokenExp: exp,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const signature = KJUR.jws.JWS.sign(
      'HS256',
      sHeader,
      sPayload,
      ZOOM_SDK_SECRET
    );

    return NextResponse.json({ signature, sdkKey: ZOOM_SDK_KEY });
  } catch (error) {
    console.error('Zoom signature error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
