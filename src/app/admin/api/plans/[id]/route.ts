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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params first to ensure it's resolved
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const db = await getDatabase();
    const collection = db.collection('plans');

    // Try to find by MongoDB _id first, then by planId
    let plan;
    if (ObjectId.isValid(id)) {
      plan = await collection.findOne({ _id: new ObjectId(id) });
    }
    
    if (!plan) {
      plan = await collection.findOne({ planId: id });
    }

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Ensure boolean values are properly set
    const normalizedPlan = {
      ...plan,
      isFree: Boolean(plan.isFree),
      isActive: plan.isActive !== false,
      isPopular: Boolean(plan.isPopular),
    };

    return NextResponse.json(
      { plan: normalizedPlan },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PUT /admin/api/plans/[id] - Route handler called');
    
    // Await params first to ensure it's resolved
    let id: string;
    try {
      const resolvedParams = await params;
      id = resolvedParams.id;
      console.log('Resolved plan ID:', id);
    } catch (paramsError) {
      console.error('Error resolving params:', paramsError);
      return NextResponse.json(
        { error: 'Invalid route parameters' },
        { status: 400 }
      );
    }
    
    if (!id) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    
    const body = await request.json();
    console.log('Request body:', body);
    const { name, features, isFree, isActive } = body;

    const db = await getDatabase();
    const collection = db.collection('plans');

    // Find plan by MongoDB _id or planId
    let plan;
    if (ObjectId.isValid(id)) {
      plan = await collection.findOne({ _id: new ObjectId(id) });
    }
    
    if (!plan) {
      plan = await collection.findOne({ planId: id });
    }

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Only allow editing: name, features, isFree, isActive
    // Prices and other fields are read-only
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      if (!name || name.trim() === '') {
        return NextResponse.json(
          { error: 'Name cannot be empty' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (features !== undefined) {
      if (!Array.isArray(features)) {
        return NextResponse.json(
          { error: 'Features must be an array' },
          { status: 400 }
        );
      }
      updateData.features = features;
    }

    if (isFree !== undefined) {
      updateData.isFree = Boolean(isFree);
    }

    if (isActive !== undefined) {
      // Validate at least one plan must be active
      if (!isActive) {
        const activePlans = await collection.countDocuments({ 
          isActive: true,
          _id: { $ne: plan._id }
        });
        
        if (activePlans === 0) {
          return NextResponse.json(
            { error: 'At least one plan must be active' },
            { status: 400 }
          );
        }
      }
      updateData.isActive = Boolean(isActive);
    }

    // Update plan
    const result = await collection.updateOne(
      { _id: plan._id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Fetch updated plan
    const updatedPlan = await collection.findOne({ _id: plan._id });

    // Ensure boolean values are properly set
    const normalizedPlan = updatedPlan ? {
      ...updatedPlan,
      isFree: Boolean(updatedPlan.isFree),
      isActive: updatedPlan.isActive !== false,
      isPopular: Boolean(updatedPlan.isPopular),
    } : null;

    return NextResponse.json(
      { 
        message: 'Plan updated successfully',
        plan: normalizedPlan
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating plan:', error);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { error: error?.message || 'Failed to update plan' },
      { status: 500 }
    );
  }
}

