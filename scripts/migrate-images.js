const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function migrateImages() {
    try {
        console.log('🔄 Starting image migration...');
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db('inspired-analyst');
        const teamCollection = db.collection('team');
        const imagesCollection = db.collection('images');
        
        // Get all team members
        const teamMembers = await teamCollection.find({}).toArray();
        console.log(`📊 Found ${teamMembers.length} team members`);
        
        let migratedCount = 0;
        let skippedCount = 0;
        
        for (const member of teamMembers) {
            console.log(`\n🔄 Processing member: ${member.name} (ID: ${member.id})`);
            
            if (!member.image || member.image.trim() === '') {
                console.log('⏭️ Skipping - no image URL');
                skippedCount++;
                continue;
            }
            
            // Check if image already exists in images collection
            const existingImage = await imagesCollection.findOne({ memberId: member.id });
            if (existingImage) {
                console.log('⏭️ Skipping - image already exists in images collection');
                skippedCount++;
                continue;
            }
            
            // Create image document
            const imageDoc = {
                memberId: member.id,
                imageUrl: member.image,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            try {
                await imagesCollection.insertOne(imageDoc);
                console.log('✅ Migrated image for member:', member.name);
                migratedCount++;
            } catch (error) {
                console.error('❌ Failed to migrate image for member:', member.name, error);
            }
        }
        
        console.log('\n📊 Migration Summary:');
        console.log(`✅ Migrated: ${migratedCount} images`);
        console.log(`⏭️ Skipped: ${skippedCount} images`);
        console.log(`📊 Total processed: ${teamMembers.length} members`);
        
        // Verify migration
        const totalImages = await imagesCollection.countDocuments();
        console.log(`\n📊 Total images in images collection: ${totalImages}`);
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await client.close();
        console.log('🔌 Database connection closed');
    }
}

// Run migration
migrateImages().catch(console.error);
