# Calendly Booking Flow After Stripe Payment

## Overviews s
This document describes the complete booking flow from payment to final confirmation with Calendly integration. The Calendly popup automatically opens on the success page after payment.

## Complete User Journey

### Step 1: User Completes Booking Form
**File:** `src/components/pages/MeetingsPage.tsx`

1. User selects analyst, meeting type, timezone, date, and time
2. User fills in personal information (name, email, notes)
3. User clicks "Continue" to proceed to payment

### Step 2: Payment Processing
**File:** `src/components/pages/MeetingsPage.tsx` (handleContinue function)

**What Happens:**
1. System retrieves the Calendly scheduling URL for the selected time slot
2. All booking details are stored in `sessionStorage`:
   - Analyst information (ID, name)
   - Meeting details (ID, title, duration)
   - Date and time information
   - User details (name, email, notes)
   - Payment session ID
   - **Calendly scheduling URL**
   - Flag indicating if analyst has Calendly integration

3. Stripe checkout session is created via API
4. User is redirected to Stripe payment page

**Code Location:** Lines 1140-1236

### Step 3: Stripe Payment Success → Booking Success Page
**File:** `src/app/api/stripe/create-checkout-session/route.ts`

**Success URL Configuration:**
```typescript
success_url: `${BASE_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`
```

After successful payment, user is redirected directly to the booking success page.

**Code Location:** Line 144

### Step 4: Booking Success Page with Auto-Popup
**File:** `src/app/booking-success/page.tsx`

**What Happens Automatically:**
1. Page loads and displays booking success message
2. Retrieves booking details from `sessionStorage`
3. Displays booking summary card
4. If analyst has Calendly integration:
   - Loads Calendly widget script automatically
   - Opens Calendly popup **automatically** after 800ms delay
   - Success page is visible behind the popup

**User Action Required:**
- Click one button in the Calendly popup to confirm the time slot

**What Happens When User Confirms:**
1. Calendly records the booking confirmation
2. System listens for `calendly.event_scheduled` event
3. Calendly event details are saved to sessionStorage
4. **Popup closes automatically**
5. Success page remains visible with full booking details

**No Redirect:** User stays on the same page - the popup just disappears!

**Code Locations:**
- Auto-load Calendly script: Lines 78-100
- Auto-open popup: Lines 102-112
- Calendly widget initialization: Lines 114-173
- Event listener: Lines 144-167

## Alternative Flow: No Calendly Integration

If the selected analyst doesn't have Calendly integration:

1. After Stripe payment success → Redirect to booking-success page
2. Page shows booking confirmation
3. No Calendly popup opens
4. User sees success page immediately

**Code Location:** `src/app/booking-success/page.tsx`, Lines 55-57

## Session Storage Data Structure

```typescript
{
  analyst: string;              // Analyst ID
  analystName: string;          // Analyst name
  meeting: string;              // Meeting type ID
  meetingTitle: string;         // Meeting title
  meetingDuration: string;      // Duration (e.g., "30 minutes")
  date: string;                 // Date in YYYY-MM-DD format
  time: string;                 // Time in local format (e.g., "2:00 PM")
  timezone: string;             // Timezone label
  timezoneValue: string;        // Timezone value
  notes: string;                // User notes
  fullName: string;             // User's full name
  email: string;                // User's email
  sessionId: string;            // Stripe session ID
  productName: string;          // Product name
  amount: number;               // Amount in cents
  calendlyUrl: string;          // Calendly scheduling URL
  hasCalendlyIntegration: boolean;  // Calendly integration flag
  calendlyEventUri?: string;    // Calendly event URI (after booking)
  calendlyInviteeUri?: string;  // Calendly invitee URI (after booking)
  bookingConfirmed?: boolean;   // Booking confirmation flag
}
```

## Files Modified

1. **`src/components/pages/MeetingsPage.tsx`**
   - Enhanced booking details stored in sessionStorage
   - Added Calendly URL retrieval from selected time slot
   - Lines 1140-1236

2. **`src/app/api/stripe/create-checkout-session/route.ts`**
   - Updated success_url to redirect to booking-success page
   - Updated cancel_url to redirect to meetings page
   - Line 144

3. **`src/app/booking-success/page.tsx`**
   - Added automatic Calendly script loading
   - Added automatic Calendly popup opening
   - Enhanced to use sessionStorage instead of URL params
   - Calendly event listener for booking confirmation
   - Lines 44-173

## URL Flow

```
1. /meetings (Booking form)
   ↓ (User completes form and clicks Continue)
   
2. Stripe Checkout (External)
   ↓ (Payment successful)
   
3. /booking-success?session_id=XXX
   ↓ (Page loads, Calendly popup auto-opens)
   
4. Calendly Widget (Popup - overlays the page)
   ↓ (User clicks one button to confirm)
   
5. Popup closes → Success page visible
   (User stays on /booking-success)
```

## Error Handling

### Payment Cancelled
- User redirected to: `/meetings?payment=cancelled`
- User can restart booking process

### Missing Booking Details
- If sessionStorage is empty, page falls back to URL parameters
- If both are missing, shows booking card with "Unknown" values
- Google Calendar and Outlook Calendar buttons still functional

### Calendly Script Load Failure
- Page logs error to console
- Success page still displays correctly
- User can manually add to calendar using provided buttons

## Testing Checklist

- [ ] Book meeting with analyst that has Calendly integration
- [ ] Verify Calendly URL is stored in sessionStorage
- [ ] Complete Stripe payment
- [ ] Verify redirect to booking-success page
- [ ] Verify success page loads with booking details
- [ ] **Verify Calendly popup opens automatically after ~800ms**
- [ ] Complete Calendly booking (click confirm button in popup)
- [ ] Verify popup closes automatically
- [ ] Verify success page remains visible with all details
- [ ] Verify Calendly event details saved to sessionStorage
- [ ] Test with analyst without Calendly integration (no popup should open)
- [ ] Test payment cancellation flow
- [ ] Test with missing sessionStorage (should fall back to URL params)
- [ ] Test Google Calendar and Outlook Calendar buttons

## Notes

1. **Calendly Widget Script**: Loaded dynamically on booking-success page (only if analyst has Calendly integration)
2. **Auto-Open Timing**: Popup opens 800ms after script loads to ensure page is ready
3. **Event Listening**: Page listens for `calendly.event_scheduled` event to know when booking is confirmed
4. **Session Storage**: Used to persist booking data from payment to success page
5. **UTM Tracking**: Added to Calendly links for analytics (source: inspired-analyst, medium: booking, campaign: mentorship)
6. **Pre-fill**: User information (name, email, notes) automatically filled in Calendly widget
7. **No Page Redirect**: Success page stays visible behind popup, then popup closes on confirmation
8. **Fallback Support**: If sessionStorage fails, page falls back to URL parameters for backward compatibility

## Support

For issues or questions:
- Check browser console for error messages
- Verify sessionStorage contains booking details
- Ensure Calendly URL is valid for selected time slot
- Contact support@inspiredanalyst.com

