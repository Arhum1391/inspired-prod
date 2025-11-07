import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'scenarios';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // 2. Get scenario ID from params
    const { id: scenarioId } = await params;
    if (!scenarioId) {
      return NextResponse.json(
        { error: 'Scenario ID is required' },
        { status: 400 }
      );
    }

    const userId = decoded.userId;
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

    // 3. Update scenario only if it belongs to the user
    const result = await collection.updateOne(
      {
        _id: new ObjectId(scenarioId),
        userId: new ObjectId(userId),
      },
      {
        $set: {
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
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Scenario not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Scenario updated successfully',
    });
  } catch (error) {
    console.error('Update scenario error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // 2. Get scenario ID from params
    const { id: scenarioId } = await params;
    if (!scenarioId) {
      return NextResponse.json(
        { error: 'Scenario ID is required' },
        { status: 400 }
      );
    }

    const userId = decoded.userId;
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    // 3. Delete scenario only if it belongs to the user
    const result = await collection.deleteOne({
      _id: new ObjectId(scenarioId),
      userId: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Scenario not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Scenario deleted successfully',
    });
  } catch (error) {
    console.error('Delete scenario error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

