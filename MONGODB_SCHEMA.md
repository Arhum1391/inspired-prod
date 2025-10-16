# MongoDB Schema for Calendly Integration

## Collection: `analysts`

This collection stores analyst information including their Calendly credentials.

### Schema Structure:

```javascript
{
  _id: ObjectId,
  analystId: Number,           // Unique analyst ID (0-7)
  name: String,               // Analyst name
  calendly: {
    enabled: Boolean,         // Whether Calendly integration is enabled
    userUri: String,          // Calendly User URI (e.g., "https://api.calendly.com/users/...")
    accessToken: String       // Calendly Personal Access Token
  }
}
```

### Example Documents:

```javascript
// Analyst 1 (Assassin) - with Calendly integration
{
  _id: ObjectId("..."),
  analystId: 1,
  name: "Assassin",
  calendly: {
    enabled: true,
    userUri: "https://api.calendly.com/users/803f1807-36e1-47fe-a6d5-24b2c866f887",
    accessToken: "eyJraWQiOi..."
  }
}

// Analyst 2 - with Calendly integration
{
  _id: ObjectId("..."),
  analystId: 2,
  name: "John Doe",
  calendly: {
    enabled: true,
    userUri: "https://api.calendly.com/users/12345678-1234-1234-1234-123456789012",
    accessToken: "eyJraWQiOi..."
  }
}

// Analyst 3 - without Calendly integration
{
  _id: ObjectId("..."),
  analystId: 3,
  name: "Jane Smith",
  calendly: {
    enabled: false,
    userUri: null,
    accessToken: null
  }
}
```

## Collection: `team` (Existing)

Keep your existing team collection for basic analyst information:

```javascript
{
  _id: ObjectId,
  name: String,
  role: String,
  // ... other existing fields
}
```

## Indexes to Create:

```javascript
// Create index on analystId for fast lookups
db.analysts.createIndex({ "analystId": 1 }, { unique: true })

// Create index on calendly.enabled for filtering
db.analysts.createIndex({ "calendly.enabled": 1 })

// Create compound index for efficient queries
db.analysts.createIndex({ "analystId": 1, "calendly.enabled": 1 })
```

## Manual Data Insertion Commands:

### 1. Insert Assassin (Analyst ID: 1) - FIRST DOCUMENT:
```javascript
db.analysts.insertOne({
  analystId: 1,
  name: "Assassin",
  calendly: {
    enabled: true,
    userUri: "https://api.calendly.com/users/803f1807-36e1-47fe-a6d5-24b2c866f887",
    accessToken: "YOUR_ASSASSIN_ACCESS_TOKEN_HERE"
  }
})
```

### 2. Insert Additional Analysts:
```javascript
// Replace with actual values for each analyst
db.analysts.insertOne({
  analystId: 2,
  name: "Analyst Name",
  calendly: {
    enabled: true,
    userUri: "https://api.calendly.com/users/ANALYST_URI_HERE",
    accessToken: "ANALYST_ACCESS_TOKEN_HERE"
  }
})
```

### 3. Update Existing Analyst:
```javascript
db.analysts.updateOne(
  { analystId: 1 },
  {
    $set: {
      "calendly.userUri": "https://api.calendly.com/users/NEW_URI",
      "calendly.accessToken": "NEW_ACCESS_TOKEN"
    }
  }
)
```

### 4. Enable/Disable Calendly for Analyst:
```javascript
// Enable Calendly
db.analysts.updateOne(
  { analystId: 2 },
  {
    $set: {
      "calendly.enabled": true
    }
  }
)

// Disable Calendly
db.analysts.updateOne(
  { analystId: 2 },
  {
    $set: {
      "calendly.enabled": false
    }
  }
)
```

## Security Notes:

1. **Access Tokens**: Store securely in MongoDB with proper encryption
2. **Database Access**: Ensure proper authentication and authorization
3. **Backup**: Regular backups of analyst credentials
4. **Audit**: Log access to sensitive credential data

## Benefits of Database Approach:

1. **Dynamic Management**: Add/remove analysts without code changes
2. **Centralized Storage**: All analyst data in one place
3. **Easy Updates**: Update credentials through database operations
4. **Scalable**: No environment variable limits
5. **Audit Trail**: Track when credentials were last updated
6. **Flexible**: Enable/disable Calendly per analyst easily
