import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { stripe } from '@/lib/stripe';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
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
    const userId = new ObjectId(decoded.userId);

    // Get user's subscription
    const subscription = await db.collection('subscriptions').findOne({
      userId: userId
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Get all invoices from Stripe for this subscription
    const invoices = await stripe.invoices.list({
      subscription: subscription.stripeSubscriptionId,
      limit: 100, // Get up to 100 invoices
    });

    // Get existing billing history records
    const existingBilling = await db.collection('billing_history').find({
      subscriptionId: subscription.stripeSubscriptionId
    }).toArray();

    const existingInvoiceIds = new Set(
      existingBilling.map((record: any) => record.invoiceId)
    );

    // Filter out invoices that already exist in billing history
    const newInvoices = invoices.data.filter(
      (invoice) => invoice.status === 'paid' && !existingInvoiceIds.has(invoice.id)
    );

    if (newInvoices.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Billing history is already up to date',
        synced: 0,
        total: invoices.data.length
      });
    }

    // Create billing history records for missing invoices
    const billingRecords = newInvoices.map((invoice) => ({
      userId: userId,
      subscriptionId: subscription.stripeSubscriptionId,
      invoiceId: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency || 'usd',
      status: 'paid',
      paidAt: new Date(invoice.created * 1000),
      invoiceUrl: invoice.hosted_invoice_url || null,
      createdAt: new Date()
    }));

    if (billingRecords.length > 0) {
      await db.collection('billing_history').insertMany(billingRecords);
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${billingRecords.length} billing record(s)`,
      synced: billingRecords.length,
      total: invoices.data.length
    });
  } catch (error) {
    console.error('Error syncing billing history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

