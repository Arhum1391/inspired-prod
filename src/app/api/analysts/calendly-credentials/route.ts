import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

/**
 * GET /api/analysts/calendly-credentials
 * Fetches Calendly credentials for a specific analyst from MongoDB
 * Query params: analystId (required)
 */
export async function GET(request: NextRequest) {
  let client: MongoClient | null = null;
  
  try {
    const { searchParams } = new URL(request.url);
    const analystId = searchParams.get('analystId');

    if (!analystId) {
      return NextResponse.json(
        { error: 'Analyst ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'MongoDB URI not configured' },
        { status: 500 }
      );
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db('inspired-analyst');
    const analystsCollection = db.collection('analysts');

    // Find analyst by analystId
    const analyst = await analystsCollection.findOne(
      { analystId: parseInt(analystId) },
      { 
        projection: { 
          analystId: 1, 
          name: 1, 
          calendly: 1 
        } 
      }
    );

    if (!analyst) {
      return NextResponse.json(
        { error: `Analyst with ID ${analystId} not found` },
        { status: 404 }
      );
    }

    // Check if Calendly is enabled for this analyst
    if (!analyst.calendly?.enabled) {
      return NextResponse.json(
        { 
          error: `Calendly integration is not enabled for analyst ${analystId}`,
          analyst: {
            analystId: analyst.analystId,
            name: analyst.name,
            calendlyEnabled: false
          }
        },
        { status: 400 }
      );
    }

    // Validate required Calendly credentials
    if (!analyst.calendly.userUri || !analyst.calendly.accessToken) {
      return NextResponse.json(
        { 
          error: `Incomplete Calendly credentials for analyst ${analystId}`,
          analyst: {
            analystId: analyst.analystId,
            name: analyst.name,
            calendlyEnabled: true,
            hasUserUri: !!analyst.calendly.userUri,
            hasAccessToken: !!analyst.calendly.accessToken
          }
        },
        { status: 400 }
      );
    }

    // Return credentials (without logging sensitive data)
    return NextResponse.json({
      success: true,
      analyst: {
        analystId: analyst.analystId,
        name: analyst.name,
        calendly: {
          enabled: analyst.calendly.enabled,
          userUri: analyst.calendly.userUri
        }
      },
      credentials: {
        userUri: analyst.calendly.userUri,
        accessToken: analyst.calendly.accessToken
      }
    });

  } catch (error) {
    console.error('Error fetching analyst Calendly credentials:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

/**
 * PUT /api/analysts/calendly-credentials
 * Updates Calendly credentials for a specific analyst
 * Body: { analystId, userUri, accessToken, enabled }
 */
export async function PUT(request: NextRequest) {
  let client: MongoClient | null = null;
  
  try {
    const body = await request.json();
    const { analystId, userUri, accessToken, enabled = true } = body;

    if (!analystId) {
      return NextResponse.json(
        { error: 'Analyst ID is required' },
        { status: 400 }
      );
    }

    if (enabled && (!userUri || !accessToken)) {
      return NextResponse.json(
        { error: 'User URI and access token are required when enabling Calendly' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'MongoDB URI not configured' },
        { status: 500 }
      );
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db('inspired-analyst');
    const analystsCollection = db.collection('analysts');

    // Update analyst's Calendly credentials
    const updateData = {
      'calendly.enabled': enabled
    };

    if (enabled) {
      updateData['calendly.userUri'] = userUri;
      updateData['calendly.accessToken'] = accessToken;
    } else {
      updateData['calendly.userUri'] = null;
      updateData['calendly.accessToken'] = null;
    }

    const result = await analystsCollection.updateOne(
      { analystId: parseInt(analystId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: `Analyst with ID ${analystId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Calendly credentials updated for analyst ${analystId}`,
      updated: result.modifiedCount > 0
    });

  } catch (error) {
    console.error('Error updating analyst Calendly credentials:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
