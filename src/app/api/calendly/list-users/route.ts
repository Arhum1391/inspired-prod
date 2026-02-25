import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/calendly/list-users
 * Lists all users in the Calendly organization
 * Requires organization admin access token
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationUri = searchParams.get('organizationUri');

    if (!process.env.CALENDLY_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Calendly access token not configured' },
        { status: 500 }
      );
    }

    if (!organizationUri) {
      // First, get the current user to find their organization
      const userResponse = await fetch('https://api.calendly.com/users/me', {
        headers: {
          'Authorization': `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch user info' },
          { status: userResponse.status }
        );
      }

      const userData = await userResponse.json();
      const userOrgUri = userData.resource.current_organization;

      if (!userOrgUri) {
        return NextResponse.json(
          { error: 'No organization found. Individual account or organization URI required.' },
          { status: 400 }
        );
      }

      // Recursively call with organization URI
      return GET(
        new NextRequest(new URL(`${request.url}?organizationUri=${userOrgUri}`))
      );
    }

    // Fetch all users in the organization
    const response = await fetch(
      `https://api.calendly.com/organization_memberships?organization=${encodeURIComponent(organizationUri)}`,
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
        { error: 'Failed to fetch organization users', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform to simpler format
    const users = await Promise.all(
      (data.collection || []).map(async (membership: any) => {
        const userUri = membership.user.uri;
        
        // Fetch full user details
        const userDetailResponse = await fetch(userUri, {
          headers: {
            'Authorization': `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (userDetailResponse.ok) {
          const userDetail = await userDetailResponse.json();
          return {
            uri: userUri,
            name: userDetail.resource.name,
            email: userDetail.resource.email,
            scheduling_url: userDetail.resource.scheduling_url,
            avatar_url: userDetail.resource.avatar_url,
            role: membership.role,
          };
        }

        // Fallback if detail fetch fails
        return {
          uri: userUri,
          name: membership.user.name || 'Unknown',
          email: membership.user.email || 'Unknown',
          role: membership.role,
        };
      })
    );

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
      organizationUri,
    });
  } catch (error) {
    console.error('Error fetching Calendly users:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

