import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const cookieOptions = {
      httpOnly: true as const,
      secure: false, // Set to true when using HTTPS
      sameSite: 'lax' as const,
      maxAge: 0,
      path: '/',
      ...(process.env.AUTH_COOKIE_DOMAIN
        ? { domain: process.env.AUTH_COOKIE_DOMAIN }
        : {}),
    };

    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Clear the auth cookie
    response.cookies.set('user-auth-token', '', cookieOptions);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

