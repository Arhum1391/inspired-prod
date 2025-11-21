import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Validate required environment variables
if (!process.env.AWS_S3_BUCKET_NAME) {
  throw new Error('Please add AWS_S3_BUCKET_NAME to .env.local');
}

if (!process.env.AWS_S3_REGION) {
  throw new Error('Please add AWS_S3_REGION to .env.local');
}

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error('Please add AWS_ACCESS_KEY_ID to .env.local');
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('Please add AWS_SECRET_ACCESS_KEY to .env.local');
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

/**
 * Upload a file to S3
 * @param fileBuffer - The file buffer to upload
 * @param fileName - The name/path for the file in S3
 * @param contentType - MIME type of the file (e.g., 'image/png', 'image/jpeg')
 * @returns The S3 key (path) of the uploaded file
 */
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return fileName;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
}

/**
 * Delete a file from S3
 * @param fileName - The S3 key (path) of the file to delete
 */
export async function deleteFile(fileName: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
}

/**
 * Get a public URL for a file in S3
 * This assumes the bucket has public read access or the file has public ACL
 * @param fileName - The S3 key (path) of the file
 * @returns The public URL of the file
 */
export function getFileUrl(fileName: string): string {
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
}

/**
 * Get a presigned URL for a private file in S3
 * This URL will be valid for a specified duration (default 1 hour)
 * @param fileName - The S3 key (path) of the file
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns A presigned URL that provides temporary access to the file
 */
export async function getPresignedUrl(
  fileName: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('S3 presigned URL error:', error);
    throw new Error('Failed to generate presigned URL');
  }
}

