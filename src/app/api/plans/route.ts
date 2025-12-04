import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection('plans');

    // Fetch only active plans, sorted by planId
    const plans = await collection
      .find({ isActive: true })
      .sort({ planId: 1 })
      .toArray();

    // Transform to match frontend expectations
    const formattedPlans = plans.map((plan) => ({
      id: plan.planId,
      name: plan.name,
      description: plan.description,
      price: plan.priceDisplay,
      priceAmount: plan.priceAmount,
      priceAccent: plan.priceAccent,
      billingNote: plan.billingNote || undefined,
      isPopular: Boolean(plan.isPopular),
      isFree: Boolean(plan.isFree), // Ensure it's a proper boolean
      features: plan.features || [],
      interval: plan.billingInterval,
    }));

    return NextResponse.json(
      { plans: formattedPlans },
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

