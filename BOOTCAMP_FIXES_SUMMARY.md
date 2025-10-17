# Bootcamp Registration Fixes Summary

## Issues Fixed

### 1. ✅ Success Screen Not Showing Complete Data
**Problem:** The bootcamp success page was only showing data from URL query parameters, which weren't being passed from the Stripe checkout flow.

**Solution:** Updated `src/app/bootcamp-success/page.tsx` to:
- Read bootcamp details from `sessionStorage` (stored during registration)
- Display user's name, email, and notes from the stored data
- Fall back to URL parameters if sessionStorage is empty
- Show the product name from the payment details

**Files Modified:**
- `src/app/bootcamp-success/page.tsx`

**What Now Shows on Success Page:**
- Bootcamp name (from productName or bootcamp ID)
- User's full name
- User's email address
- Any notes they entered
- Mentors information
- Start date and time
- Duration and format tags

---

### 2. ✅ Production Domain Redirect Issues
**Problem:** The success and cancel URLs were not properly configured for production on Vercel (inspired-analyst.vercel.app).

**Solution:** Updated `src/app/api/stripe/create-checkout-session/route.ts` to:
- Created a `getBaseUrl()` helper function that:
  - First checks `NEXT_PUBLIC_BASE_URL` environment variable (preferred)
  - Falls back to `VERCEL_URL` for automatic Vercel deployments
  - Uses `http://localhost:3000` for local development
- Properly removes trailing slashes to prevent double-slash issues
- Applied this to both success_url and cancel_url

**Files Modified:**
- `src/app/api/stripe/create-checkout-session/route.ts`

**Environment Variable Required for Production:**
Set in your Vercel project settings:
```
NEXT_PUBLIC_BASE_URL=https://inspired-analyst.vercel.app
```

---

### 3. ✅ Multiple Duplicate Payments in Dashboard
**Problem:** When buying a single bootcamp, 4 different payment records were appearing in the dashboard.

**Root Cause:** Stripe sends multiple webhook events for a single successful payment:
- `checkout.session.completed`
- `payment_intent.created`
- `payment_intent.succeeded`
- `charge.succeeded`

If each event created a database record, you'd see 4 entries for 1 payment.

**Solution:** Updated `src/app/api/stripe/webhook/route.ts` to:
1. **Only process `checkout.session.completed` events** - This is the definitive event that payment succeeded
2. **Check for existing records before creating new ones** - Double protection against duplicates
3. **Properly save to database** - Store bootcamp registrations in `bootcamp_registrations` collection
4. **Log other events** - Still log other events for debugging but don't create records

**Files Modified:**
- `src/app/api/stripe/webhook/route.ts`

**Database Collections:**
- `bootcamp_registrations` - Stores bootcamp purchases
- `bookings` - Stores meeting bookings

---

## Deployment Instructions

### 1. Set Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

```env
NEXT_PUBLIC_BASE_URL=https://inspired-analyst.vercel.app
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 2. Configure Stripe Webhook

If you haven't already, set up a webhook endpoint in your Stripe Dashboard:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://inspired-analyst.vercel.app/api/stripe/webhook`
4. Events to listen to:
   - `checkout.session.completed` (required)
   - `payment_intent.succeeded` (optional, for logging)
   - `charge.succeeded` (optional, for logging)
5. Copy the webhook signing secret and add it as `STRIPE_WEBHOOK_SECRET` in Vercel

### 3. Deploy to Vercel

```bash
# Commit your changes
git add .
git commit -m "Fix bootcamp registration issues: success page data, production URLs, duplicate payments"

# Push to main branch (triggers automatic Vercel deployment)
git push origin main
```

### 4. Test the Flow

After deployment, test the complete flow:

1. **Register for Bootcamp:**
   - Go to https://inspired-analyst.vercel.app/bootcamp
   - Click "Register Now" on a bootcamp
   - Fill in your details
   - Complete payment

2. **Verify Success Page:**
   - Check that all your details appear (name, email, notes)
   - Verify bootcamp name is correct
   - Confirm no data is missing

3. **Check Database:**
   - Connect to MongoDB
   - Look at `bootcamp_registrations` collection
   - Verify only ONE record was created per payment
   - Confirm record has all fields: stripeSessionId, bootcampId, customerName, customerEmail, notes, amount, status

4. **Verify Webhook:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click on your webhook
   - Check recent events - you should see successful 200 responses
   - If you see errors, check Vercel logs for debugging

---

## Technical Details

### How Duplicate Prevention Works

The webhook now has two layers of protection:

1. **Event Type Filtering:**
   ```typescript
   if (event.type === 'checkout.session.completed') {
     // Only process this event type
   }
   ```

2. **Database Uniqueness Check:**
   ```typescript
   const existingRegistration = await db.collection('bootcamp_registrations').findOne({
     stripeSessionId: session.id
   });
   
   if (existingRegistration) {
     console.log('Registration already exists, skipping duplicate');
     return;
   }
   ```

### Database Schema

**bootcamp_registrations collection:**
```javascript
{
  stripeSessionId: "cs_test_...",    // Unique Stripe session ID
  bootcampId: "crypto-trading",       // Which bootcamp
  customerName: "John Doe",           // User's name
  customerEmail: "john@example.com",  // User's email
  notes: "Looking forward to learning", // Optional notes
  amount: 30,                         // Payment amount in dollars
  currency: "usd",                    // Currency
  paymentStatus: "paid",              // Payment status
  status: "confirmed",                // Registration status
  createdAt: ISODate("..."),          // When registered
  updatedAt: ISODate("...")           // Last updated
}
```

---

## Troubleshooting

### Issue: Success page still shows "Unknown Bootcamp"
**Solution:** Clear your browser's sessionStorage:
1. Open DevTools (F12)
2. Go to Application → Storage → Session Storage
3. Clear all data
4. Try the registration flow again

### Issue: Duplicate payments still appearing
**Solution:**
1. Check MongoDB directly - count records with same email:
   ```javascript
   db.bootcamp_registrations.countDocuments({ customerEmail: "user@example.com" })
   ```
2. If duplicates exist, they were created before the fix
3. Clean up old duplicates:
   ```javascript
   // Keep only the first registration per session
   db.bootcamp_registrations.aggregate([
     { $group: { _id: "$stripeSessionId", count: { $sum: 1 }, docs: { $push: "$$ROOT" } } },
     { $match: { count: { $gt: 1 } } }
   ])
   ```

### Issue: Webhook not receiving events
**Solution:**
1. Check Stripe webhook settings:
   - URL must be: `https://inspired-analyst.vercel.app/api/stripe/webhook`
   - Must use HTTPS (not HTTP)
   - Webhook secret must match `STRIPE_WEBHOOK_SECRET` env var
2. Check Vercel logs for errors:
   ```bash
   vercel logs
   ```
3. Test webhook with Stripe CLI:
   ```bash
   stripe listen --forward-to https://inspired-analyst.vercel.app/api/stripe/webhook
   stripe trigger checkout.session.completed
   ```

---

## Migration Notes

If you have existing duplicate records in your database from before this fix:

### Clean Up Existing Duplicates

```javascript
// Connect to MongoDB
use inspired-analyst

// Find all bootcamp registrations with same email and bootcampId
db.bootcamp_registrations.aggregate([
  {
    $group: {
      _id: { email: "$customerEmail", bootcamp: "$bootcampId" },
      count: { $sum: 1 },
      docs: { $push: "$$ROOT" }
    }
  },
  {
    $match: { count: { $gt: 1 } }
  }
]).forEach(function(group) {
  // Keep the first document, delete the rest
  var docsToDelete = group.docs.slice(1);
  docsToDelete.forEach(function(doc) {
    print("Deleting duplicate: " + doc._id);
    db.bootcamp_registrations.deleteOne({ _id: doc._id });
  });
});
```

**⚠️ Warning:** Always backup your database before running cleanup scripts!

---

## Summary

All three issues have been fixed:
1. ✅ Success page now displays complete user data
2. ✅ Production URLs properly redirect to inspired-analyst.vercel.app
3. ✅ Duplicate payments prevented with event filtering and uniqueness checks

The system now properly handles the complete flow from registration → payment → success page → database storage, with no duplicates and all data preserved.

