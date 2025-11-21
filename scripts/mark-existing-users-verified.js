// mark-existing-users-verified.js
// Marks all legacy public_users as verified so the new email verification
// flow only applies to signups going forward.

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

const envLocalPath = path.resolve(process.cwd(), '.env.local');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config(); // falls back to .env
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not set. Please add it to your environment.');
  process.exit(1);
}

async function markExistingUsersVerified() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('inspired-analyst');
    const collection = db.collection('public_users');

    const filter = { emailVerified: { $ne: true } };
    const update = {
      $set: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null,
      },
    };

    const result = await collection.updateMany(filter, update);

    console.log(
      `✅ Marked ${result.modifiedCount} existing user(s) as verified.`
    );
    console.log(
      'Future signups will still require email verification; legacy users are now whitelisted.'
    );
  } catch (error) {
    console.error('❌ Failed to mark users as verified:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

markExistingUsersVerified();


