const { MongoClient } = require('mongodb');

// Replace with your MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-atlas-connection-string';
const DB_NAME = 'inspired-analyst';
const OLD_COLLECTION = 'newsletter';
const NEW_COLLECTION = 'subscribers';

async function renameCollection() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db(DB_NAME);
    
    // Check if the old collection exists
    const collections = await db.listCollections().toArray();
    const oldCollectionExists = collections.some(col => col.name === OLD_COLLECTION);
    const newCollectionExists = collections.some(col => col.name === NEW_COLLECTION);
    
    if (!oldCollectionExists) {
      console.log(`❌ Collection "${OLD_COLLECTION}" does not exist`);
      return;
    }
    
    if (newCollectionExists) {
      console.log(`❌ Collection "${NEW_COLLECTION}" already exists`);
      return;
    }
    
    // Rename the collection
    console.log(`🔄 Renaming collection "${OLD_COLLECTION}" to "${NEW_COLLECTION}"...`);
    await db.collection(OLD_COLLECTION).rename(NEW_COLLECTION);
    
    console.log(`✅ Successfully renamed collection "${OLD_COLLECTION}" to "${NEW_COLLECTION}"`);
    
    // Verify the rename
    const updatedCollections = await db.listCollections().toArray();
    const renamedCollectionExists = updatedCollections.some(col => col.name === NEW_COLLECTION);
    
    if (renamedCollectionExists) {
      console.log(`✅ Verification successful: Collection "${NEW_COLLECTION}" now exists`);
    } else {
      console.log(`❌ Verification failed: Collection "${NEW_COLLECTION}" not found`);
    }
    
  } catch (error) {
    console.error('❌ Error renaming collection:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB Atlas');
  }
}

// Run the script
renameCollection();
