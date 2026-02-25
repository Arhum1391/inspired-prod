# Stripe Payment Implementation

## Overview

This document provides a comprehensive guide to the Stripe payment integration implemented in the Inspired Analyst platform. The implementation supports three main payment types:

1. **Subscription Payments** - Monthly and Annual premium subscriptions
2. **One-time Booking Payments** - Payment for consultation meetings
3. **Bootcamp Registration Payments** - Payment for bootcamp enrollments

## Architecture

### Technology Stack

- **Payment Provider**: Stripe (v19.1.0)
- **Framework**: Next.js 15.5.3 (App Router)
- **Database**: MongoDB
- **API Version**: Stripe API 2024-12-18.acacia

### Core Components

```
src/
├── lib/
│   └── stripe.ts                    # Stripe initialization and utilities
├── app/
│   ├── api/
│   │   └── stripe/
│   │       ├── create-checkout-session/route.ts      # One-time payments
│   │       ├── create-subscription-session/route.ts  # Subscription payments
│   │       └── webhook/route.ts                      # Webhook handler
│   ├── checkout/page.tsx            # Subscription checkout UI
│   └── success/page.tsx             # Payment success page
└── components/
    └── pages/
        ├── MeetingsPage.tsx         # Booking payment integration
        └── BookPage.tsx             # Alternative booking page
```

## Payment Types

### 1. Subscription Payments

**Purpose**: Premium monthly/annual subscriptions

**API Endpoint**: `/api/stripe/create-subscription-session`

**Features**:
- Monthly plan: $30 USD (30 BNB equivalent)
- Annual plan: $120 USD (120 BNB equivalent)
- Automatic renewal
- User authentication after payment
- Payment method storage

**Configuration**:
```typescript
const planConfig = {
  monthly: {
    amount: 30,
    currency: 'usd',
    name: 'Premium Monthly',
    interval: 'month'
  },
  annual: {
    amount: 120,
    currency: 'usd',
    name: 'Premium Annual',
    interval: 'year'
  }
};
```

**Flow**:
1. User selects plan on pricing page
2. Redirects to `/checkout` page
3. User clicks "Pay & Start Premium"
4. Creates Stripe checkout session
5. Redirects to Stripe hosted checkout
6. On success → `/success?session_id={CHECKOUT_SESSION_ID}`
7. Webhook processes subscription creation
8. User authenticated automatically

### 2. Booking Payments

**Purpose**: One-time payment for consultation meetings

**API Endpoint**: `/api/stripe/create-checkout-session` (type: 'booking')

**Meeting Types**:
- Initial Consultation (30 min) - $50 USD
- Extended Initial Consultation (45 min) - $75 USD
- Strategy Workshop (90 min) - $150 USD
- Follow-up Session (45 min) - $75 USD

**Test Mode**: All prices reduced to $1 USD in development

**Flow**:
1. User selects meeting type, analyst, date/time
2. Fills in personal information (name, email, notes)
3. Clicks payment button
4. Creates Stripe checkout session with meeting details
5. Redirects to Stripe checkout
6. On success → `/meetings?payment=success&session_id={CHECKOUT_SESSION_ID}`
7. Webhook creates booking record in database
8. Calendly popup opens for scheduling (if integrated)

**Metadata Stored**:
```typescript
{
  type: 'booking',
  meetingTypeId: string,
  customerEmail: string,
  customerName: string
}
```

### 3. Bootcamp Registration Payments

**Purpose**: One-time payment for bootcamp enrollment

**API Endpoint**: `/api/stripe/create-checkout-session` (type: 'bootcamp')

**Features**:
- Dynamic pricing from database
- Bootcamp-specific registration
- Notes/requirements field
- Registration confirmation

**Flow**:
1. User views bootcamp details
2. Clicks "Register" button
3. Fills registration form (name, email, notes)
4. Creates Stripe checkout session
5. Redirects to Stripe checkout
6. On success → `/bootcamp/{id}/register?payment=success&session_id={CHECKOUT_SESSION_ID}`
7. Webhook creates bootcamp registration record

**Metadata Stored**:
```typescript
{
  type: 'bootcamp',
  bootcampId: string,
  customerEmail: string,
  customerName: string,
  notes: string
}
```

## API Routes

### Create Checkout Session (One-time Payments)

**Endpoint**: `POST /api/stripe/create-checkout-session`

**Request Body**:
```typescript
// For bookings
{
  type: 'booking',
  meetingTypeId: string,
  customerEmail: string,
  customerName?: string,
  priceAmount?: number  // Optional override
}

// For bootcamps
{
  type: 'bootcamp',
  bootcampId: string,
  customerEmail: string,
  customerName: string,
  notes?: string
}
```

**Response**:
```typescript
{
  success: true,
  sessionId: string,
  url: string,  // Stripe checkout URL
  amount: number,  // in cents
  currency: 'USD',
  productName: string,
  expiresAt: string
}
```

### Create Subscription Session

**Endpoint**: `POST /api/stripe/create-subscription-session`

**Request Body**:
```typescript
{
  plan: 'monthly' | 'annual',
  customerEmail: string,
  customerName?: string
}
```

**Response**:
```typescript
{
  success: true,
  url: string,  // Stripe checkout URL
  sessionId: string
}
```

### Webhook Handler

**Endpoint**: `POST /api/stripe/webhook`

**Handled Events**:
1. `checkout.session.completed` - Payment completed
   - Creates subscription records
   - Creates booking records
   - Creates bootcamp registration records
   - Saves payment methods
   - Creates billing history

2. `customer.subscription.updated` - Subscription status changes
   - Updates subscription status in database
   - Updates billing period dates

3. `customer.subscription.deleted` - Subscription cancelled
   - Marks subscription as cancelled
   - Deletes all user data (subscriptions, payment methods, billing history, bookings, bootcamp registrations, user account)

4. `invoice.payment_succeeded` - Subscription renewal
   - Creates billing history records
   - Updates subscription status

**Security**:
- Webhook signature verification using `STRIPE_WEBHOOK_SECRET`
- Prevents duplicate processing with database checks
- Async processing to prevent timeouts

## Database Schema

### Subscriptions Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  stripeSubscriptionId: string,
  stripeCustomerId: string,
  planName: string,
  planType: 'monthly' | 'annual',
  price: string,
  status: string,  // active, canceled, past_due, etc.
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection

```typescript
{
  _id: ObjectId,
  stripeSessionId: string,
  meetingTypeId: string,
  customerName: string,
  customerEmail: string,
  amount: number,  // in USD
  currency: string,
  paymentStatus: 'paid' | 'pending' | 'failed',
  status: 'confirmed' | 'cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

### Bootcamp Registrations Collection

```typescript
{
  _id: ObjectId,
  stripeSessionId: string,
  bootcampId: string,
  customerName: string,
  customerEmail: string,
  notes: string,
  amount: number,  // in USD
  currency: string,
  paymentStatus: 'paid' | 'pending' | 'failed',
  status: 'confirmed' | 'cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Methods Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  stripePaymentMethodId: string,
  stripeCustomerId: string,
  last4: string,
  brand: string,  // visa, mastercard, etc.
  expMonth: number,
  expYear: number,
  isDefault: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Billing History Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  subscriptionId: string,
  invoiceId: string,
  amount: number,
  currency: string,
  status: 'paid' | 'pending' | 'failed',
  paidAt: Date,
  invoiceUrl?: string,
  createdAt: Date
}
```

## Environment Variables

Required environment variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...  # or sk_test_... for development
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook signing secret

# Optional: Price IDs for subscriptions (if using Stripe Price objects)
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_ANNUAL=price_...

# Application URLs
NEXT_PUBLIC_BASE_URL=https://inspired-analyst.vercel.app
# or http://localhost:3000 for local development

# Test Mode (optional)
STRIPE_TEST_MODE=true  # Enables $1 test pricing

# Database
MONGODB_URI=mongodb://...
```

## Security Features

### 1. Webhook Signature Verification

All webhook requests are verified using Stripe's signature verification:

```typescript
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
```

### 2. Session Expiration

Checkout sessions expire after 30 minutes:

```typescript
expires_at: Math.floor(Date.now() / 1000) + (30 * 60)
```

### 3. Duplicate Prevention

Webhook handler checks for existing records before creating new ones:

```typescript
const existingRegistration = await db.collection('bootcamp_registrations').findOne({
  stripeSessionId: session.id
});
```

### 4. Input Validation

Using Joi schemas for request validation:

```typescript
const bookingSchema = Joi.object({
  type: Joi.string().valid('booking').required(),
  meetingTypeId: Joi.string().required(),
  customerEmail: Joi.string().email().required(),
  customerName: Joi.string().optional()
});
```

### 5. Payment Session Verification

Payment success pages verify sessions before authentication:

```typescript
session = await stripe.checkout.sessions.retrieve(sessionId);
if (session.payment_status !== 'paid' && session.status !== 'complete') {
  // Reject authentication
}
```

## Frontend Integration

### Subscription Checkout

**File**: `src/app/checkout/page.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  const response = await fetch('/api/stripe/create-subscription-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan: plan,
      customerEmail: customerEmail,
      customerName: customerName
    })
  });
  
  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;  // Redirect to Stripe
  }
};
```

### Booking Payment

**File**: `src/components/pages/MeetingsPage.tsx`

```typescript
const handleStripePayment = async () => {
  // Save form data to sessionStorage
  sessionStorage.setItem('bookingDetails', JSON.stringify(formData));
  
  // Create checkout session
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({
      type: 'booking',
      meetingTypeId: selectedMeetingType.id,
      customerEmail: email,
      customerName: fullName,
      priceAmount: priceAmount
    })
  });
  
  const data = await response.json();
  window.location.href = data.url;  // Redirect to Stripe
};
```

### Bootcamp Registration

**File**: `src/app/bootcamp/[id]/register/page.tsx`

```typescript
const handleStripePayment = async () => {
  // Save form data
  sessionStorage.setItem(`bootcamp-form-${bootcampId}`, JSON.stringify(formData));
  
  // Create checkout session
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({
      type: 'bootcamp',
      bootcampId: bootcampId,
      customerEmail: email,
      customerName: fullName,
      notes: notes
    })
  });
  
  const data = await response.json();
  window.location.href = data.url;  // Redirect to Stripe
};
```

## Success & Error Handling

### Success Pages

1. **Subscription Success**: `/success?session_id={CHECKOUT_SESSION_ID}`
   - Verifies payment session
   - Authenticates user automatically
   - Displays success message
   - Redirects to account dashboard

2. **Booking Success**: `/meetings?payment=success&session_id={CHECKOUT_SESSION_ID}`
   - Displays booking confirmation
   - Opens Calendly popup (if integrated)
   - Shows booking details

3. **Bootcamp Success**: `/bootcamp/{id}/register?payment=success&session_id={CHECKOUT_SESSION_ID}`
   - Displays registration confirmation
   - Shows bootcamp details

### Cancel Pages

- Subscription: `/pricing`
- Booking: `/meetings?payment=cancelled`
- Bootcamp: `/bootcamp/{id}/register?payment=cancelled`

## Testing

### Test Mode

Set `STRIPE_TEST_MODE=true` or `NODE_ENV=development` to enable test pricing:
- All meeting types: $1 USD
- Bootcamp registrations: $1 USD (fallback if no price set)

### Stripe Test Cards

Use Stripe's test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Webhook Testing

1. Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

2. Trigger test events:
```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

## Deployment

### Production Checklist

1. **Environment Variables**:
   - Set `STRIPE_SECRET_KEY` to live key (starts with `sk_live_`)
   - Set `STRIPE_WEBHOOK_SECRET` from Stripe Dashboard
   - Set `NEXT_PUBLIC_BASE_URL` to production URL
   - Remove or set `STRIPE_TEST_MODE=false`

2. **Webhook Configuration**:
   - Add webhook endpoint in Stripe Dashboard: `https://yourdomain.com/api/stripe/webhook`
   - Select events to listen to:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

3. **Database**:
   - Ensure MongoDB connection string is set
   - Verify collections exist (created automatically on first use)

4. **Pricing**:
   - Update meeting type prices in `create-checkout-session/route.ts`
   - Update subscription prices in `create-subscription-session/route.ts`
   - Ensure bootcamp prices are set in database

## Error Handling

### Common Errors

1. **Invalid Amount**: Amount must be > 0
   - Check price configuration
   - Verify bootcamp price in database

2. **Missing Webhook Secret**: Webhook signature verification fails
   - Ensure `STRIPE_WEBHOOK_SECRET` is set
   - Verify webhook endpoint URL in Stripe Dashboard

3. **Duplicate Processing**: Webhook processes same event twice
   - Already handled with database checks
   - Logs warning and skips duplicate

4. **Session Expired**: Checkout session expired
   - Sessions expire after 30 minutes
   - User must create new session

## Monitoring & Logging

### Key Log Points

1. **Checkout Session Creation**:
   ```typescript
   console.log('Stripe session created successfully:', session.id);
   ```

2. **Webhook Events**:
   ```typescript
   console.log(`✅ Received webhook event: ${event.type}`);
   ```

3. **Database Operations**:
   ```typescript
   console.log(`✅ Subscription created for user ${userId}`);
   console.log(`✅ Booking saved for ${customerEmail}`);
   ```

4. **Errors**:
   ```typescript
   console.error('Stripe API error:', error);
   console.error('Database error in webhook:', dbError);
   ```

## Best Practices

1. **Always verify webhook signatures** - Never trust unverified webhooks
2. **Handle idempotency** - Check for existing records before creating
3. **Use async processing** - Process webhooks asynchronously to prevent timeouts
4. **Store metadata** - Include all necessary data in checkout session metadata
5. **Validate input** - Always validate request data before processing
6. **Error recovery** - Log errors but continue processing when possible
7. **Test thoroughly** - Use Stripe test mode and test cards before going live

## Support & Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe API Reference**: https://stripe.com/docs/api
- **Stripe Webhooks Guide**: https://stripe.com/docs/webhooks
- **Stripe Testing**: https://stripe.com/docs/testing

## Version History

- **v1.0** - Initial implementation
  - Subscription payments
  - Booking payments
  - Bootcamp registration payments
  - Webhook handling
  - Payment method storage
  - Billing history

---

**Last Updated**: December 2024
**Maintained By**: Inspired Analyst Development Team

