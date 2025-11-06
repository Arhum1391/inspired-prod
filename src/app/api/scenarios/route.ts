import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'scenarios';

export async function POST(request: NextRequest) {
  try {
    // 1. Get and verify token
    const token = request.cookies.get('user-auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 2. Use userId to save data
    const userId = decoded.userId; // This is the MongoDB _id as string

    const {
      scenarioName,
      tradingPair,
      selectedAsset,
      accountBalance,
      riskPercentage,
      stopLoss,
      pipValue,
      lotSize,
      forexLotType,
      riskAmount,
      positionValue,
    } = await request.json();

    // Validate required fields
    if (!scenarioName || !tradingPair || !selectedAsset) {
      return NextResponse.json(
        { error: 'Scenario name, trading pair, and asset type are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    // Create scenario document
    const scenario = {
      userId: new ObjectId(userId),
      scenarioName,
      tradingPair,
      selectedAsset,
      accountBalance: accountBalance ? parseFloat(accountBalance) : null,
      riskPercentage: riskPercentage ? parseFloat(riskPercentage) : null,
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      pipValue: pipValue ? parseFloat(pipValue) : null,
      lotSize: lotSize ? parseFloat(lotSize) : null,
      forexLotType: forexLotType || null,
      riskAmount: riskAmount ? parseFloat(riskAmount) : null,
      positionValue: positionValue ? parseFloat(positionValue) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await collection.insertOne(scenario);

    if (result.insertedId) {
      return NextResponse.json(
        {
          success: true,
          message: 'Scenario saved successfully',
          scenarioId: result.insertedId.toString(),
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to save scenario' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Save scenario error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 1. Get and verify token
    const token = request.cookies.get('user-auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 2. Use userId to retrieve user's data
    const userId = decoded.userId;

    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    // 3. Retrieve user's scenarios
    const scenarios = await collection
      .find({
        userId: new ObjectId(userId),
      })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .toArray();

    // Format scenarios for response
    const formattedScenarios = scenarios.map((scenario) => ({
      id: scenario._id.toString(),
      scenarioName: scenario.scenarioName,
      tradingPair: scenario.tradingPair,
      selectedAsset: scenario.selectedAsset,
      accountBalance: scenario.accountBalance,
      riskPercentage: scenario.riskPercentage,
      stopLoss: scenario.stopLoss,
      pipValue: scenario.pipValue,
      lotSize: scenario.lotSize,
      forexLotType: scenario.forexLotType,
      riskAmount: scenario.riskAmount,
      positionValue: scenario.positionValue,
      createdAt: scenario.createdAt,
      updatedAt: scenario.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      scenarios: formattedScenarios,
      count: formattedScenarios.length,
    });
  } catch (error) {
    console.error('Get scenarios error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

