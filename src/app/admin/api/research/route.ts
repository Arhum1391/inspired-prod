import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import type { ResearchReport } from '@/data/researchReports';

// GET all research reports
export async function GET() {
  try {
    const db = await getDatabase();
    const reports = await db.collection('researchReports')
      .find({})
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .toArray();

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Failed to fetch research reports:', error);
    return NextResponse.json({ error: 'Failed to fetch research reports' }, { status: 500 });
  }
}

// POST create new research report
export async function POST(request: NextRequest) {
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

    // Check if slug already exists
    const existingReport = await db.collection('researchReports').findOne({ slug: body.slug });
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

    const reportData = {
      ...body,
      shariahCompliant: body.shariahCompliant || false,
      pdfUrl: body.pdfUrl || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('researchReports').insertOne(reportData);

    return NextResponse.json({
      message: 'Research report created successfully',
      _id: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Failed to create research report:', error);
    return NextResponse.json({ 
      error: 'Failed to create research report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

