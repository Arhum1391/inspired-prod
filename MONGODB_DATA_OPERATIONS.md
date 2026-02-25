# MongoDB Data Operations Guide

This guide documents the standard patterns for saving and fetching user-specific data from MongoDB in this codebase. **Always use `userId` (MongoDB `_id`) as the differentiating factor, NOT email.**

## Table of Contents
- [Authentication & Getting User ID](#authentication--getting-user-id)
- [Saving User Data](#saving-user-data)
- [Fetching User Data](#fetching-user-data)
- [Updating User Data](#updating-user-data)
- [Deleting User Data](#deleting-user-data)
- [Best Practices](#best-practices)
- [Complete Examples](#complete-examples)

---

## Authentication & Getting User ID

### Method 1: Using Helper Function (Recommended)

The easiest way to get the authenticated user ID:

```typescript
import { requireAuth } from '@/lib/authHelpers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Get authenticated userId
  const { error, userId } = await requireAuth(request);
  
  if (error || !userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // userId is now available as a string (MongoDB _id)
  // Use it to save/fetch user-specific data
}
```

### Method 2: Manual Token Verification

If you need more control:

```typescript
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('user-auth-token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  // decoded.userId is the MongoDB _id as a string
  const userId = decoded.userId;
}
```

---

## Saving User Data

### Basic Save Pattern

```typescript
import { requireAuth } from '@/lib/authHelpers';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { error, userId } = await requireAuth(request);
    if (error || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Get data from request
    const { dataField1, dataField2 } = await request.json();

    // 3. Connect to database
    const db = await getDatabase();
    const collection = db.collection('your_collection_name');

    // 4. Save data with userId
    const newDocument = {
      userId: new ObjectId(userId), // Convert string to ObjectId
      dataField1,
      dataField2,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newDocument);

    if (result.insertedId) {
      return NextResponse.json(
        { 
          success: true, 
          id: result.insertedId.toString(),
          message: 'Data saved successfully' 
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to save data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Save with Duplicate Check

```typescript
// Check if user already has this data before saving
const existing = await collection.findOne({
  userId: new ObjectId(userId),
  dataField1: dataField1 // or any unique constraint
});

if (existing) {
  return NextResponse.json(
    { error: 'Data already exists' },
    { status: 409 }
  );
}

// Proceed with insertOne...
```

---

## Fetching User Data

### Fetch Single Document

```typescript
import { requireAuth } from '@/lib/authHelpers';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { error, userId } = await requireAuth(request);
    if (error || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Connect to database
    const db = await getDatabase();
    const collection = db.collection('your_collection_name');

    // 3. Find user's data
    const document = await collection.findOne({
      userId: new ObjectId(userId)
    });

    if (!document) {
      return NextResponse.json(
        { data: null },
        { status: 200 }
      );
    }

    // 4. Return data (exclude sensitive fields if needed)
    return NextResponse.json({
      data: {
        id: document._id.toString(),
        dataField1: document.dataField1,
        dataField2: document.dataField2,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Fetch Multiple Documents (Array)

```typescript
// Fetch all documents for a user
const documents = await collection.find({
  userId: new ObjectId(userId)
}).toArray();

// With sorting (newest first)
const documents = await collection.find({
  userId: new ObjectId(userId)
}).sort({ createdAt: -1 }).toArray();

// With limit
const documents = await collection.find({
  userId: new ObjectId(userId)
}).sort({ createdAt: -1 }).limit(10).toArray();

// Return formatted
return NextResponse.json({
  data: documents.map(doc => ({
    id: doc._id.toString(),
    dataField1: doc.dataField1,
    dataField2: doc.dataField2,
    createdAt: doc.createdAt
  }))
});
```

### Fetch with Additional Filters

```typescript
// Find with multiple conditions
const document = await collection.findOne({
  userId: new ObjectId(userId),
  status: 'active',
  category: 'premium'
});

// Find with date range
const documents = await collection.find({
  userId: new ObjectId(userId),
  createdAt: {
    $gte: new Date('2024-01-01'),
    $lte: new Date('2024-12-31')
  }
}).toArray();
```

---

## Updating User Data

### Update Single Document

```typescript
import { requireAuth } from '@/lib/authHelpers';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { error, userId } = await requireAuth(request);
    if (error || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Get update data
    const { dataField1, dataField2 } = await request.json();

    // 3. Connect to database
    const db = await getDatabase();
    const collection = db.collection('your_collection_name');

    // 4. Update document (ensure it belongs to user)
    const result = await collection.updateOne(
      { 
        userId: new ObjectId(userId),
        // Add document ID if updating specific document
        // _id: new ObjectId(documentId)
      },
      {
        $set: {
          dataField1,
          dataField2,
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Data updated successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Document not found or no changes made' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Update Specific Document by ID

```typescript
// Get document ID from request params or body
const { documentId } = await request.json();

// Update only if document belongs to user
const result = await collection.updateOne(
  { 
    _id: new ObjectId(documentId),
    userId: new ObjectId(userId) // Security: ensure ownership
  },
  {
    $set: {
      dataField1,
      updatedAt: new Date()
    }
  }
);
```

### Upsert (Update or Insert)

```typescript
// Update if exists, insert if not
const result = await collection.updateOne(
  { userId: new ObjectId(userId) },
  {
    $set: {
      dataField1,
      dataField2,
      updatedAt: new Date()
    },
    $setOnInsert: {
      createdAt: new Date()
    }
  },
  { upsert: true } // Creates document if it doesn't exist
);
```

---

## Deleting User Data

### Delete Single Document

```typescript
import { requireAuth } from '@/lib/authHelpers';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { error, userId } = await requireAuth(request);
    if (error || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Get document ID
    const { documentId } = await request.json();

    // 3. Connect to database
    const db = await getDatabase();
    const collection = db.collection('your_collection_name');

    // 4. Delete only if document belongs to user (security!)
    const result = await collection.deleteOne({
      _id: new ObjectId(documentId),
      userId: new ObjectId(userId) // Always verify ownership
    });

    if (result.deletedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Data deleted successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Delete All User's Documents

```typescript
// Delete all documents for a user
const result = await collection.deleteMany({
  userId: new ObjectId(userId)
});

return NextResponse.json({
  success: true,
  deletedCount: result.deletedCount
});
```

---

## Best Practices

### ✅ DO

1. **Always use `userId` (MongoDB `_id`) as the differentiating factor**
   - Never use email for user identification
   - `userId` is immutable and available from JWT token

2. **Always verify ownership before update/delete**
   ```typescript
   // ✅ Good: Verify ownership
   await collection.updateOne({
     _id: new ObjectId(documentId),
     userId: new ObjectId(userId) // Security check
   }, { $set: { ... } });
   ```

3. **Convert userId string to ObjectId for MongoDB queries**
   ```typescript
   userId: new ObjectId(userId) // Always convert
   ```

4. **Include timestamps**
   ```typescript
   createdAt: new Date(),
   updatedAt: new Date()
   ```

5. **Handle errors gracefully**
   ```typescript
   try {
     // database operations
   } catch (error) {
     console.error('Error:', error);
     return NextResponse.json(
       { error: 'Internal server error' },
       { status: 500 }
     );
   }
   ```

6. **Return consistent response format**
   ```typescript
   // Success
   return NextResponse.json({ success: true, data: ... }, { status: 201 });
   
   // Error
   return NextResponse.json({ error: 'Message' }, { status: 400 });
   ```

### ❌ DON'T

1. **Don't use email for user identification**
   ```typescript
   // ❌ Bad
   await collection.findOne({ email: userEmail });
   
   // ✅ Good
   await collection.findOne({ userId: new ObjectId(userId) });
   ```

2. **Don't skip ownership verification**
   ```typescript
   // ❌ Bad: No ownership check
   await collection.updateOne(
     { _id: new ObjectId(documentId) },
     { $set: { ... } }
   );
   
   // ✅ Good: Verify ownership
   await collection.updateOne(
     { _id: new ObjectId(documentId), userId: new ObjectId(userId) },
     { $set: { ... } }
   );
   ```

3. **Don't expose sensitive data**
   ```typescript
   // ❌ Bad: Return password
   return NextResponse.json({ user: { email, password } });
   
   // ✅ Good: Exclude sensitive fields
   return NextResponse.json({ user: { email, name } });
   ```

---

## Complete Examples

### Example 1: Save User Preferences

```typescript
// src/app/api/user/preferences/route.ts
import { requireAuth } from '@/lib/authHelpers';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { error, userId } = await requireAuth(request);
    if (error || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { theme, language, notifications } = await request.json();
    const db = await getDatabase();
    const collection = db.collection('user_preferences');

    // Upsert: update if exists, create if not
    const result = await collection.updateOne(
      { userId: new ObjectId(userId) },
      {
        $set: {
          theme,
          language,
          notifications,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Preferences saved'
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { error, userId } = await requireAuth(request);
    if (error || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('user_preferences');

    const preferences = await collection.findOne({
      userId: new ObjectId(userId)
    });

    return NextResponse.json({
      preferences: preferences || null
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Example 2: Save and Fetch User Notes

```typescript
// src/app/api/notes/route.ts
import { requireAuth } from '@/lib/authHelpers';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// POST: Create a note
export async function POST(request: NextRequest) {
  try {
    const { error, userId } = await requireAuth(request);
    if (error || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { title, content } = await request.json();
    const db = await getDatabase();
    const collection = db.collection('notes');

    const note = {
      userId: new ObjectId(userId),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(note);

    return NextResponse.json({
      success: true,
      note: {
        id: result.insertedId.toString(),
        ...note,
        userId: userId // Return as string for client
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Fetch all user's notes
export async function GET(request: NextRequest) {
  try {
    const { error, userId } = await requireAuth(request);
    if (error || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('notes');

    const notes = await collection.find({
      userId: new ObjectId(userId)
    }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      notes: notes.map(note => ({
        id: note._id.toString(),
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Example 3: Update and Delete Note

```typescript
// src/app/api/notes/[id]/route.ts
import { requireAuth } from '@/lib/authHelpers';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// PUT: Update a note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, userId } = await requireAuth(request);
    if (error || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { title, content } = await request.json();
    const db = await getDatabase();
    const collection = db.collection('notes');

    const result = await collection.updateOne(
      {
        _id: new ObjectId(params.id),
        userId: new ObjectId(userId) // Verify ownership
      },
      {
        $set: {
          title,
          content,
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Note updated'
    });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, userId } = await requireAuth(request);
    if (error || !userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('notes');

    const result = await collection.deleteOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(userId) // Verify ownership
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Note deleted'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Quick Reference

### Imports Needed

```typescript
import { requireAuth } from '@/lib/authHelpers';  // For easy auth
import { verifyToken } from '@/lib/auth';         // For manual auth
import { getDatabase } from '@/lib/mongodb';       // Database connection
import { ObjectId } from 'mongodb';                // ObjectId conversion
```

### Common Patterns

```typescript
// 1. Authenticate
const { error, userId } = await requireAuth(request);
if (error || !userId) return error response;

// 2. Get database
const db = await getDatabase();
const collection = db.collection('collection_name');

// 3. Query with userId
const docs = await collection.find({
  userId: new ObjectId(userId)
}).toArray();

// 4. Save with userId
await collection.insertOne({
  userId: new ObjectId(userId),
  // ... other fields
});

// 5. Update with ownership check
await collection.updateOne(
  { _id: new ObjectId(id), userId: new ObjectId(userId) },
  { $set: { ... } }
);
```

---

## Database Collections Reference

Current collections in use:
- `public_users` - User accounts (email, password, name)
- `subscriptions` - User subscriptions (linked by userId)
- `payment_methods` - Payment methods (linked by userId)
- `billing_history` - Billing records (linked by userId)
- `bookings` - Calendly bookings (linked by userId as string)
- `bootcamp_registrations` - Bootcamp registrations (linked by userId as string)
- `subscribers` - Newsletter subscribers (by email, not userId)

---

**Remember: Always use `userId` (MongoDB `_id`) to differentiate user data, never email!**

