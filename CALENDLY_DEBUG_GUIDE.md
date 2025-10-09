# Calendly Integration Debug Guide

## 🔍 Current Issue
Meeting types are displaying correctly, but calendar dates and time slots are not showing Calendly availability.

## ✅ What I've Fixed

### 1. **Time Format Consistency**
- Changed from `toLocaleTimeString()` to manual formatting
- Ensures consistent "H:MM AM/PM" format (e.g., "9:00 AM", "2:30 PM")

### 2. **UTC Date Handling**
- Using UTC methods to avoid timezone conversion issues
- Ensures dates match between API and calendar

### 3. **Added Comprehensive Logging**
- Server-side logs in the availability API
- Client-side logs in MeetingsPage
- Date availability checking logs
- Time slot selection logs

## 🧪 How to Debug

### Step 1: Check Environment Variables

Make sure your `.env.local` file has:
```bash
CALENDLY_ACCESS_TOKEN=your_token_here
CALENDLY_ASSASSIN_USER_URI=https://api.calendly.com/users/XXXXXXXX
```

**Verify the token works:**
1. Open your browser dev tools (F12)
2. Go to Console tab
3. Navigate to: `http://localhost:3000/api/calendly/user-info`
4. You should see your user information

### Step 2: Check Event Types

1. Navigate to `/meetings`
2. Select "Assassin" as analyst
3. **Open browser Console (F12)**
4. You should see logs like:
   ```
   Attempting to fetch availability: {selectedMeeting: 2, ...}
   Selected event type: {id: "https://...", name: "30-Min Strategy", ...}
   ```

**If you don't see event types:**
- Check the Network tab for the `/api/calendly/event-types` call
- Verify the response contains your Calendly event types
- Make sure you have active event types in your Calendly account

### Step 3: Check Availability Fetching

After selecting a meeting type, you should see console logs:

**Client-side (browser console):**
```
Fetching Calendly availability: {
  eventTypeUri: "https://api.calendly.com/event_types/...",
  startDate: "2025-10-01",
  endDate: "2025-10-31"
}
Received availability data: {
  success: true,
  availableDates: ["2025-10-15", "2025-10-16", ...],
  availabilityByDate: {...},
  totalSlots: 10
}
```

**Server-side (terminal where dev server is running):**
```
Calendly API Response: {
  collectionLength: 10,
  firstSlot: {start_time: "...", ...}
}
Transformed availability: {
  availableDatesCount: 5,
  availableDates: ["2025-10-15", ...],
  sampleDate: "2025-10-15",
  sampleTimes: ["9:00 AM", "10:00 AM", ...]
}
```

### Step 4: Check Calendar Date Availability

When the calendar renders, you should see logs (only for the first 5 dates to avoid spam):
```
Checking date availability: {
  dateStr: "2025-10-15",
  isAvailable: true,
  availableDates: ["2025-10-15", "2025-10-16", ...]
}
```

### Step 5: Check Time Slots

When you select a date, check the console:
```
Returning Calendly time slots for 2025-10-15 : ["9:00 AM", "10:00 AM", "2:00 PM"]
```

## 🚨 Common Issues & Solutions

### Issue 1: No availability data received

**Symptoms:**
- `availableDates` is empty array `[]`
- `totalSlots: 0` in the response

**Causes & Solutions:**

1. **No availability configured in Calendly**
   - Go to your Calendly dashboard
   - Check your event type's availability settings
   - Make sure you have working hours set
   - Verify your timezone is correct

2. **Date range is in the past or too far in future**
   - Calendly only returns availability for future dates
   - Check the date range being requested in the logs

3. **Wrong event type URI**
   - Verify the `eventTypeUri` in the logs matches a valid event type
   - Check `/api/calendly/event-types` to see all your event types

### Issue 2: Calendar shows all dates as unavailable

**Symptoms:**
- All dates in calendar are grayed out
- No dates are clickable

**Debug Steps:**

1. Check browser console for:
   ```
   Checking date availability: {dateStr: "...", isAvailable: false, availableDates: []}
   ```

2. **If `availableDates` is empty:**
   - Availability API didn't return data
   - Follow "Issue 1" solutions above

3. **If `availableDates` has data but dates still unavailable:**
   - Date format mismatch issue
   - Check the date format in logs:
     ```javascript
     console.log('Available dates:', availableDates);
     console.log('Checking date:', dateStr);
     ```
   - They should both be in "YYYY-MM-DD" format

### Issue 3: Time slots show default times, not Calendly times

**Symptoms:**
- Time slots always show: 9:00 AM, 10:00 AM, 11:30 AM, etc.
- Not showing actual Calendly availability

**Debug Steps:**

1. Check console when selecting a date:
   ```
   Using default time slots. Assassin? true Selected date: "2025-10-15" Has times? false
   ```

2. **If "Has times?" is false:**
   - The `availableTimesByDate` object doesn't have data for that date
   - Check the availability API response
   - Verify `availabilityByDate` in the response

3. **Check for date format mismatch:**
   ```javascript
   console.log('Selected date:', selectedDate);
   console.log('Available times by date:', availableTimesByDate);
   ```
   - The `selectedDate` key must exactly match a key in `availableTimesByDate`

### Issue 4: API returns 401 Unauthorized

**Symptoms:**
- Console shows "Failed to fetch availability: 401"
- Network tab shows 401 error

**Solution:**
- Your Calendly access token is invalid or expired
- Generate a new token from Calendly dashboard
- Update `.env.local` with the new token
- Restart your dev server

### Issue 5: API returns 404 Not Found

**Symptoms:**
- "Failed to fetch availability from Calendly"
- Details show 404 error

**Causes:**
1. **Wrong event type URI**
   - The URI must be the full Calendly API URI
   - Should look like: `https://api.calendly.com/event_types/XXXXX`

2. **Event type doesn't exist or is inactive**
   - Check your Calendly dashboard
   - Make sure the event type is active

## 🔧 Manual Testing Checklist

### Test 1: User Info API
```bash
curl http://localhost:3000/api/calendly/user-info
```
**Expected:** Your user information with URI

### Test 2: Event Types API
```bash
curl http://localhost:3000/api/calendly/event-types
```
**Expected:** List of your active event types

### Test 3: Availability API
Replace `EVENT_TYPE_URI` with an actual event type URI from Test 2:
```bash
curl "http://localhost:3000/api/calendly/availability?eventTypeUri=https://api.calendly.com/event_types/XXXXX&startDate=2025-10-15&endDate=2025-10-31"
```
**Expected:** Available dates and time slots

### Test 4: UI Flow
1. Go to `/meetings`
2. Select "Assassin"
3. Verify meeting types load
4. Select a meeting type
5. Check browser console for availability fetch
6. Check if calendar dates are clickable
7. Click an available date
8. Check if time slots appear

## 📊 Expected Console Log Flow

When everything works correctly, you should see this sequence:

1. **Select Assassin:**
   ```
   Attempting to fetch availability: ...
   ```

2. **Select Meeting Type:**
   ```
   Fetching Calendly availability: ...
   Calendly API Response: {collectionLength: X, ...}
   Transformed availability: {availableDatesCount: X, ...}
   Received availability data: ...
   ```

3. **Calendar Renders:**
   ```
   Checking date availability: {dateStr: "...", isAvailable: true, ...}
   ```

4. **Select Date:**
   ```
   Returning Calendly time slots for ... : ["9:00 AM", ...]
   ```

## 🔄 What to Do Next

1. **Open your browser dev tools (F12)**
2. **Navigate to Console tab**
3. **Go through the debug flow above**
4. **Note where the logs stop or show unexpected values**
5. **Check the specific issue section that matches your problem**

## 📝 Reporting Issues

If you still have issues, provide:
1. All console logs from browser
2. Terminal logs where you see "Calendly API Response"
3. Response from `/api/calendly/event-types` (paste the JSON)
4. Your Calendly event type configuration (screenshot)

## 🔐 Security Note

Never share your actual access token when reporting issues. Redact it like:
```
CALENDLY_ACCESS_TOKEN=eyJraWQiOiIx...REDACTED
```

---

**Last Updated:** October 9, 2025

