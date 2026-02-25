import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { ResearchReport } from '@/data/researchReports';

// PUT update research report
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as ResearchReport;
    const db = await getDatabase();

    // Validate required fields
    const requiredFields = ['slug', 'title', 'description', 'date', 'readTime', 'category'];
    const missingFields = requiredFields.filter(field => !body[field as keyof ResearchReport]);

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        missingFields 
      }, { status: 400 });
    }

    // Validate summaryPoints
    if (!body.summaryPoints || !Array.isArray(body.summaryPoints) || body.summaryPoints.length === 0) {
      return NextResponse.json({ 
        error: 'At least one summary point is required' 
      }, { status: 400 });
    }

    // Validate content sections
    if (!body.content || !Array.isArray(body.content) || body.content.length === 0) {
      return NextResponse.json({ 
        error: 'At least one content section is required' 
      }, { status: 400 });
    }

    // Check if slug already exists for a different report
    const existingReport = await db.collection('researchReports').findOne({ 
      slug: body.slug,
      _id: { $ne: new ObjectId(params.id) }
    });
    
    if (existingReport) {
      return NextResponse.json({ 
        error: 'A research report with this slug already exists' 
      }, { status: 400 });
    }

    // Validate content structure
    for (const section of body.content) {
      if (!section.heading || !section.body || !Array.isArray(section.body) || section.body.length === 0) {
        return NextResponse.json({ 
          error: 'Each content section must have a heading and at least one paragraph' 
        }, { status: 400 });
      }
    }

    const updateData = {
      ...body,
      shariahCompliant: body.shariahCompliant || false,
      pdfUrl: body.pdfUrl || undefined,
      updatedAt: new Date(),
    };

    const result = await db.collection('researchReports').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Research report not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Research report updated successfully' });
  } catch (error) {
    console.error('Failed to update research report:', error);
    return NextResponse.json({ 
      error: 'Failed to update research report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE research report
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();

    const result = await db.collection('researchReports').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Research report not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Research report deleted successfully' });
  } catch (error) {
    console.error('Failed to delete research report:', error);
    return NextResponse.json({ 
      error: 'Failed to delete research report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

