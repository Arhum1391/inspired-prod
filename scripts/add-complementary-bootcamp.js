// add-complementary-bootcamp.js
// Adds an existing user to a bootcamp with complimentary (free) access.
// Usage: node scripts/add-complementary-bootcamp.js

const path = require('path');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

// Load env
const envPaths = ['.env.local', '.env'];
for (const p of envPaths) {
  const full = path.resolve(process.cwd(), p);
  if (fs.existsSync(full)) {
    require('dotenv').config({ path: full });
    break;
  }
}
require('dotenv').config();

const EMAIL = 'zainahsan44@gmail.com';
const BOOTCAMP_ID = '7';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in .env or .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('inspired-analyst');

    // 1. Find user by email (case-insensitive)
    const user = await db.collection('public_users').findOne({
      email: { $regex: new RegExp(`^${EMAIL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });

    if (!user) {
      console.error(`❌ User not found: ${EMAIL}`);
      process.exit(1);
    }

    const userId = user._id;
    console.log(`✅ Found user: ${user.email} (${user.name || 'no name'}) - _id: ${userId}`);

    // 2. Check if bootcamp exists
    const bootcamp = await db.collection('bootcamps').findOne({ id: BOOTCAMP_ID });
    if (!bootcamp) {
      console.error(`❌ Bootcamp not found with id: ${BOOTCAMP_ID}`);
      process.exit(1);
    }
    console.log(`✅ Found bootcamp: ${bootcamp.title} (id: ${BOOTCAMP_ID})`);

    // 3. Check if already enrolled
    const existing = await db.collection('bootcamp_registrations').findOne({
      userId: userId,
      bootcampId: BOOTCAMP_ID
    });

    if (existing) {
      console.log(`ℹ️ User is already enrolled in this bootcamp. No action needed.`);
      process.exit(0);
    }

    // 4. Insert complimentary registration
    const registration = {
      userId: userId,
      stripeSessionId: `complementary_${Date.now()}_${user.email}`,
      bootcampId: BOOTCAMP_ID,
      customerEmail: user.email,
      customerName: user.name || '',
      notes: 'Complimentary access',
      amount: 0,
      currency: 'usd',
      paymentStatus: 'paid',
      status: 'confirmed',
      requiresSignup: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('bootcamp_registrations').insertOne(registration);
    console.log(`✅ Successfully added ${user.email} to bootcamp "${bootcamp.title}"`);
    console.log(`   Registration _id: ${result.insertedId}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
