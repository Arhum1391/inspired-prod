# Vercel Deployment Guide - Environment Variables

## Required Environment Variables

For the Calendly integration to work on Vercel (or any production deployment), you MUST configure the following environment variables:

### 1. `CALENDLY_ACCESS_TOKEN`
- **Description**: Your Calendly Personal Access Token
- **Where to get it**: https://calendly.com/integrations/api_webhooks
- **Required**: Yes
- **Used for**: All Calendly API calls (fetching events, availability, etc.)

### 2. `CALENDLY_ANALYST_1_URI`
- **Description**: Assassin's Calendly User URI (Analyst ID: 1)
- **Format**: `https://api.calendly.com/users/XXXXXXXXXXXXXXXX`
- **Required**: Yes (for Assassin's meeting bookings)
- **Used for**: Fetching Assassin's event types and availability

### 3. `BINANCE_CREDENTIALS_ENCRYPTION_KEY` ⚠️ **CRITICAL FOR BINANCE INTEGRATION**
- **Description**: 32-byte encryption key for encrypting Binance API credentials at rest
- **Format**: Base64, hex, or 32-character UTF-8 string
- **Required**: Yes (if using Binance portfolio integration)
- **How to generate**: 
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- **Used for**: Encrypting user Binance API keys and secrets before storing in MongoDB
- **⚠️ IMPORTANT**: This key must be the same across all deployments/environments if you want to decrypt existing credentials

---

## How to Add Environment Variables to Vercel

### Step 1: Access Vercel Project Settings
1. Go to your Vercel dashboard: https://vercel.com
2. Select your project
3. Navigate to: **Settings** → **Environment Variables**

### Step 2: Add Each Variable
For **each** environment variable listed above:

1. Click **"Add New"**
2. Enter the **Name** (e.g., `CALENDLY_ACCESS_TOKEN`)
3. Enter the **Value** (your actual token/URI)
4. Select environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **"Save"**

### Step 3: Redeploy
After adding all environment variables:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for the deployment to complete

---

## How to Find Assassin's User URI

### Method 1: Using the List Users API (Locally)
1. Ensure `CALENDLY_ACCESS_TOKEN` is set in your local `.env.local` file
2. Run your dev server: `npm run dev`
3. Visit: http://localhost:3000/api/calendly/list-users
4. Find "Assassin" in the users array
5. Copy the `"uri"` value

### Method 2: Direct API Call
```bash
curl -X GET https://api.calendly.com/users/me \
  -H "Authorization: Bearer YOUR_CALENDLY_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```
- Copy the `resource.uri` value from the response

### Method 3: List Organization Members
```bash
curl -X GET "https://api.calendly.com/organization_memberships?organization=YOUR_ORG_URI" \
  -H "Authorization: Bearer YOUR_CALENDLY_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```
- Find Assassin's entry in the collection
- Copy their `user.uri` value

---

## Troubleshooting

### Issue: "Calendly access token not configured" Error
**Cause**: `CALENDLY_ACCESS_TOKEN` is not set in Vercel environment variables

**Solution**: 
1. Verify the variable is added in Vercel settings
2. Check the variable name is spelled exactly: `CALENDLY_ACCESS_TOKEN` (case-sensitive)
3. Ensure it's enabled for Production environment
4. Redeploy the application

### Issue: "User URI is required" Error
**Cause**: `CALENDLY_ANALYST_1_URI` is not set in Vercel environment variables

**Solution**:
1. Find Assassin's URI using one of the methods above
2. Add it to Vercel environment variables
3. Redeploy the application

### Issue: Calendly works locally but not on Vercel
**Cause**: Environment variables are set in `.env.local` (which is git-ignored) but not in Vercel

**Solution**:
- `.env.local` only works for local development
- You MUST add the same variables to Vercel settings
- Follow the steps in "How to Add Environment Variables to Vercel" above

### Issue: Changes not taking effect
**Cause**: Vercel cached the old deployment

**Solution**:
1. Clear Vercel cache by doing a fresh redeploy
2. Or: Update the environment variable and redeploy
3. Wait 1-2 minutes for propagation

### Issue: "Failed to store Binance credentials" Error
**Cause**: `BINANCE_CREDENTIALS_ENCRYPTION_KEY` is not set in Vercel environment variables

**Solution**:
1. Generate a secure 32-byte key: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
2. Add `BINANCE_CREDENTIALS_ENCRYPTION_KEY` to Vercel environment variables
3. Ensure it's enabled for Production environment
4. Redeploy the application
5. **Note**: If you already have encrypted credentials in the database, you MUST use the same key that was used to encrypt them, or all existing credentials will be lost

### Issue: "Failed to execute 'getRandomValues' on 'Crypto'" Error
**Cause**: Node.js crypto module is being bundled into client-side code

**Solution**:
1. This should be fixed in the latest code with webpack configuration
2. Ensure you're using the updated `next.config.ts` that externalizes crypto for client builds
3. Rebuild and redeploy the application

---

## Local Development Setup

For local development, create a `.env.local` file in the project root:

```env
# Calendly Integration
CALENDLY_ACCESS_TOKEN=your_calendly_access_token_here
CALENDLY_ANALYST_1_URI=https://api.calendly.com/users/XXXXXXXXXXXXXXXX
```

**Note**: Never commit `.env.local` to git - it's already in `.gitignore`

---

## Security Best Practices

1. ✅ **Never** commit API tokens to git
2. ✅ **Always** use environment variables for sensitive data
3. ✅ Keep `.env.local` in `.gitignore`
4. ✅ Rotate access tokens periodically
5. ✅ Use different tokens for development and production (if possible)

---

## Quick Checklist

Before deploying to Vercel, ensure:

- [ ] `CALENDLY_ACCESS_TOKEN` is added to Vercel
- [ ] `CALENDLY_ANALYST_1_URI` is added to Vercel
- [ ] `BINANCE_CREDENTIALS_ENCRYPTION_KEY` is added to Vercel (if using Binance integration)
- [ ] All variables are enabled for **Production** environment
- [ ] Application has been redeployed after adding variables
- [ ] Test the Calendly integration on the deployed site
- [ ] Test the Binance integration on the deployed site (if applicable)

---

## Additional Resources

- [Calendly API Documentation](https://developer.calendly.com/api-docs)
- [Vercel Environment Variables Guide](https://vercel.com/docs/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

