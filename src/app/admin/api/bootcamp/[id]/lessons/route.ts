import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { BootcampLesson } from '@/types/admin';
import { ObjectId } from 'mongodb';

// Helper function to find bootcamp by id or _id for backward compatibility
async function findBootcampById(db: any, id: string) {
  // Try by numeric string id first
  let bootcamp = await db.collection('bootcamps').findOne({ id });
  
  // If not found and id looks like ObjectId, try _id
  if (!bootcamp && ObjectId.isValid(id)) {
    try {
      bootcamp = await db.collection('bootcamps').findOne({ _id: new ObjectId(id) });
    } catch (e) {
      // Invalid ObjectId format
    }
  }
  
  return bootcamp;
}

// Helper function to ensure bootcamp has numeric id field (migrate legacy bootcamps)
async function ensureBootcampHasId(db: any, bootcamp: any): Promise<string> {
  // If bootcamp already has an id, return it
  if (bootcamp.id) {
    return bootcamp.id;
  }
  
  // Legacy bootcamp without id - generate and assign one
  if (bootcamp._id) {
    const allBootcamps = await db.collection('bootcamps').find({}).toArray();
    let maxId = 0;
    for (const bc of allBootcamps) {
      const idValue = typeof bc.id === 'number' ? bc.id : parseInt(bc.id);
      if (!isNaN(idValue) && idValue > maxId) {
        maxId = idValue;
      }
    }
    const newId = (maxId + 1).toString();
    
    // Update bootcamp with new id
    await db.collection('bootcamps').updateOne(
      { _id: bootcamp._id },
      { $set: { id: newId } }
    );
    
    return newId;
  }
  
  // Fallback (should not happen)
  throw new Error('Bootcamp has neither id nor _id field');
}

// Helper to authenticate admin
async function authenticateAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return { error: 'Authentication required', userId: null };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return { error: 'Invalid token', userId: null };
  }

  return { error: null, userId: decoded.userId };
}

// Extract YouTube video ID from URL or return as-is if already an ID
function extractYouTubeVideoId(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  
  // If it's already just an ID (11 characters, alphanumeric, dashes, underscores)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
    return input.trim();
  }
  
  // Try to extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// GET all lessons for a bootcamp
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await authenticateAdmin(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDatabase();

    // Verify bootcamp exists (support both id and _id for backward compatibility)
    const bootcamp = await findBootcampById(db, id);
    if (!bootcamp) {
      return NextResponse.json(
        { error: 'Bootcamp not found' },
        { status: 404 }
      );
    }

    // Ensure bootcamp has numeric id (migrate legacy bootcamps if needed)
    // Always use numeric id for lessons, never ObjectId string
    const bootcampId = await ensureBootcampHasId(db, bootcamp);
    
    const lessons = await db.collection('bootcamp_lessons')
      .find({ bootcampId: bootcampId })
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(lessons, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

// POST create new lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await authenticateAdmin(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const db = await getDatabase();

    // Verify bootcamp exists (support both id and _id for backward compatibility)
    const bootcamp = await findBootcampById(db, id);
    if (!bootcamp) {
      return NextResponse.json(
        { error: 'Bootcamp not found' },
        { status: 404 }
      );
    }

    // Ensure bootcamp has numeric id (migrate legacy bootcamps if needed)
    // Always use numeric id for lessons, never ObjectId string
    const bootcampId = await ensureBootcampHasId(db, bootcamp);

    // Validate required fields
    if (!body.title || !body.youtubeVideoId) {
      return NextResponse.json(
        { error: 'Title and YouTube video ID are required' },
        { status: 400 }
      );
    }

    // Extract and validate YouTube video ID
    const videoId = extractYouTubeVideoId(body.youtubeVideoId);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube video ID or URL' },
        { status: 400 }
      );
    }

    // Get the highest order number for this bootcamp
    const existingLessons = await db.collection('bootcamp_lessons')
      .find({ bootcampId: bootcampId })
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    
    const nextOrder = existingLessons.length > 0 
      ? existingLessons[0].order + 1 
      : 0;

    // Generate unique lesson ID
    const lessonId = `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Generate thumbnail URL from YouTube video ID
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

    const lesson: BootcampLesson = {
      lessonId,
      bootcampId: bootcampId,
      title: body.title,
      description: body.description || '',
      youtubeVideoId: videoId,
      thumbnail,
      order: body.order !== undefined ? body.order : nextOrder,
      duration: body.duration || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('bootcamp_lessons').insertOne(lesson);

    return NextResponse.json(
      { 
        message: 'Lesson created successfully',
        lesson: { ...lesson, _id: result.insertedId }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}

// PUT update lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await authenticateAdmin(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const db = await getDatabase();

    if (!body.lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      );
    }

    // Verify bootcamp exists (support both id and _id for backward compatibility)
    const bootcamp = await findBootcampById(db, id);
    if (!bootcamp) {
      return NextResponse.json(
        { error: 'Bootcamp not found' },
        { status: 404 }
      );
    }

    // Ensure bootcamp has numeric id (migrate legacy bootcamps if needed)
    // Always use numeric id for lessons, never ObjectId string
    const bootcampId = await ensureBootcampHasId(db, bootcamp);

    // Find the lesson
    const lesson = await db.collection('bootcamp_lessons').findOne({
      lessonId: body.lessonId,
      bootcampId: bootcampId
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.duration !== undefined) updateData.duration = body.duration;

    // Handle YouTube video ID update
    if (body.youtubeVideoId !== undefined) {
      const videoId = extractYouTubeVideoId(body.youtubeVideoId);
      if (!videoId) {
        return NextResponse.json(
          { error: 'Invalid YouTube video ID or URL' },
          { status: 400 }
        );
      }
      updateData.youtubeVideoId = videoId;
      updateData.thumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    }

    const result = await db.collection('bootcamp_lessons').updateOne(
      { lessonId: body.lessonId, bootcampId: bootcampId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    const updatedLesson = await db.collection('bootcamp_lessons').findOne({
      lessonId: body.lessonId,
      bootcampId: bootcampId
    });

    return NextResponse.json(
      { 
        message: 'Lesson updated successfully',
        lesson: updatedLesson
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

// DELETE lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await authenticateAdmin(request);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Verify bootcamp exists (support both id and _id for backward compatibility)
    const bootcamp = await findBootcampById(db, id);
    if (!bootcamp) {
      return NextResponse.json(
        { error: 'Bootcamp not found' },
        { status: 404 }
      );
    }

    // Ensure bootcamp has numeric id (migrate legacy bootcamps if needed)
    // Always use numeric id for lessons, never ObjectId string
    const bootcampId = await ensureBootcampHasId(db, bootcamp);

    const result = await db.collection('bootcamp_lessons').deleteOne({
      lessonId,
      bootcampId: bootcampId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Also remove progress entries for this lesson
    await db.collection('bootcamp_progress').updateMany(
      { bootcampId: bootcampId },
      { $pull: { lessons: { lessonId } } }
    );

    return NextResponse.json(
      { message: 'Lesson deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}

