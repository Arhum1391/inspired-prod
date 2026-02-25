// Script to update existing plans price format from "per" to "/"
// Run this with: node scripts/update-price-format.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function updatePriceFormat() {
  let client;
  
  try {
    // Connect to MongoDB using the URI from .env.local
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('inspired-analyst');
    const collection = db.collection('plans');
    
    // Update priceDisplay format
    const updates = [
      {
        filter: { planId: 'monthly' },
        update: { $set: { priceDisplay: '$30 USD/month' } }
      },
      {
        filter: { planId: 'platinum' },
        update: { $set: { priceDisplay: '$60 USD/6 months' } }
      },
      {
        filter: { planId: 'annual' },
        update: { $set: { priceDisplay: '$100 USD/year' } }
      }
    ];
    
    for (const { filter, update } of updates) {
      const result = await collection.updateOne(filter, update);
      if (result.matchedCount > 0) {
        console.log(`✅ Updated ${filter.planId} price format`);
      } else {
        console.log(`⚠️  Plan ${filter.planId} not found`);
      }
    }
    
    console.log('✅ Price format update complete!');
    
  } catch (error) {
    console.error('❌ Error updating price format:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('✅ MongoDB connection closed');
    }
  }
}

// Run the script
updatePriceFormat()
  .then(() => {
    console.log('\n✅ Price format migration complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed to update price format:', error);
    process.exit(1);
  });

