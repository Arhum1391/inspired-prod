/* eslint-disable no-console */
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const DATABASE_NAME = 'inspired-analyst';
const COLLECTION_NAME = 'reviews';

const reviewValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'analystId',
      'analystName',
      'reviewerName',
      'rating',
      'comment',
      'reviewDate',
      'status',
      'createdAt',
      'updatedAt',
    ],
    properties: {
      analystId: {
        bsonType: ['int', 'long', 'double'],
        description: 'Numeric analyst identifier',
      },
      analystName: {
        bsonType: 'string',
        description: 'Analyst name copied from team collection',
      },
      reviewerName: {
        bsonType: 'string',
        minLength: 2,
        description: 'Name of the user leaving the review',
      },
      rating: {
        bsonType: ['int', 'double'],
        minimum: 1,
        maximum: 5,
        description: 'Numeric rating between 1 and 5',
      },
      comment: {
        bsonType: 'string',
        minLength: 5,
        description: 'Free form review content',
      },
      reviewDate: {
        bsonType: 'string',
        description: 'User supplied date string (e.g. 2025-11-17)',
      },
      status: {
        enum: ['pending', 'approved', 'rejected'],
        description: 'Moderation status',
      },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
      approvedAt: { bsonType: 'date' },
      rejectedAt: { bsonType: 'date' },
    },
  },
};

async function createReviewsCollection() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env.local');
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DATABASE_NAME);
    const existingCollections = await db.listCollections({ name: COLLECTION_NAME }).toArray();

    if (existingCollections.length === 0) {
      await db.createCollection(COLLECTION_NAME, {
        validator: reviewValidator,
        validationLevel: 'moderate',
      });
      console.log(`📁 Created "${COLLECTION_NAME}" collection with validator`);
    } else {
      await db.command({
        collMod: COLLECTION_NAME,
        validator: reviewValidator,
        validationLevel: 'moderate',
      }).catch((error) => {
        console.warn('⚠️ Unable to update validator via collMod:', error.message);
      });
      console.log(`ℹ️ "${COLLECTION_NAME}" collection already exists. Validator updated if possible.`);
    }

    const collection = db.collection(COLLECTION_NAME);
    await collection.createIndex({ analystId: 1, status: 1, createdAt: -1 });
    await collection.createIndex({ status: 1, createdAt: -1 });
    await collection.createIndex({ createdAt: -1 });

    console.log('🏗️ Indexes ensured on analystId/status and createdAt');
    console.log('🎉 Reviews collection is ready for use!');
  } catch (error) {
    console.error('❌ Failed to prepare reviews collection:', error);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

createReviewsCollection();

