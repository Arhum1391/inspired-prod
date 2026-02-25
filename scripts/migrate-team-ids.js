const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=');
        if (key && value) {
          process.env[key] = value;
        }
      }
    });
  }
}

async function migrateTeamIds() {
  // Load environment variables
  loadEnvFile();
  
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is not set');
    console.log('Please make sure you have a .env.local file with MONGODB_URI=your_connection_string');
    console.log('Or set the environment variable directly: MONGODB_URI=your_connection_string node scripts/migrate-team-ids.js');
    process.exit(1);
  }
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('inspired-analyst');
    const collection = db.collection('team');
    
    console.log('🔄 Starting team ID migration...');
    
    // Get all team members
    const teamMembers = await collection.find({}).toArray();
    console.log(`📊 Found ${teamMembers.length} team members to migrate`);
    
    // Convert each member's ID from string to number
    for (const member of teamMembers) {
      const oldId = member.id;
      const newId = parseInt(oldId);
      
      if (isNaN(newId)) {
        console.log(`⚠️  Skipping member ${member.name} - invalid ID: ${oldId}`);
        continue;
      }
      
      // Update the member with numeric ID
      const result = await collection.updateOne(
        { _id: member._id },
        { 
          $set: { 
            id: newId,
            updatedAt: new Date()
          }
        }
      );
      
      if (result.modifiedCount === 1) {
        console.log(`✅ Updated ${member.name}: "${oldId}" → ${newId}`);
      } else {
        console.log(`❌ Failed to update ${member.name}`);
      }
    }
    
    // Verify the migration
    const updatedMembers = await collection.find({}).toArray();
    console.log('\n📋 Migration Results:');
    updatedMembers.forEach(member => {
      console.log(`  ${member.name}: ID ${member.id} (type: ${typeof member.id})`);
    });
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.close();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateTeamIds();
}

module.exports = { migrateTeamIds };
