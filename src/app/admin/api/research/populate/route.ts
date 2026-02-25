import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { researchReports } from '@/data/researchReports';
import type { ResearchReport } from '@/data/researchReports';

export async function POST() {
  try {
    const db = await getDatabase();
    
    // Check which reports already exist (by slug)
    const existingReports = await db.collection('researchReports')
      .find({})
      .toArray();
    
    const existingSlugs = new Set(existingReports.map((r: ResearchReport) => r.slug));
    
    // Filter out reports that already exist
    const reportsToInsert = researchReports.filter(report => !existingSlugs.has(report.slug));
    
    if (reportsToInsert.length === 0) {
      return NextResponse.json({
        message: 'All dummy research reports already exist in the database',
        skipped: researchReports.length,
        insertedCount: 0
      });
    }

    // Prepare reports with timestamps
    const reportsWithTimestamps: (ResearchReport & { createdAt: Date; updatedAt: Date })[] = reportsToInsert.map(report => ({
      ...report,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert new reports
    const result = await db.collection('researchReports').insertMany(reportsWithTimestamps);
    
    return NextResponse.json({
      message: 'Dummy research reports imported successfully',
      insertedCount: result.insertedCount,
      skipped: existingSlugs.size,
      total: researchReports.length
    });
  } catch (error) {
    console.error('Populate research reports error:', error);
    return NextResponse.json(
      { error: 'Failed to populate research reports' },
      { status: 500 }
    );
  }
}

