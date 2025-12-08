# Vercel Deployment Guide - Environment Variables

## Complete Environment Variables Checklist

This guide lists ALL environment variables required for Vercel deployment, organized by category and build-time vs runtime requirements.

### ⚠️ CRITICAL: Build-Time vs Runtime Variables

**Build-Time Variables** (Required during `npm run build`):
- `MONGODB_URI` - Must be available during build (though connection is lazy-loaded)
- `NEXT_PUBLIC_*` variables - Embedded into the build output

**Runtime Variables** (Required when the app is running):
- All other variables are only needed at runtime

---

## Required Environment Variables

### 1. Database Configuration (REQUIRED - Build & Runtime)

#### `MONGODB_URI` ⚠️ **CRITICAL**
- **Description**: MongoDB connection string
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/inspired-analyst`
- **Required**: Yes (Build & Runtime)
- **Used for**: All database operations
- **⚠️ IMPORTANT**: Must be set in Vercel for builds to succeed (connection is lazy-loaded but URI check happens)

#### `JWT_SECRET` ⚠️ **CRITICAL**
- **Description**: Secret key for signing JSON Web Tokens
- **Format**: Any secure random string (minimum 32 characters recommended)
- **Required**: Yes (Runtime)
- **Used for**: User authentication and session management
- **How to generate**: 
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

---

### 2. Stripe Payment Integration (REQUIRED for payments)

#### `STRIPE_SECRET_KEY`
- **Description**: Stripe secret key (server-side)
- **Where to get it**: https://dashboard.stripe.com/apikeys
- **Required**: Yes (Runtime)
- **Used for**: Creating checkout sessions, handling webhooks, managing subscriptions

#### `STRIPE_WEBHOOK_SECRET`
- **Description**: Stripe webhook signing secret
- **Where to get it**: https://dashboard.stripe.com/webhooks (create endpoint, copy signing secret)
- **Required**: Yes (Runtime)
- **Used for**: Verifying webhook signatures from Stripe

#### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Description**: Stripe publishable key (client-side)
- **Where to get it**: https://dashboard.stripe.com/apikeys
- **Required**: Yes (Build-time - embedded in build)
- **Used for**: Client-side Stripe.js initialization

#### `STRIPE_PRICE_ID_MONTHLY` (Optional)
- **Description**: Stripe Price ID for monthly subscription plan
- **Required**: No (can be set in admin panel instead)
- **Used for**: Monthly subscription checkout

#### `STRIPE_PRICE_ID_PLATINUM` (Optional)
- **Description**: Stripe Price ID for platinum subscription plan
- **Required**: No (can be set in admin panel instead)
- **Used for**: Platinum subscription checkout

#### `STRIPE_PRICE_ID_ANNUAL` (Optional)
- **Description**: Stripe Price ID for annual subscription plan
- **Required**: No (can be set in admin panel instead)
- **Used for**: Annual subscription checkout

#### `STRIPE_TEST_MODE` (Optional)
- **Description**: Enable Stripe test mode
- **Format**: `true` or `false`
- **Required**: No (defaults to production mode)
- **Used for**: Testing payments without real charges

---

### 3. AWS S3 Configuration (REQUIRED for file uploads)

#### `AWS_S3_BUCKET_NAME`
- **Description**: AWS S3 bucket name for file storage
- **Required**: Yes (Runtime)
- **Used for**: Storing uploaded files, images, and assets

#### `AWS_S3_REGION`
- **Description**: AWS region where S3 bucket is located
- **Format**: e.g., `us-east-1`, `eu-west-1`
- **Required**: Yes (Runtime)
- **Used for**: S3 client configuration and image domain whitelisting

#### `AWS_ACCESS_KEY_ID`
- **Description**: AWS access key ID
- **Where to get it**: AWS IAM Console → Users → Security Credentials
- **Required**: Yes (Runtime)
- **Used for**: Authenticating S3 API requests

#### `AWS_SECRET_ACCESS_KEY`
- **Description**: AWS secret access key
- **Where to get it**: AWS IAM Console → Users → Security Credentials
- **Required**: Yes (Runtime)
- **Used for**: Authenticating S3 API requests

---

### 4. Calendly Integration (REQUIRED for booking)

#### `CALENDLY_ACCESS_TOKEN`
- **Description**: Your Calendly Personal Access Token
- **Where to get it**: https://calendly.com/integrations/api_webhooks
- **Required**: Yes (Runtime)
- **Used for**: All Calendly API calls (fetching events, availability, etc.)

#### `CALENDLY_ANALYST_1_URI`
- **Description**: Assassin's Calendly User URI (Analyst ID: 1)
- **Format**: `https://api.calendly.com/users/XXXXXXXXXXXXXXXX`
- **Required**: Yes (Runtime - for Assassin's meeting bookings)
- **Used for**: Fetching Assassin's event types and availability

---

### 5. Binance Portfolio Integration (OPTIONAL)

#### `BINANCE_CREDENTIALS_ENCRYPTION_KEY` ⚠️ **CRITICAL IF USING BINANCE**
- **Description**: 32-byte encryption key for encrypting Binance API credentials at rest
- **Format**: Base64, hex, or 32-character UTF-8 string
- **Required**: Yes (if using Binance portfolio integration)
- **How to generate**: 
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- **Used for**: Encrypting user Binance API keys and secrets before storing in MongoDB
- **⚠️ IMPORTANT**: This key must be the same across all deployments/environments if you want to decrypt existing credentials

#### `BINANCE_API_BASE_URL` (Optional)
- **Description**: Override default Binance API base URL
- **Format**: e.g., `https://testnet.binance.vision`
- **Required**: No
- **Used for**: Using Binance testnet

#### `BINANCE_USE_TESTNET_DEFAULT` (Optional)
- **Description**: Default to testnet for new credentials
- **Format**: `true` or `false`
- **Required**: No
- **Used for**: Testing Binance integration

---

### 6. Email Configuration (REQUIRED for email verification/password reset)

#### `COLLAB_EMAIL`
- **Description**: Email address used as sender for transactional emails
- **Format**: `your-email@example.com`
- **Required**: Yes (Runtime)
- **Used for**: Sending verification emails, password reset emails

#### `SMTP_HOST`
- **Description**: SMTP server hostname
- **Format**: e.g., `smtp.gmail.com`, `smtp-mail.outlook.com`
- **Required**: Yes (Runtime)
- **Used for**: Sending emails via SMTP

#### `SMTP_PORT`
- **Description**: SMTP server port
- **Format**: Usually `587` (TLS) or `465` (SSL)
- **Required**: Yes (Runtime)
- **Used for**: SMTP connection

#### `SMTP_SECURE`
- **Description**: Use secure connection (TLS/SSL)
- **Format**: `false` for TLS (port 587), `true` for SSL (port 465)
- **Required**: Yes (Runtime)
- **Used for**: SMTP security configuration

#### `SMTP_USER`
- **Description**: SMTP authentication username (usually your email)
- **Format**: `your-email@gmail.com`
- **Required**: Yes (Runtime)
- **Used for**: SMTP authentication

#### `SMTP_PASS`
- **Description**: SMTP authentication password or app password
- **Required**: Yes (Runtime)
- **Used for**: SMTP authentication
- **Note**: For Gmail, use an App Password (not your regular password)

---

### 7. Application Configuration (OPTIONAL)

#### `NEXT_PUBLIC_BASE_URL`
- **Description**: Base URL of your application
- **Format**: `https://yourdomain.com` (no trailing slash)
- **Required**: No (auto-detected from Vercel)
- **Used for**: Generating absolute URLs in emails and redirects
- **Note**: Vercel automatically sets `VERCEL_URL` - only set this if you need a custom domain

#### `NODE_ENV`
- **Description**: Node.js environment
- **Format**: `production`, `development`, or `test`
- **Required**: No (automatically set by Vercel)
- **Note**: Vercel sets this automatically - don't override unless needed

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

Before deploying to Vercel, ensure ALL required variables are set:

### Critical (Required for Build & Runtime)
- [ ] `MONGODB_URI` - Database connection string
- [ ] `JWT_SECRET` - Authentication secret

### Payment Integration (Required for payments)
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### File Storage (Required for uploads)
- [ ] `AWS_S3_BUCKET_NAME` - S3 bucket name
- [ ] `AWS_S3_REGION` - AWS region
- [ ] `AWS_ACCESS_KEY_ID` - AWS access key
- [ ] `AWS_SECRET_ACCESS_KEY` - AWS secret key

### Calendly Integration (Required for booking)
- [ ] `CALENDLY_ACCESS_TOKEN` - Calendly API token
- [ ] `CALENDLY_ANALYST_1_URI` - Analyst Calendly URI

### Email (Required for verification/reset)
- [ ] `COLLAB_EMAIL` - Sender email address
- [ ] `SMTP_HOST` - SMTP server
- [ ] `SMTP_PORT` - SMTP port
- [ ] `SMTP_SECURE` - Use secure connection
- [ ] `SMTP_USER` - SMTP username
- [ ] `SMTP_PASS` - SMTP password/app password

### Optional (If using features)
- [ ] `BINANCE_CREDENTIALS_ENCRYPTION_KEY` - If using Binance integration
- [ ] `STRIPE_PRICE_ID_*` - If not set in admin panel
- [ ] `NEXT_PUBLIC_BASE_URL` - If using custom domain

### Deployment Steps
- [ ] All variables are enabled for **Production** environment
- [ ] All variables are enabled for **Preview** environment (for PR previews)
- [ ] Application has been redeployed after adding variables
- [ ] Test the application on the deployed site
- [ ] Test payment flow (if applicable)
- [ ] Test Calendly booking (if applicable)
- [ ] Test email verification/reset (if applicable)

---

## Additional Resources

- [Calendly API Documentation](https://developer.calendly.com/api-docs)
- [Vercel Environment Variables Guide](https://vercel.com/docs/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

