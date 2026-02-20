import Stripe from 'stripe';

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

// Stripe configuration for checkout sessions
export const STRIPE_CONFIG = {
  currency: 'usd',
  mode: 'payment' as const,
  successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?payment=cancelled`,
};

// Dynamic success URLs based on payment type
export function getSuccessUrl(type: 'booking' | 'bootcamp', sessionId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  if (type === 'bootcamp') {
    return `${baseUrl}/bootcamp-success?session_id=${sessionId}`;
  }
  return `${baseUrl}/booking-success?session_id=${sessionId}`;
}

export function getCancelUrl(type: 'booking' | 'bootcamp'): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  if (type === 'bootcamp') {
    return `${baseUrl}/bootcamp/crypto-trading/register?payment=cancelled`;
  }
  return `${baseUrl}/?payment=cancelled`;
}

// Helper function to create line items for different product types
export function createLineItem(
  name: string,
  description: string,
  amount: number, // Amount in cents
  quantity: number = 1
): Stripe.Checkout.SessionCreateParams.LineItem {
  return {
    price_data: {
      currency: STRIPE_CONFIG.currency,
      product_data: {
        name,
        description,
      },
      unit_amount: amount, // Stripe expects amount in cents
    },
    quantity,
  };
}

// Helper function to create checkout session metadata
export function createSessionMetadata(
  type: 'booking' | 'bootcamp',
  customerEmail: string,
  customerName?: string,
  meetingTypeId?: string,
  bootcampId?: string,
  notes?: string
): Record<string, string> {
  const metadata: Record<string, string> = {
    type,
    customerEmail,
  };

  if (customerName) metadata.customerName = customerName;
  if (meetingTypeId) metadata.meetingTypeId = meetingTypeId;
  if (bootcampId) metadata.bootcampId = bootcampId;
  if (notes) metadata.notes = notes;

  return metadata;
}

// Helper function to verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

// Types for our application
export interface BookingSessionData {
  type: 'booking';
  meetingTypeId: string;
  customerEmail: string;
  customerName?: string;
  amount: number; // in cents
  meetingName: string;
  meetingDescription: string;
}

export interface BootcampSessionData {
  type: 'bootcamp';
  bootcampId: string;
  customerEmail: string;
  customerName: string;
  amount: number; // in cents
  bootcampName: string;
  bootcampDescription: string;
  notes?: string;
}

export type SessionData = BookingSessionData | BootcampSessionData;
