# Calendly Integration Setup Guide

This document explains the Calendly API integration implemented in the Inspired Analyst booking system. The integration allows Assassin's calendar to dynamically fetch meeting types, available dates, and time slots from Calendly.

## 📋 Overview

The Calendly integration has been implemented with the following features:
- **Dynamic Event Types**: Automatically fetch meeting types from Calendly for Assassin
- **Real-time Availability**: Display only available dates and time slots from Calendly
- **Seamless Fallback**: Other analysts continue to use the default hardcoded meeting options

## 🔧 Setup Instructions

### Step 1: Get Your Calendly Access Token

1. Log in to your Calendly account at https://calendly.com
2. Go to **Integrations** > **API & Webhooks**
3. Click on **Get a Personal Access Token**
4. Copy the generated token (it will only be shown once)

### Step 2: Get Your User URI

You need to retrieve your Calendly User URI to use the API. You have two options:

#### Option A: Use the Helper API Endpoint (Easiest)
1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/api/calendly/user-info`
3. Copy the `uri` value from the JSON response
4. It will look like: `https://api.calendly.com/users/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`

#### Option B: Use Calendly API Explorer
1. Visit https://developer.calendly.com/api-docs/ZG9jOjM2MzE2MDM4-get-current-user
2. Test the `/users/me` endpoint with your access token
3. Copy the `uri` from the response

### Step 3: Configure Environment Variables

Create or update your `.env.local` file in the root directory with the following:

```bash
# Calendly API Credentials
CALENDLY_ACCESS_TOKEN=your_personal_access_token_here
CALENDLY_API_BASE_URL=https://api.calendly.com

# Calendly User URIs for each analyst
# Replace with the actual User URI you got from Step 2
CALENDLY_ASSASSIN_USER_URI=https://api.calendly.com/users/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

**⚠️ Important Security Notes:**
- Never commit `.env.local` to version control
- Keep your access token secure
- The `.env.local` file is already in `.gitignore`

### Step 4: Set Up Calendly Event Types

For the integration to work properly, make sure you have event types created in your Calendly account:

1. Go to your Calendly dashboard
2. Navigate to **Event Types**
3. Create or edit your meeting types (e.g., "30-Min Strategy", "60-Min Deep Dive")
4. Make sure they are **Active**
5. Configure availability, duration, and other settings as needed

## 📁 Integration Architecture

### API Routes Created

#### 1. `/api/calendly/event-types`
**Purpose**: Fetches all active event types for a Calendly user

**Query Parameters:**
- `userUri` (optional): Defaults to Assassin's URI from env variables

**Response:**
```json
{
  "success": true,
  "eventTypes": [
    {
      "id": "https://api.calendly.com/event_types/...",
      "slug": "30-min-strategy",
      "name": "30-Min Strategy",
      "duration": 30,
      "description": "A focused session...",
      "active": true,
      "booking_url": "https://calendly.com/...",
      "color": "#000000"
    }
  ],
  "count": 2
}
```

#### 2. `/api/calendly/availability`
**Purpose**: Fetches available time slots for a specific event type

**Query Parameters:**
- `eventTypeUri` (required): The URI of the event type
- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (optional): End date in YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "availableDates": ["2025-10-15", "2025-10-16"],
  "availabilityByDate": {
    "2025-10-15": ["09:00 AM", "10:00 AM", "02:00 PM"],
    "2025-10-16": ["11:00 AM", "03:00 PM"]
  },
  "rawSlots": [...]
}
```

#### 3. `/api/calendly/user-info`
**Purpose**: Helper endpoint to get your Calendly user information

**Response:**
```json
{
  "success": true,
  "user": {
    "uri": "https://api.calendly.com/users/...",
    "name": "Assassin",
    "email": "assassin@example.com",
    "scheduling_url": "https://calendly.com/assassin",
    "timezone": "America/New_York",
    "avatar_url": "...",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

## 🎯 How It Works

### MeetingsPage Integration

The `MeetingsPage` component has been enhanced with Calendly integration:

1. **Event Type Fetching**
   - When Assassin (analyst ID: 1) is selected, the component fetches event types from Calendly
   - Event types are transformed into the `Meeting` format used by the UI
   - Loading states are displayed while fetching

2. **Availability Fetching**
   - When a meeting type is selected, the component fetches available slots for the current month
   - The calendar only shows dates with available time slots
   - Time slots are filtered to show only what's available for the selected date

3. **Seamless Fallback**
   - For other analysts, the default hardcoded meeting types and time slots are used
   - The system gracefully handles API errors by falling back to defaults

### Code Changes

**New State Variables:**
```typescript
const [calendlyEventTypes, setCalendlyEventTypes] = useState<any[]>([]);
const [calendlyMeetings, setCalendlyMeetings] = useState<Meeting[]>(meetings);
const [availableDates, setAvailableDates] = useState<string[]>([]);
const [availableTimesByDate, setAvailableTimesByDate] = useState<Record<string, string[]>>({});
const [isLoadingEventTypes, setIsLoadingEventTypes] = useState<boolean>(false);
const [isLoadingAvailability, setIsLoadingAvailability] = useState<boolean>(false);
const [selectedEventTypeUri, setSelectedEventTypeUri] = useState<string>('');
```

**Key Functions:**
- `fetchCalendlyEventTypes()`: Fetches and transforms event types
- `fetchCalendlyAvailability()`: Fetches available time slots
- `getTimeSlots()`: Returns time slots based on selected date and analyst
- `isDateAvailable()`: Updated to check Calendly availability for Assassin

## 🧪 Testing the Integration

### Step 1: Test API Endpoints

1. Start your dev server: `npm run dev`
2. Test the user info endpoint:
   ```bash
   curl http://localhost:3000/api/calendly/user-info
   ```
3. Test event types endpoint:
   ```bash
   curl "http://localhost:3000/api/calendly/event-types"
   ```
4. Test availability endpoint:
   ```bash
   curl "http://localhost:3000/api/calendly/availability?eventTypeUri=YOUR_EVENT_TYPE_URI&startDate=2025-10-15&endDate=2025-10-31"
   ```

### Step 2: Test in the UI

1. Go to `/meetings` page
2. Select Assassin as your analyst
3. Verify that:
   - Meeting types load from Calendly
   - Only available dates are clickable in the calendar
   - Time slots show only available times for the selected date
4. Test with other analysts to verify the fallback works

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never expose your access token in client-side code
   - All Calendly API calls are made server-side

2. **Error Handling**
   - API errors are logged server-side
   - Users see friendly error messages
   - System falls back to defaults on failures

3. **Rate Limiting**
   - Be mindful of Calendly's API rate limits
   - Consider implementing caching for frequently accessed data

## 🚨 Troubleshooting

### Issue: "Calendly access token not configured"
**Solution**: Verify that `CALENDLY_ACCESS_TOKEN` is set in `.env.local`

### Issue: "User URI is required"
**Solution**: Verify that `CALENDLY_ASSASSIN_USER_URI` is set in `.env.local`

### Issue: No event types showing
**Solutions:**
1. Check that you have active event types in your Calendly account
2. Verify the user URI is correct
3. Check the browser console for API errors
4. Visit `/api/calendly/event-types` directly to see the raw API response

### Issue: No available dates showing
**Solutions:**
1. Check that you have availability configured in Calendly
2. Verify your timezone settings
3. Check the browser console for API errors
4. Visit `/api/calendly/availability` with parameters to see the raw response

### Issue: API returns 401 Unauthorized
**Solution**: Your access token may be invalid or expired. Generate a new one from Calendly

## 📚 Additional Resources

- [Calendly API Documentation](https://developer.calendly.com/)
- [Calendly API Reference](https://developer.calendly.com/api-docs/)
- [Calendly Event Types](https://developer.calendly.com/api-docs/e8de9e82c52c8-get-event-types)
- [Calendly Availability](https://developer.calendly.com/api-docs/b6f4d0e1e8e3f-get-event-type-available-times)

## 🔄 Future Enhancements

Consider implementing:
1. **Caching**: Cache Calendly responses to reduce API calls
2. **Webhook Integration**: Real-time updates when availability changes
3. **Multi-Analyst Support**: Extend Calendly integration to other analysts
4. **Booking Creation**: Create Calendly bookings via API when users complete payment
5. **Cancellation Handling**: Allow users to cancel/reschedule via Calendly API

## ✅ Checklist

Before going to production:
- [ ] Calendly access token is configured
- [ ] User URI is correct for Assassin
- [ ] Event types are created and active in Calendly
- [ ] Availability is configured in Calendly
- [ ] All API endpoints tested
- [ ] UI tested with Assassin's calendar
- [ ] Fallback tested with other analysts
- [ ] Error handling verified
- [ ] .env.local is in .gitignore
- [ ] Production environment variables are set

---

**Last Updated**: October 9, 2025
**Integration Version**: 1.0.0

