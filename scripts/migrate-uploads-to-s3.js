/**
 * Migration script to move files from public/uploads to S3
 * 
 * Usage: node scripts/migrate-uploads-to-s3.js
 * 
 * This script will:
 * 1. Read all files from public/uploads directory
 * 2. Upload each file to S3
 * 3. Optionally delete local files after successful upload
 * 
 * Make sure your .env.local file has the S3 credentials configured.
 */

require('dotenv').config({ path: '.env.local' });
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs').promises;
const path = require('path');

// Validate environment variables
const requiredEnvVars = ['AWS_S3_BUCKET_NAME', 'AWS_S3_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    console.error('Please add it to your .env.local file');
    process.exit(1);
  }
}

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

async function migrateFiles() {
  try {
    console.log('🚀 Starting migration from local uploads to S3...\n');

    // Check if uploads directory exists
    try {
      await fs.access(UPLOADS_DIR);
    } catch (error) {
      console.log('ℹ️  No uploads directory found. Nothing to migrate.');
      return;
    }

    // Read all files from uploads directory
    const files = await fs.readdir(UPLOADS_DIR);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log('ℹ️  No image files found in uploads directory.');
      return;
    }

    console.log(`📁 Found ${imageFiles.length} file(s) to migrate\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const fileName of imageFiles) {
      try {
        const filePath = path.join(UPLOADS_DIR, fileName);
        const fileBuffer = await fs.readFile(filePath);
        
        // Determine content type based on file extension
        const ext = path.extname(fileName).toLowerCase();
        const contentTypeMap = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml',
        };
        const contentType = contentTypeMap[ext] || 'image/jpeg';

        // Upload to S3 with the same filename in uploads/ prefix
        const s3Key = `uploads/${fileName}`;
        
        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: fileBuffer,
          ContentType: contentType,
        });

        await s3Client.send(command);
        console.log(`✅ Uploaded: ${fileName} → s3://${BUCKET_NAME}/${s3Key}`);
        successCount++;

        // Optional: Delete local file after successful upload
        // Uncomment the next line if you want to delete local files after migration
        // await fs.unlink(filePath);
        // console.log(`   Deleted local file: ${fileName}`);

      } catch (error) {
        console.error(`❌ Error migrating ${fileName}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Successfully migrated: ${successCount} file(s)`);
    console.log(`   ❌ Errors: ${errorCount} file(s)`);
    console.log(`\n💡 Note: Local files were NOT deleted. Uncomment the delete line in the script if you want to remove them.`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateFiles();

