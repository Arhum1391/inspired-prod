# 🏢 Calendly Organization Plan Setup Guide

## 🎯 Organization Plan vs Individual Accounts

### **With Individual Calendly Accounts** (Current Setup)
- ❌ Each analyst needs their own access token
- ❌ Need to manually get URI for each analyst
- ❌ More complex setup
- ❌ More maintenance

### **With Calendly Organization Plan** ✅ (Recommended!)
- ✅ **ONE admin access token** for all analysts
- ✅ **Automatic discovery** of all team members
- ✅ **One-click setup** for all URIs
- ✅ **Easy to add** new analysts later
- ✅ **Centralized management**

---

## 🚀 Super Simple Setup (Organization Plan)

### Step 1: Get Admin Access Token (One Time)

1. **Admin logs in** to Calendly organization account
2. Go to: **Settings → Integrations → API & Webhooks**
3. Click **"Get a personal access token"**
4. Copy the token

### Step 2: Add Token to Environment

Add to `.env.local`:
```bash
CALENDLY_ACCESS_TOKEN=paste_admin_token_here
```

### Step 3: Use the Auto-Discovery Page

1. **Visit**: `http://localhost:3000/admin/calendly-team-setup`

2. **Page automatically shows ALL team members!** 🎉
   - Names
   - Emails
   - User URIs
   - Analyst ID numbers

3. **Click "Copy All Configuration"**

4. **Paste into `.env.local`**

5. **Restart server**

6. **DONE!** All analysts are configured! ✅

---

## 📸 What the Admin Pages Look Like

### Page 1: `/admin/calendly-setup` (Individual)
**Use this if**: Each analyst has their own separate Calendly account

**Features**:
- Paste one access token
- Get one User URI
- For individual accounts

### Page 2: `/admin/calendly-team-setup` (Organization) ⭐ **RECOMMENDED**
**Use this if**: You have a Calendly organization/team plan

**Features**:
- Automatically lists ALL team members
- Shows all URIs at once
- Copy all configuration with one click
- See who has access
- Perfect for managing multiple analysts

---

## 🎯 What Your Client Needs to Do

### Initial Setup (One Time):

**Email to your client:**

> Hi! Here's how to set up Calendly for all your analysts:
> 
> **Option A: If you have Calendly Organization/Team Plan (EASIER):**
> 
> 1. Log in to your Calendly admin account
> 2. Go to Settings → Integrations → API & Webhooks  
> 3. Click "Get a personal access token" and copy it
> 4. Send it to me
> 
> I'll handle the rest - I can automatically get URIs for all your team members!
> 
> **Option B: If each analyst has separate Calendly accounts:**
> 
> 1. Ask each analyst to:
>    - Log in to their Calendly at calendly.com
>    - Go to Settings → Integrations → API & Webhooks
>    - Click "Get a personal access token"
>    - Send you their token
> 2. Send me all the tokens
> 
> I'll get the URIs for each one.

### Adding New Analysts Later:

**With Organization Plan** (Super Easy!):
1. Add the new analyst to your Calendly organization
2. Visit: `/admin/calendly-team-setup`
3. Click "Copy All Configuration"
4. Paste into `.env.local` (replaces old config)
5. Restart server
6. Done! ✅

**Without Organization Plan**:
1. Get new analyst's access token
2. Visit: `/admin/calendly-setup`
3. Paste token, get URI
4. Add to `.env.local`
5. Restart server

---

## 💰 Calendly Pricing Consideration

### **Organization Plan Benefits for Your Use Case:**

**Worth it if**:
- ✅ Managing 3+ analysts
- ✅ Want centralized control
- ✅ Need easy adding/removing of team members
- ✅ Want simplified setup

**Current Pricing** (check Calendly for latest):
- **Teams Plan**: ~$16/user/month - Includes organization features
- **Enterprise**: Custom pricing - Full admin controls

**Cost Comparison**:
- 8 analysts × $16 = $128/month
- BUT: Way easier management
- Saves hours of setup time
- Professional team management

---

## 🔧 Technical Details

### With Organization Plan API:

```typescript
// ONE token can:
✅ List all organization members
✅ Get each member's User URI
✅ Fetch any member's event types
✅ Access any member's availability
✅ Manage team-wide settings
```

### API Endpoints Used:

1. **Get Organization Members**:
   ```
   GET /organization_memberships?organization={org_uri}
   ```

2. **For Each Member**:
   ```
   GET /users/{user_uri}
   GET /event_types?user={user_uri}
   GET /event_type_available_times?event_type={event_type_uri}
   ```

---

## ✅ Current Status

**Currently Configured**:
- ✅ Assassin (ID: 1) - Using individual token

**To Configure All Analysts**:
1. Get organization plan OR individual tokens for each
2. Use appropriate admin page
3. Copy configuration to `.env.local`
4. Update code to support all analyst IDs (I can do this)

---

## 🎁 What I've Built For You

### **For Individual Accounts**:
- **Page**: `/admin/calendly-setup`
- **Use**: One analyst at a time
- **Process**: Paste token → Get URI → Add to env

### **For Organization Plan** ⭐:
- **Page**: `/admin/calendly-team-setup`
- **Use**: All analysts at once
- **Process**: Visit page → Copy all → Paste to env → Done!

---

## 🚀 Recommended Next Steps

1. **Ask your client**: "Do you have a Calendly organization/team plan?"

2. **If YES (Organization Plan)**:
   - Get ONE admin token
   - Visit `/admin/calendly-team-setup`
   - Copy all URIs
   - I update the code to use all analysts
   - Done! ✅

3. **If NO (Individual Accounts)**:
   - Collect tokens from each analyst
   - Use `/admin/calendly-setup` for each one
   - Add URIs one by one
   - I update the code to use all analysts

---

**Recommendation**: If managing 8 analysts, the **Organization Plan** will save significant time and effort! 🎯

---

**Last Updated**: October 9, 2025  
**Admin Pages**: `/admin/calendly-setup`, `/admin/calendly-team-setup`

