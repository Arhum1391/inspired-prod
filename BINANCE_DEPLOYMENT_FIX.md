# Binance Integration Deployment Fix

## Issues Fixed

### 1. Missing Environment Variable
**Problem**: The `BINANCE_CREDENTIALS_ENCRYPTION_KEY` environment variable was not configured in the deployed environment, causing credential storage to fail.

**Fix**: 
- Added validation check in the API route to detect missing encryption key
- Updated error messages to be more informative
- Added documentation to `ENV_EXAMPLE.md`, `VERCEL_DEPLOYMENT_GUIDE.md`, and `Dockerfile`

### 2. Crypto Module Bundling Issue
**Problem**: The Node.js `crypto` module was being bundled into client-side code, causing the error: `Failed to execute 'getRandomValues' on 'Crypto': parameter 1 is not of type 'ArrayBufferView'`

**Fix**: 
- Updated `next.config.ts` to externalize Node.js built-in modules (`crypto`, `fs`, `net`, `tls`) for client-side builds
- This prevents server-only modules from being bundled into the browser bundle

## Required Action: Add Environment Variable

To fix the Binance integration on your deployed site, you **MUST** add the `BINANCE_CREDENTIALS_ENCRYPTION_KEY` environment variable:

### Step 1: Generate Encryption Key

Run this command locally to generate a secure 32-byte key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

This will output a base64-encoded string like: `xK7vN2pQ9mR4tY8uI3oP6wE1sD5fG0hJ2kL9mN4bV7cX0zA=`

### Step 2: Add to Vercel (or your deployment platform)

1. Go to your Vercel dashboard: https://vercel.com
2. Select your project
3. Navigate to: **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Enter:
   - **Name**: `BINANCE_CREDENTIALS_ENCRYPTION_KEY`
   - **Value**: (paste the key generated in Step 1)
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
6. Click **"Save"**

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 4: Test

1. Visit your deployed site
2. Try connecting your Binance account
3. The connection should now work without errors

## Important Notes

⚠️ **CRITICAL**: If you already have Binance credentials stored in your database:
- You **MUST** use the **same encryption key** that was used to encrypt them
- If you use a different key, all existing encrypted credentials will become unreadable
- If you don't know the original key, you'll need to ask users to reconnect their Binance accounts

⚠️ **Security**: 
- Never commit the encryption key to git
- Keep it secure and backed up
- Use the same key across all environments (dev, staging, production) if you want to share the same database

## Files Changed

1. `next.config.ts` - Added webpack config to externalize crypto module
2. `src/app/api/portfolio/credentials/route.ts` - Added encryption key validation
3. `ENV_EXAMPLE.md` - Added Binance encryption key documentation
4. `VERCEL_DEPLOYMENT_GUIDE.md` - Added Binance setup instructions
5. `Dockerfile` - Added Binance encryption key as build argument

## Verification

After deploying, you can verify the fix by:

1. Checking server logs for any encryption key errors (should be none)
2. Testing Binance account connection on the deployed site
3. Verifying credentials are stored successfully in MongoDB

If you still see errors after adding the environment variable and redeploying, check:
- The key is exactly 32 bytes when decoded
- The key is set for the correct environment (Production)
- The deployment completed successfully
- Server logs for more detailed error messages

