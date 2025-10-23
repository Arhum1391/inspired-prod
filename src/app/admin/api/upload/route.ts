import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

async function uploadImage(req: NextRequest, userId: string) {
  try {
    console.log('📤 Upload: Starting image upload for user:', userId);
    const data = await req.formData();
    const file: File | null = data.get('image') as unknown as File;

    console.log('📤 Upload: File received:', file ? `${file.name} (${file.size} bytes, ${file.type})` : 'null');

    if (!file) {
      console.log('❌ Upload: No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Upload: Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ Upload: File too large:', file.size, 'bytes');
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    console.log('✅ Upload: File validation passed');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    console.log('📁 Upload: Saving file to:', filepath);

    // Write file to disk
    await writeFile(filepath, buffer);

    // Return the public URL
    const url = `/uploads/${filename}`;
    
    console.log('✅ Upload: File uploaded successfully:', url);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(uploadImage);
