# Calendly Multi-Analyst Integration Setup

## 🎯 Overview

This guide explains how to extend the Calendly integration from just Assassin to **all analysts**.

## 📋 What You Need for Each Analyst

### Required Information

For each analyst who wants Calendly integration, you need:

1. ✅ **Calendly Account** - Each analyst creates their own account
2. ✅ **Personal Access Token** - Each analyst generates their token
3. ✅ **User URI** - Unique identifier from Calendly API
4. ✅ **Active Event Types** - Meeting types configured in their Calendly

## 🔧 Setup Options

### **Option 1: Environment Variables (Simpler)**

Add to `.env.local`:

```bash
# Calendly Access Tokens (if using separate tokens per analyst)
CALENDLY_ACCESS_TOKEN=shared_token_or_admin_token

# Analyst User URIs
CALENDLY_ANALYST_0_URI=https://api.calendly.com/users/adnan-user-id
CALENDLY_ANALYST_1_URI=https://api.calendly.com/users/assassin-user-id
CALENDLY_ANALYST_2_URI=https://api.calendly.com/users/hassan-tariq-user-id
CALENDLY_ANALYST_3_URI=https://api.calendly.com/users/hamza-ali-user-id
CALENDLY_ANALYST_4_URI=https://api.calendly.com/users/hassan-khan-user-id
CALENDLY_ANALYST_5_URI=https://api.calendly.com/users/meower-user-id
CALENDLY_ANALYST_6_URI=https://api.calendly.com/users/mohid-user-id
CALENDLY_ANALYST_7_URI=https://api.calendly.com/users/m-usama-user-id
```

**Pros:**
- Quick to set up
- No database changes needed
- Easy to update

**Cons:**
- Requires server restart when adding analysts
- Not as flexible for scaling

---

### **Option 2: Database Storage (Recommended for Production)**

Create a MongoDB collection to store analyst Calendly configurations.

#### Collection: `analyst_calendly_config`

```typescript
{
  _id: ObjectId("..."),
  analystId: 0,  // Matches frontend analyst ID
  name: "Adnan",
  calendlyUserUri: "https://api.calendly.com/users/XXXXX",
  calendlyEnabled: true,
  // Optional: Store encrypted personal access tokens per analyst
  encryptedAccessToken: "encrypted_token_string",
  createdAt: new Date("2025-10-09"),
  updatedAt: new Date("2025-10-09")
}
```

**Sample Documents:**

```javascript
[
  {
    analystId: 0,
    name: "Adnan",
    calendlyUserUri: "https://api.calendly.com/users/adnan-uuid-here",
    calendlyEnabled: true
  },
  {
    analystId: 1,
    name: "Assassin",
    calendlyUserUri: "https://api.calendly.com/users/assassin-uuid-here",
    calendlyEnabled: true
  },
  {
    analystId: 2,
    name: "Hassan Tariq",
    calendlyUserUri: "https://api.calendly.com/users/hassan-t-uuid-here",
    calendlyEnabled: true
  },
  // ... etc for all analysts
]
```

**Pros:**
- Dynamic updates without server restart
- Can enable/disable per analyst
- Scalable for many analysts
- Can store additional metadata

**Cons:**
- Requires database setup
- Slightly more complex implementation

---

## 🛠️ Implementation Steps

### Step 1: Collect Calendly User URIs

For each analyst:

**Method A: Use the API Helper**
1. Have each analyst generate their Calendly Personal Access Token
2. Temporarily update `CALENDLY_ACCESS_TOKEN` in `.env.local` to their token
3. Visit: `http://localhost:3000/api/calendly/user-info`
4. Copy their `uri` from the response
5. Repeat for each analyst

**Method B: Direct API Call**
Each analyst can run this command with their token:
```bash
curl -H "Authorization: Bearer THEIR_TOKEN" https://api.calendly.com/users/me
```

### Step 2: Choose Your Approach

#### For **Option 1** (Environment Variables):

1. Add all URIs to `.env.local` as shown above
2. Restart your server
3. Done! ✅

#### For **Option 2** (Database):

1. Create the database collection:
```javascript
db.createCollection("analyst_calendly_config");
db.analyst_calendly_config.createIndex({ "analystId": 1 }, { unique: true });
```

2. Insert documents for each analyst:
```javascript
db.analyst_calendly_config.insertMany([
  {
    analystId: 0,
    name: "Adnan",
    calendlyUserUri: "https://api.calendly.com/users/XXXXX",
    calendlyEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // ... repeat for all 8 analysts
]);
```

---

## 🔄 Code Changes Required

### If Using Option 1 (Environment Variables)

**Update: `src/app/api/calendly/event-types/route.ts`**
```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const analystId = searchParams.get('analystId') || '1'; // Default to Assassin
  
  // Get URI from environment based on analyst ID
  const userUri = process.env[`CALENDLY_ANALYST_${analystId}_URI`];
  
  if (!userUri) {
    return NextResponse.json(
      { error: 'Calendly not configured for this analyst' },
      { status: 404 }
    );
  }
  
  // ... rest of the code
}
```

**Update: `src/components/pages/MeetingsPage.tsx`**
```typescript
// Change from:
if (selectedAnalyst === 1) {

// To:
if (selectedAnalyst !== null) {
  // Pass analyst ID to API
  const response = await fetch(`/api/calendly/event-types?analystId=${selectedAnalyst}`);
  // ...
}
```

---

### If Using Option 2 (Database)

**Create: `src/app/api/analysts/calendly-config/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const analystId = searchParams.get('analystId');

  const client = await clientPromise;
  const db = client.db('inspired-analyst');
  
  if (analystId) {
    // Get specific analyst config
    const config = await db.collection('analyst_calendly_config')
      .findOne({ analystId: parseInt(analystId) });
    
    return NextResponse.json({ config });
  } else {
    // Get all configs
    const configs = await db.collection('analyst_calendly_config')
      .find({}).toArray();
    
    return NextResponse.json({ configs });
  }
}
```

**Update: `src/app/api/calendly/event-types/route.ts`**
```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const analystId = searchParams.get('analystId');
  
  // Fetch analyst config from database
  const configResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/analysts/calendly-config?analystId=${analystId}`
  );
  const { config } = await configResponse.json();
  
  if (!config || !config.calendlyEnabled) {
    return NextResponse.json(
      { error: 'Calendly not configured for this analyst' },
      { status: 404 }
    );
  }
  
  const userUri = config.calendlyUserUri;
  // ... rest of the code
}
```

**Update: `src/components/pages/MeetingsPage.tsx`**
```typescript
// Fetch Calendly event types when ANY analyst is selected
useEffect(() => {
  if (selectedAnalyst !== null) {
    fetchCalendlyEventTypes(selectedAnalyst);
  }
}, [selectedAnalyst]);
```

---

## 📝 Quick Reference Table

| Analyst ID | Name | Env Variable Key | Example User URI |
|------------|------|------------------|------------------|
| 0 | Adnan | `CALENDLY_ANALYST_0_URI` | `https://api.calendly.com/users/...` |
| 1 | Assassin | `CALENDLY_ANALYST_1_URI` | `https://api.calendly.com/users/...` |
| 2 | Hassan Tariq | `CALENDLY_ANALYST_2_URI` | `https://api.calendly.com/users/...` |
| 3 | Hamza Ali | `CALENDLY_ANALYST_3_URI` | `https://api.calendly.com/users/...` |
| 4 | Hassan Khan | `CALENDLY_ANALYST_4_URI` | `https://api.calendly.com/users/...` |
| 5 | Meower | `CALENDLY_ANALYST_5_URI` | `https://api.calendly.com/users/...` |
| 6 | Mohid | `CALENDLY_ANALYST_6_URI` | `https://api.calendly.com/users/...` |
| 7 | M. Usama | `CALENDLY_ANALYST_7_URI` | `https://api.calendly.com/users/...` |

---

## 🎯 Recommended Approach

### For Now (Quick Setup):
**Use Option 1** (Environment Variables)
- Easy to test
- Works immediately
- No database changes

### For Production (Scalable):
**Migrate to Option 2** (Database)
- Easier to manage
- Can update without server restart
- Better for adding more analysts

---

## ✅ Testing Checklist

For each analyst with Calendly integration:
- [ ] Calendly account created
- [ ] Personal Access Token generated
- [ ] User URI collected
- [ ] Event types created in Calendly
- [ ] Availability configured
- [ ] Added to environment variables OR database
- [ ] Server restarted (if using env variables)
- [ ] Tested in UI - meeting types load
- [ ] Tested in UI - dates show correctly
- [ ] Tested in UI - time slots appear
- [ ] Tested booking flow - popup appears
- [ ] Verified booking appears in Calendly calendar

---

## 🚀 Quick Start Example

If you want me to implement this for all analysts right now, provide:

1. **Which option?** Environment variables or database?
2. **Calendly User URIs** for each analyst (or I can show you how to get them)
3. **Access tokens** (if using separate tokens per analyst)

Let me know and I can implement the full multi-analyst support! 🎉

