import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('user-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    
    // Fetch billing history for the user
    const invoices = await db.collection('billing_history').find({
      userId: new ObjectId(decoded.userId)
    }).sort({ paidAt: -1, createdAt: -1 }).toArray();

    // Format invoices for response
    const formattedInvoices = invoices.map((invoice: any) => ({
      id: invoice._id.toString(),
      invoiceId: invoice.invoiceId || `INV-${invoice._id.toString().slice(-6).toUpperCase()}`,
      amount: invoice.amount,
      currency: invoice.currency || 'bnb',
      status: invoice.status || 'paid',
      paidAt: invoice.paidAt || invoice.createdAt,
      invoiceUrl: invoice.invoiceUrl || null,
    }));

    return NextResponse.json({
      invoices: formattedInvoices
    });
  } catch (error) {
    console.error('Error fetching billing history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

