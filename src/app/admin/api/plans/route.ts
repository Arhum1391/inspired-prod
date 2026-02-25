import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function to verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return { error: 'Authentication required', status: 401, user: null };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return { error: 'Invalid token', status: 401, user: null };
  }

  const user = await getUserById(decoded.userId);
  if (!user) {
    return { error: 'User not found', status: 404, user: null };
  }

  return { error: null, status: 200, user };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const db = await getDatabase();
    const collection = db.collection('plans');

    // Fetch all plans (including inactive ones for admin)
    const plans = await collection
      .find({})
      .sort({ planId: 1 })
      .toArray();

    // Ensure boolean values are properly set
    const normalizedPlans = plans.map(plan => ({
      ...plan,
      isFree: Boolean(plan.isFree),
      isActive: plan.isActive !== false,
      isPopular: Boolean(plan.isPopular),
    }));

    return NextResponse.json(
      { plans: normalizedPlans },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const {
      planId,
      name,
      description,
      priceAmount,
      priceDisplay,
      priceAccent,
      billingNote,
      billingInterval,
      stripePriceId,
      isPopular,
      isFree,
      isActive,
      features,
    } = body;

    // Validate required fields
    if (!planId || !name || priceAmount === undefined || !billingInterval) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, name, priceAmount, billingInterval' },
        { status: 400 }
      );
    }

    // Validate priceAmount
    if (priceAmount < 0) {
      return NextResponse.json(
        { error: 'Price amount must be >= 0' },
        { status: 400 }
      );
    }

    // Validate billingInterval
    const validIntervals = ['month', 'year', '6 months'];
    if (!validIntervals.includes(billingInterval)) {
      return NextResponse.json(
        { error: `Invalid billingInterval. Must be one of: ${validIntervals.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate features array
    if (!Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Features must be an array' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('plans');

    // Check if planId already exists
    const existingPlan = await collection.findOne({ planId });
    if (existingPlan) {
      return NextResponse.json(
        { error: `Plan with planId "${planId}" already exists` },
        { status: 400 }
      );
    }

    // Check max 3 plans limit
    const planCount = await collection.countDocuments();
    if (planCount >= 3) {
      return NextResponse.json(
        { error: 'Maximum of 3 plans allowed' },
        { status: 400 }
      );
    }

    // Auto-generate priceDisplay if not provided
    let finalPriceDisplay = priceDisplay;
    if (!finalPriceDisplay && priceAmount !== undefined) {
      if (billingInterval === 'month') {
        finalPriceDisplay = `$${priceAmount} USD/month`;
      } else if (billingInterval === '6 months') {
        finalPriceDisplay = `$${priceAmount} USD/6 months`;
      } else if (billingInterval === 'year') {
        finalPriceDisplay = `$${priceAmount} USD/year`;
      } else {
        finalPriceDisplay = `$${priceAmount} USD`;
      }
    }

    // Create new plan
    const newPlan = {
      planId,
      name,
      description: description || '',
      priceAmount,
      priceDisplay: finalPriceDisplay || `$${priceAmount} USD`,
      priceAccent: priceAccent || '#D4D737',
      billingNote: billingNote || null,
      billingInterval,
      stripePriceId: stripePriceId || '',
      isPopular: isPopular || false,
      isFree: isFree || false,
      isActive: isActive !== undefined ? isActive : true,
      features: features || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newPlan);

    return NextResponse.json(
      { 
        message: 'Plan created successfully',
        plan: { ...newPlan, _id: result.insertedId }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}

