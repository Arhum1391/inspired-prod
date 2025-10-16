// Script to create analyst documents in MongoDB
// Run this with: node scripts/create-analysts.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function createAnalysts() {
  let client;
  
  try {
    // Connect to MongoDB using the URI from .env.local
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    console.log('Connected to MongoDB');
    
    const db = client.db('inspired-analyst');
    const collection = db.collection('analysts');
    
    // Check if analysts already exist
    const existingCount = await collection.countDocuments();
    console.log(`Found ${existingCount} existing analysts`);
    
    // Get the existing Assassin document to copy Calendly values
    const assassinDoc = await collection.findOne({ analystId: 1 });
    
    if (!assassinDoc) {
      console.log('❌ Assassin document (analystId: 1) not found. Please create it first.');
      return;
    }
    
    console.log('📋 Found Assassin document, copying Calendly values...');
    
    // Create analyst documents with copied Calendly values
    const analysts = [
      {
        analystId: 0,
        name: "Analyst 0",
        calendly: {
          enabled: assassinDoc.calendly.enabled,
          userUri: assassinDoc.calendly.userUri,
          accessToken: assassinDoc.calendly.accessToken
        }
      },
      {
        analystId: 2,
        name: "Analyst 2",
        calendly: {
          enabled: assassinDoc.calendly.enabled,
          userUri: assassinDoc.calendly.userUri,
          accessToken: assassinDoc.calendly.accessToken
        }
      },
      {
        analystId: 3,
        name: "Analyst 3",
        calendly: {
          enabled: assassinDoc.calendly.enabled,
          userUri: assassinDoc.calendly.userUri,
          accessToken: assassinDoc.calendly.accessToken
        }
      },
      {
        analystId: 4,
        name: "Analyst 4",
        calendly: {
          enabled: assassinDoc.calendly.enabled,
          userUri: assassinDoc.calendly.userUri,
          accessToken: assassinDoc.calendly.accessToken
        }
      },
      {
        analystId: 5,
        name: "Analyst 5",
        calendly: {
          enabled: assassinDoc.calendly.enabled,
          userUri: assassinDoc.calendly.userUri,
          accessToken: assassinDoc.calendly.accessToken
        }
      },
      {
        analystId: 6,
        name: "Analyst 6",
        calendly: {
          enabled: assassinDoc.calendly.enabled,
          userUri: assassinDoc.calendly.userUri,
          accessToken: assassinDoc.calendly.accessToken
        }
      },
      {
        analystId: 7,
        name: "Analyst 7",
        calendly: {
          enabled: assassinDoc.calendly.enabled,
          userUri: assassinDoc.calendly.userUri,
          accessToken: assassinDoc.calendly.accessToken
        }
      }
    ];
    
    // Insert only if they don't already exist
    for (const analyst of analysts) {
      const existing = await collection.findOne({ analystId: analyst.analystId });
      if (!existing) {
        await collection.insertOne(analyst);
        console.log(`✅ Created analyst ${analyst.analystId}: ${analyst.name}`);
      } else {
        console.log(`⚠️  Analyst ${analyst.analystId} already exists`);
      }
    }
    
    // Show final count
    const finalCount = await collection.countDocuments();
    console.log(`\n🎉 Total analysts in database: ${finalCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
  }
}

// Run the script
createAnalysts();
