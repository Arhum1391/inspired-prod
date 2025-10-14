import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { getDatabase } from '@/lib/mongodb';
import { Newsletter } from '@/types/admin';

async function getNewsletters(req: NextRequest, userId: string) {
  try {
    const db = await getDatabase();
    const newsletters = await db.collection('newsletters').find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(newsletters.map(newsletter => ({
      ...newsletter,
      _id: newsletter._id.toString()
    })));
  } catch (error) {
    console.error('Get newsletters error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletters' },
      { status: 500 }
    );
  }
}

async function createNewsletter(req: NextRequest, userId: string) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const file = formData.get('file') as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const newsletter: Omit<Newsletter, '_id'> = {
      title,
      content,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Handle file upload if present
    if (file && file.size > 0) {
      // In a real application, you would upload to a cloud storage service
      // For now, we'll just store the file name
      newsletter.fileName = file.name;
      newsletter.fileUrl = `/uploads/${file.name}`;
    }

    const result = await db.collection('newsletters').insertOne(newsletter);

    return NextResponse.json({
      ...newsletter,
      _id: result.insertedId.toString()
    }, { status: 201 });
  } catch (error) {
    console.error('Create newsletter error:', error);
    return NextResponse.json(
      { error: 'Failed to create newsletter' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getNewsletters);
export const POST = withAuth(createNewsletter);
