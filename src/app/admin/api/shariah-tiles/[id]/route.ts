import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import type { ShariahTile } from '@/types/admin';

const COLLECTION = 'shariahTiles';

const requiredStringFields: (keyof ShariahTile)[] = [
  'slug',
  'title',
  'category',
  'description',
  'footerLeft',
  'footerRight',
  'ctaLabel',
  'detailPath',
  'lockedTitle',
  'lockedDescription',
  'analystNotes',
];

const COMPARISON_TYPES = ['less_than', 'greater_than', 'equal', 'custom'];

function validateTilePayload(body: Partial<ShariahTile>) {
  const errors: string[] = [];

  requiredStringFields.forEach((field) => {
    const value = body[field];
    if (typeof value !== 'string' || !value.trim()) {
      errors.push(`${field} is required and must be a non-empty string`);
    }
  });

  if (!body.slug || !/^[a-z0-9-]+$/.test(body.slug)) {
    errors.push('slug can only include lowercase letters, numbers, and hyphens');
  }

  if (!Array.isArray(body.compliancePoints) || body.compliancePoints.length === 0) {
    errors.push('compliancePoints must be a non-empty array of strings');
  } else {
    body.compliancePoints.forEach((point, index) => {
      if (typeof point !== 'string' || !point.trim()) {
        errors.push(`compliancePoints[${index}] must be a non-empty string`);
      }
    });
  }

  if (body.complianceMetrics !== undefined) {
    if (!Array.isArray(body.complianceMetrics)) {
      errors.push('complianceMetrics must be an array');
    } else {
      body.complianceMetrics.forEach((metric, index) => {
        if (!metric || typeof metric !== 'object') {
          errors.push(`complianceMetrics[${index}] must be an object`);
          return;
        }
        if (typeof metric.criteria !== 'string' || !metric.criteria.trim()) {
          errors.push(`complianceMetrics[${index}].criteria is required and must be a string`);
        }
        if (typeof metric.threshold !== 'string' || !metric.threshold.trim()) {
          errors.push(`complianceMetrics[${index}].threshold is required and must be a string`);
        }
        if (typeof metric.actual !== 'string' || !metric.actual.trim()) {
          errors.push(`complianceMetrics[${index}].actual is required and must be a string`);
        }
        if (
          typeof metric.comparisonType !== 'string' ||
          !COMPARISON_TYPES.includes(metric.comparisonType)
        ) {
          errors.push(
            `complianceMetrics[${index}].comparisonType must be one of ${COMPARISON_TYPES.join(', ')}`
          );
        }
        if (
          metric.comparisonType === 'custom' &&
          metric.customStatus &&
          !['pass', 'fail'].includes(metric.customStatus)
        ) {
          errors.push(
            `complianceMetrics[${index}].customStatus must be 'pass' or 'fail' when comparisonType is custom`
          );
        }
      });
    }
  }

  return errors;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await request.json()) as Partial<ShariahTile>;
    const validationErrors = validateTilePayload(body);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    const duplicateSlug = await db.collection<ShariahTile>(COLLECTION).findOne({
      slug: body.slug,
      _id: { $ne: new ObjectId(params.id) },
    });

    if (duplicateSlug) {
      return NextResponse.json(
        { error: 'A tile with this slug already exists' },
        { status: 400 }
      );
    }

    const updateData: Partial<ShariahTile> = {
      ...(body as ShariahTile),
      compliancePoints: body.compliancePoints!.map((point) => point.trim()),
      complianceMetrics: body.complianceMetrics
        ? body.complianceMetrics.map((metric) => ({
            criteria: metric.criteria.trim(),
            threshold: metric.threshold.trim(),
            actual: metric.actual.trim(),
            comparisonType: metric.comparisonType,
            ...(metric.customStatus ? { customStatus: metric.customStatus } : {}),
          }))
        : undefined,
      updatedAt: new Date(),
    };

    const result = await db.collection<ShariahTile>(COLLECTION).updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Shariah tile not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Shariah tile updated successfully' });
  } catch (error) {
    console.error('Failed to update Shariah tile:', error);
    return NextResponse.json({ error: 'Failed to update Shariah tile' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const result = await db
      .collection<ShariahTile>(COLLECTION)
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Shariah tile not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Shariah tile deleted successfully' });
  } catch (error) {
    console.error('Failed to delete Shariah tile:', error);
    return NextResponse.json({ error: 'Failed to delete Shariah tile' }, { status: 500 });
  }
}

