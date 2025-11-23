// Script to create common MongoDB indexes for better query performance
// Run with: node scripts/create-indexes.js
//
// This script is SAFE to run multiple times and does NOT change application functionality.
// It only ensures that useful indexes exist on frequently queried fields.

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function createIndexes() {
  let client;

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not set in .env.local');
    }

    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('inspired-analyst');

    // Subscribers / newsletter emails
    try {
      await db.collection('subscribers').createIndex(
        { email: 1 },
        { unique: true, name: 'subscribers_email_unique' }
      );
      console.log('✅ Ensured index on subscribers.email');
    } catch (error) {
      console.warn('⚠️  Could not create index on subscribers.email:', error.message);
    }

    // Newsletter collection (if present, as per docs)
    try {
      await db.collection('newsletter').createIndex(
        { email: 1 },
        { unique: false, name: 'newsletter_email_idx' }
      );
      console.log('✅ Ensured index on newsletter.email');
    } catch (error) {
      console.warn('⚠️  Could not create index on newsletter.email:', error.message);
    }

    // Research reports: queried by date (sorted desc)
    try {
      await db.collection('researchReports').createIndex(
        { date: -1 },
        { name: 'researchReports_date_desc' }
      );
      console.log('✅ Ensured index on researchReports.date');
    } catch (error) {
      console.warn('⚠️  Could not create index on researchReports.date:', error.message);
    }

    // Bootcamps: filtered by isActive and sorted by createdAt
    try {
      await db.collection('bootcamps').createIndex(
        { isActive: 1, createdAt: 1 },
        { name: 'bootcamps_active_createdAt' }
      );
      console.log('✅ Ensured compound index on bootcamps.isActive + createdAt');
    } catch (error) {
      console.warn('⚠️  Could not create index on bootcamps.isActive/createdAt:', error.message);
    }

    // Reviews: queried by analystId, status, createdAt
    try {
      await db.collection('reviews').createIndex(
        { analystId: 1, status: 1, createdAt: -1 },
        { name: 'reviews_analyst_status_createdAt' }
      );
      console.log('✅ Ensured compound index on reviews.analystId + status + createdAt');
    } catch (error) {
      console.warn('⚠️  Could not create index on reviews collection:', error.message);
    }

    console.log('🎉 Index creation script completed');
  } catch (error) {
    console.error('❌ Error while creating indexes:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

createIndexes();


