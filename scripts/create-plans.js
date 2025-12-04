// Script to create plans collection in MongoDB
// Run this with: node scripts/create-plans.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function createPlans() {
  let client;
  
  try {
    // Connect to MongoDB using the URI from .env.local
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('inspired-analyst');
    const collection = db.collection('plans');
    
    // Check if plans already exist
    const existingCount = await collection.countDocuments();
    console.log(`Found ${existingCount} existing plans`);
    
    if (existingCount > 0) {
      console.log('⚠️  Plans collection already exists. Skipping creation.');
      console.log('   To reset, delete the plans collection first.');
      return;
    }
    
    // Create the three initial plans
    const plans = [
      {
        planId: 'monthly',
        name: 'Premium',
        description: 'Flexible access - monthly',
        priceAmount: 30,
        priceDisplay: '$30 USD/month',
        priceAccent: '#D4D737',
        billingNote: null,
        billingInterval: 'month',
        stripePriceId: process.env.STRIPE_PRICE_ID_MONTHLY || '',
        isPopular: false,
        isFree: false,
        isActive: true,
        features: [
          'Full research library',
          'Position Sizing Calculator (save scenarios)',
          'Portfolio analytics & history',
          'Shariah project details & screens',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        planId: 'platinum',
        name: 'Platinum',
        description: 'Bi-annual',
        priceAmount: 60,
        priceDisplay: '$60 USD/6 months',
        priceAccent: '#DE50EC',
        billingNote: '($120 USD /year)',
        billingInterval: '6 months',
        stripePriceId: process.env.STRIPE_PRICE_ID_PLATINUM || '',
        isPopular: false,
        isFree: false,
        isActive: true,
        features: [
          'Full research library',
          'Position Sizing Calculator (save scenarios)',
          'Portfolio analytics & history',
          'Shariah project details & screens',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        planId: 'annual',
        name: 'Diamond',
        description: 'Save 72% - annual',
        priceAmount: 100,
        priceDisplay: '$100 USD/year',
        priceAccent: '#05B0B3',
        billingNote: '($8.33 USD /month)',
        billingInterval: 'year',
        stripePriceId: process.env.STRIPE_PRICE_ID_ANNUAL || '',
        isPopular: true,
        isFree: false,
        isActive: true,
        features: [
          'Full research library',
          'Position Sizing Calculator (save scenarios)',
          'Portfolio analytics & history',
          'Shariah project details & screens',
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    // Insert plans
    const result = await collection.insertMany(plans);
    
    console.log(`✅ Successfully created ${result.insertedCount} plans:`);
    plans.forEach((plan, index) => {
      console.log(`   ${index + 1}. ${plan.name} (${plan.planId}) - $${plan.priceAmount}`);
    });
    
    // Create index on planId for faster lookups
    await collection.createIndex({ planId: 1 }, { unique: true });
    console.log('✅ Created unique index on planId');
    
  } catch (error) {
    console.error('❌ Error creating plans:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('✅ MongoDB connection closed');
    }
  }
}

// Run the script
createPlans()
  .then(() => {
    console.log('\n✅ Plans collection setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed to create plans:', error);
    process.exit(1);
  });

