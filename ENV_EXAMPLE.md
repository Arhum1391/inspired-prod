# Environment Variables Example

**⚠️ IMPORTANT: This system now uses MongoDB for storing analyst Calendly credentials instead of environment variables!**

## Required Environment Variables:

```env
# Database Configuration (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inspired-analyst

# Calendly Configuration (OPTIONAL - for team setup page only)
CALENDLY_ACCESS_TOKEN=eyJraWQiOi...

# Email Configuration (REQUIRED for email verification and password reset)
COLLAB_EMAIL=your-email@example.com

# SMTP Configuration (REQUIRED for email verification and password reset - choose one option below)
# Option 1: Gmail/Google Workspace
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
# Note: For Gmail, you need to use an App Password, not your regular password
# Generate one at: https://myaccount.google.com/apppasswords

# Option 2: Outlook/Office 365
# SMTP_HOST=smtp-mail.outlook.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@outlook.com
# SMTP_PASS=your-password

# Option 3: Custom SMTP server
# SMTP_HOST=your-smtp-server.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-username
# SMTP_PASS=your-password

# Base URL (OPTIONAL - defaults to localhost:3000 in development, VERCEL_URL in production)
# Set this if you need a custom base URL for email links
# NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## ❌ NO LONGER NEEDED:

The following environment variables are **NO LONGER USED**:
- `CALENDLY_ANALYST_X_URI`
- `CALENDLY_ANALYST_X_TOKEN` 
- `NEXT_PUBLIC_CALENDLY_ANALYST_X_ENABLED`

## ✅ NEW APPROACH:

All analyst Calendly credentials are now stored in MongoDB in the `analysts` collection. See `MONGODB_SCHEMA.md` for the complete database schema and setup instructions.

## Setup Instructions:

1. **Set up MongoDB**: Ensure your `MONGODB_URI` is configured
2. **Create analysts collection**: Follow the schema in `MONGODB_SCHEMA.md`
3. **Add analyst data**: Insert analyst documents with Calendly credentials
4. **Test integration**: The system will automatically detect which analysts have Calendly

## How to Add Analyst Calendly Credentials:

### Method 1: Direct Database Insert
```javascript
db.analysts.insertOne({
  analystId: 1,
  name: "Assassin",
  role: "Senior Trading Analyst",
  email: "assassin@inspiredanalyst.com",
  calendly: {
    enabled: true,
    userUri: "https://api.calendly.com/users/803f1807-36e1-47fe-a6d5-24b2c866f887",
    accessToken: "eyJraWQiOi...",
    lastUpdated: new Date()
  },
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Method 2: Use Setup Pages
- Use `/admin/calendly-setup` to get URIs
- Use `/admin/calendly-team-setup` for organization-wide setup
- Manually insert the data into MongoDB

## Benefits of Database Approach:
- **Dynamic Management**: Add/remove analysts without code changes
- **Centralized Storage**: All analyst data in one place
- **Easy Updates**: Update credentials through database operations
- **Scalable**: No environment variable limits
- **Audit Trail**: Track when credentials were last updated
- **Flexible**: Enable/disable Calendly per analyst easily
