/* eslint-disable no-console */
// Script to create or update the shariahTiles collection
// Run with: node scripts/create-shariah-tiles.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const seedTiles = [
  {
    slug: 'ethical-tech-fund',
    title: 'Ethical Tech Fund',
    category: 'Technology',
    description:
      'A collection of technology companies that meet strict ethical and Shariah compliance standards.',
    compliancePoints: [
      'Core business activities are permissible',
      'Debt ratio below 33% threshold',
      'Interest income less than 5% of total revenue',
      'Passes ethical business practices screening',
    ],
    footerLeft: 'Shariah Compliant',
    footerRight: 'May 15, 2023',
    ctaLabel: 'View Details',
    detailPath: '/shariah/ethical-tech-fund',
    lockedTitle: 'Preview Only',
    lockedDescription: 'Detailed Screening Available with Premium',
    analystNotes:
      'Ethical Tech Fund demonstrates strong adherence to Shariah principles, maintaining a clear focus on technology-driven solutions that align with ethical investment standards. The fund avoids exposure to interest-based financing, speculative instruments, and non-permissible income streams.',
    complianceMetrics: [
      {
        criteria: 'Debt to Market Cap',
        threshold: '< 33%',
        actual: '0%',
        comparisonType: 'less_than',
      },
      {
        criteria: 'Interest Income',
        threshold: '< 5%',
        actual: '0%',
        comparisonType: 'less_than',
      },
      {
        criteria: 'Business Activity',
        threshold: 'Halal',
        actual: 'Permissible',
        comparisonType: 'custom',
        customStatus: 'pass',
      },
      {
        criteria: 'Cash Holdings',
        threshold: '< 33%',
        actual: '12%',
        comparisonType: 'less_than',
      },
    ],
  },
  {
    slug: 'sustainable-investment-fund',
    title: 'Sustainable Investment Fund',
    category: 'Finance',
    description:
      'Investment portfolio focused on companies with environmental & social governance practices.',
    compliancePoints: [
      'Investments promote sustainability',
      'Positive impact on community',
      'Increased collaboration among local businesses',
      'Enhanced public spaces for community events',
    ],
    footerLeft: 'Ethically sound',
    footerRight: 'June 10, 2023',
    ctaLabel: 'View Details',
    detailPath: '/shariah/sustainable-investment-fund',
    lockedTitle: 'Preview Only',
    lockedDescription: 'Detailed Screening Available with Premium',
    analystNotes:
      'Sustainable Investment Fund demonstrates strong adherence to Shariah principles, maintaining a clear focus on companies with environmental and social governance practices that align with ethical investment standards. The fund avoids exposure to interest-based financing, speculative instruments, and non-permissible income streams.',
    complianceMetrics: [
      {
        criteria: 'Debt to Market Cap',
        threshold: '< 33%',
        actual: '8%',
        comparisonType: 'less_than',
      },
      {
        criteria: 'Interest Income',
        threshold: '< 5%',
        actual: '1%',
        comparisonType: 'less_than',
      },
      {
        criteria: 'Business Activity',
        threshold: 'Halal',
        actual: 'Ethical Finance',
        comparisonType: 'custom',
        customStatus: 'pass',
      },
      {
        criteria: 'Cash Holdings',
        threshold: '< 33%',
        actual: '15%',
        comparisonType: 'less_than',
      },
    ],
  },
  {
    slug: 'wellness-and-prevention-fund',
    title: 'Wellness and Prevention Fund',
    category: 'Healthcare',
    description:
      'A fund dedicated to healthcare companies that prioritize preventative care & wellness programs.',
    compliancePoints: [
      'Supports healthy lifestyle initiatives',
      'Focuses on prevention over treatment',
      'Emphasizes community engagement in health initiatives',
      'Promotes holistic wellness and lifestyle changes',
    ],
    footerLeft: 'Health-Focused Investing',
    footerRight: 'July 5, 2023',
    ctaLabel: 'View Details',
    detailPath: '/shariah/wellness-and-prevention-fund',
    lockedTitle: 'Preview Only',
    lockedDescription: 'Detailed Screening Available with Premium',
    analystNotes:
      'Wellness and Prevention Fund demonstrates strong adherence to Shariah principles, maintaining a clear focus on healthcare companies that prioritize preventative care and wellness programs, aligning with ethical investment standards. The fund avoids exposure to interest-based financing, speculative instruments, and non-permissible income streams.',
    complianceMetrics: [
      {
        criteria: 'Debt to Market Cap',
        threshold: '< 33%',
        actual: '5%',
        comparisonType: 'less_than',
      },
      {
        criteria: 'Interest Income',
        threshold: '< 5%',
        actual: '0%',
        comparisonType: 'less_than',
      },
      {
        criteria: 'Business Activity',
        threshold: 'Healthcare',
        actual: 'Preventative Care',
        comparisonType: 'custom',
        customStatus: 'pass',
      },
      {
        criteria: 'Cash Holdings',
        threshold: '< 33%',
        actual: '20%',
        comparisonType: 'less_than',
      },
    ],
  },
];

async function createShariahTiles() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined. Please set it in .env.local');
    process.exit(1);
  }

  let client;

  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('inspired-analyst');
    const collection = db.collection('shariahTiles');

    for (const tile of seedTiles) {
      const existing = await collection.findOne({ slug: tile.slug });
      if (existing) {
        await collection.updateOne(
          { _id: existing._id },
          {
            $set: {
              ...tile,
              compliancePoints: tile.compliancePoints.map((point) => point.trim()),
              updatedAt: new Date(),
            },
          }
        );
        console.log(`♻️  Updated existing tile: ${tile.slug}`);
      } else {
        await collection.insertOne({
          ...tile,
          compliancePoints: tile.compliancePoints.map((point) => point.trim()),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✨ Inserted new tile: ${tile.slug}`);
      }
    }

    const total = await collection.countDocuments();
    console.log(`\n📦 Total Shariah tiles in collection: ${total}`);
  } catch (error) {
    console.error('❌ Error while creating Shariah tiles:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

createShariahTiles();

