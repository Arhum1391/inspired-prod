import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getPublicUserById, updatePublicUser } from '@/lib/auth';
import { uploadFile, getFileUrl, deleteFile } from '@/lib/s3';

async function uploadProfilePicture(req: NextRequest) {
  try {
    // Get token from cookie
    const token = req.cookies.get('user-auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Get current user to check for existing image
    const currentUser = await getPublicUserById(userId);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get file from form data
    const data = await req.formData();
    const file: File | null = data.get('image') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique S3 key
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3Key = `profile-pictures/${userId}-${timestamp}-${sanitizedFileName}`;

    // Upload file to S3
    await uploadFile(buffer, s3Key, file.type);

    // Get the public URL for the uploaded file
    const newImageUrl = getFileUrl(s3Key);

    // Delete old image from S3 if it exists
    if (currentUser.image) {
      try {
        // Extract S3 key from the old URL
        // URL format: https://bucket-name.s3.region.amazonaws.com/profile-pictures/...
        const urlParts = currentUser.image.split('/');
        const oldS3Key = urlParts.slice(3).join('/'); // Everything after the domain
        
        // Only delete if it's from our S3 bucket (safety check)
        if (oldS3Key.startsWith('profile-pictures/')) {
          await deleteFile(oldS3Key);
          console.log('✅ Deleted old profile picture from S3:', oldS3Key);
        }
      } catch (deleteError) {
        // Log error but don't fail the upload if deletion fails
        console.error('⚠️ Failed to delete old profile picture:', deleteError);
      }
    }

    // Update user document in MongoDB
    const updatedUser = await updatePublicUser(userId, {
      image: newImageUrl,
    });

    if (!updatedUser) {
      // If update fails, try to delete the uploaded file
      try {
        await deleteFile(s3Key);
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded file after DB update failure:', cleanupError);
      }
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        imageUrl: newImageUrl 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile picture upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
}

export const POST = uploadProfilePicture;

