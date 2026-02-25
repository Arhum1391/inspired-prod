# Calendly Booking Flow Documentation

## 🎯 How the Booking Process Works

### For Assassin (Calendly Integration)

When a user books a session with Assassin:

1. **User selects**:
   - Meeting type (fetched from Calendly)
   - Date (only available dates shown)
   - Time slot (only available times shown)
   - Fills in name, email, and notes

2. **Clicks "Proceed to Pay"**:
   - System creates a **single-use Calendly scheduling link**
   - Pre-fills user's information (name, email, notes)
   - Redirects user to Calendly's booking page

3. **User completes booking on Calendly**:
   - Confirms the selected time
   - Completes any additional Calendly forms
   - Receives Calendly's confirmation email
   - Event appears in your Calendly calendar ✅

### For Other Analysts

When a user books with other analysts:
- Uses the existing booking flow
- Redirects to booking success page
- No Calendly integration (uses default times)

## 📝 Why This Approach?

Calendly's API doesn't allow direct creation of booked events. Instead, it provides:

### ✅ What We CAN Do
- **Fetch availability**: Get real-time available slots
- **Create scheduling links**: Generate pre-filled booking URLs
- **Receive webhooks**: Get notified when bookings are made

### ❌ What We CANNOT Do
- **Directly create bookings**: Can't bypass Calendly's booking UI entirely
- **Force book a slot**: Security/anti-spam measure by Calendly

## 🔧 Technical Implementation

### API Endpoint: `/api/calendly/create-booking`

**Purpose**: Creates a single-use Calendly scheduling link

**Request**:
```json
{
  "eventTypeUri": "https://api.calendly.com/event_types/...",
  "name": "John Doe",
  "email": "john@example.com",
  "startTime": "2025-10-15T09:00:00Z",
  "notes": "Looking for help with trading strategies"
}
```

**Response**:
```json
{
  "success": true,
  "bookingUrl": "https://calendly.com/...",
  "message": "Scheduling link created successfully"
}
```

### User Flow in MeetingsPage

```typescript
// Step 3: When user clicks "Proceed to Pay"
handleContinue() {
  if (selectedAnalyst === Assassin) {
    // 1. Create Calendly scheduling link
    const response = await fetch('/api/calendly/create-booking', {...});
    
    // 2. Redirect to Calendly
    window.location.href = data.bookingUrl;
  }
}
```

## 📊 Booking Lifecycle

```
1. User selects time on your site
   ↓
2. System creates single-use Calendly link (API call)
   ↓
3. User redirected to Calendly booking page
   ↓
4. User confirms on Calendly (sees familiar Calendly UI)
   ↓
5. Calendly sends confirmation email
   ↓
6. Event appears in your Calendly calendar ✅
   ↓
7. (Optional) Calendly webhook notifies your system
```

## 🎨 User Experience

### What Users See

1. **On Your Site**:
   - Beautiful, branded meeting selection
   - Real Calendly availability
   - Custom form fields

2. **On Calendly**:
   - Familiar Calendly booking page
   - Information pre-filled
   - Professional confirmation flow
   - Automated reminders

### Benefits

✅ **For Users**:
- Trust: Calendly's familiar booking experience
- Reliability: Automated confirmations and reminders
- Flexibility: Can reschedule via Calendly

✅ **For You**:
- Real-time availability
- No double bookings
- Integrated calendar management
- Payment collection (if configured in Calendly)

## 🔄 Optional: Webhook Integration

To get notified when bookings are completed, you can set up Calendly webhooks:

### Step 1: Create Webhook Endpoint
```typescript
// /api/calendly/webhook
export async function POST(request) {
  const signature = request.headers.get('Calendly-Webhook-Signature');
  
  // Verify signature
  // Handle event
  // Update your database
}
```

### Step 2: Configure in Calendly
1. Go to Calendly → Integrations → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/calendly/webhook`
3. Subscribe to events: `invitee.created`, `invitee.canceled`

### Step 3: Handle Events
```typescript
{
  "event": "invitee.created",
  "payload": {
    "name": "John Doe",
    "email": "john@example.com",
    "event": {...},
    "questions_and_answers": [...]
  }
}
```

## 🚀 Future Enhancements

### Phase 1 (Current)
- ✅ Fetch availability from Calendly
- ✅ Display available slots
- ✅ Create scheduling links
- ✅ Redirect to Calendly

### Phase 2 (Future)
- [ ] Webhook integration for booking confirmation
- [ ] Store bookings in database
- [ ] Custom confirmation emails
- [ ] Payment integration before Calendly redirect

### Phase 3 (Advanced)
- [ ] Embedded Calendly widget (inline booking)
- [ ] Custom booking confirmation page
- [ ] Analytics dashboard
- [ ] Automated follow-ups

## 🛠️ Troubleshooting

### "Booking not showing in Calendly"

**Possible Causes**:
1. User didn't complete the Calendly booking page
2. User closed the window before confirming
3. Network error during redirect

**Solution**: 
- Add loading state during redirect
- Save booking attempt in database
- Follow up with incomplete bookings

### "Pre-filled information not showing"

**Check**:
1. URL parameters are correctly formatted
2. Calendly custom questions match field names
3. Special characters are URL encoded

### "Scheduling link expires"

**Note**: Single-use links expire after:
- One successful booking
- 24 hours (default)

**Solution**: Generate new link for each booking attempt

## 📚 Resources

- [Calendly API Docs](https://developer.calendly.com/)
- [Scheduling Links API](https://developer.calendly.com/api-docs/d4dc96f07cdcd-create-single-use-scheduling-link)
- [Webhooks Guide](https://developer.calendly.com/api-docs/ZG9jOjM2MzE2MDM0-webhook-subscriptions)
- [Event Types API](https://developer.calendly.com/api-docs/e8de9e82c52c8-list-event-types)

---

**Last Updated**: October 9, 2025  
**Integration Status**: ✅ Active

