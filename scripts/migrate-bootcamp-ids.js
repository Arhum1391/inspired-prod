const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Try to load .env.local file manually (if dotenv is not available)
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  // Ignore errors loading .env.local
}

// MongoDB connection string from environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  console.error('Please set MONGODB_URI in your .env.local file or as an environment variable.');
  process.exit(1);
}

// Extract database name from URI or use default
let DB_NAME = 'inspired-analyst';
try {
  const url = new URL(MONGODB_URI);
  DB_NAME = url.pathname.slice(1) || 'inspired-analyst';
} catch (e) {
  // If URL parsing fails, use default
  console.warn('Could not parse MongoDB URI, using default database name:', DB_NAME);
}

async function migrateBootcampIds() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('bootcamps');

    // Get all bootcamps sorted by creation date (oldest first) to maintain order
    const bootcamps = await collection.find({}).sort({ createdAt: 1 }).toArray();
    console.log(`Found ${bootcamps.length} bootcamps to migrate`);

    if (bootcamps.length === 0) {
      console.log('No bootcamps found. Migration complete.');
      return;
    }

    // Re-number all bootcamps sequentially starting from 1
    const migrations = [];
    let idCounter = 1;

    for (const bootcamp of bootcamps) {
      const oldId = bootcamp.id;
      const newId = idCounter.toString(); // Store as string for consistency
      
      // Only update if ID changed
      if (oldId !== newId) {
        migrations.push({
          oldId,
          newId,
          title: bootcamp.title
        });

        // Update the bootcamp with new ID
        await collection.updateOne(
          { _id: bootcamp._id },
          { $set: { id: newId, updatedAt: new Date() } }
        );

        console.log(`${idCounter}. "${bootcamp.title}" - ID changed from "${oldId}" to "${newId}"`);
      } else {
        console.log(`${idCounter}. "${bootcamp.title}" - ID already correct: "${oldId}"`);
      }
      
      idCounter++;
    }

    console.log('\nMigration Summary:');
    console.log(`Total bootcamps migrated: ${migrations.length}`);
    console.log('\nMigration details:');
    migrations.forEach(m => {
      console.log(`  - "${m.title}": ${m.oldId} → ${m.newId}`);
    });

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run migration
if (require.main === module) {
  migrateBootcampIds()
    .then(() => {
      console.log('Migration script finished');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateBootcampIds };

