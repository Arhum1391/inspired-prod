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

  if (body.customTable !== undefined) {
    if (!body.customTable || typeof body.customTable !== 'object') {
      errors.push('customTable must be an object');
    } else {
      // Validate title
      if (typeof body.customTable.title !== 'string' || !body.customTable.title.trim()) {
        errors.push('customTable.title is required and must be a non-empty string');
      }
      
      // Validate headings
      if (!Array.isArray(body.customTable.headings)) {
        errors.push('customTable.headings must be an array');
      } else if (body.customTable.headings.length !== 4) {
        errors.push('customTable.headings must have exactly 4 elements');
      } else {
        body.customTable.headings.forEach((heading: unknown, index: number) => {
          if (typeof heading !== 'string' || !heading.trim()) {
            errors.push(`customTable.headings[${index}] must be a non-empty string`);
          }
        });
      }

      // Validate rows
      if (!Array.isArray(body.customTable.rows)) {
        errors.push('customTable.rows must be an array');
      } else {
        body.customTable.rows.forEach((row: unknown, rowIndex: number) => {
          if (!row || typeof row !== 'object') {
            errors.push(`customTable.rows[${rowIndex}] must be an object`);
            return;
          }
          const rowObj = row as { values?: unknown };
          if (!Array.isArray(rowObj.values)) {
            errors.push(`customTable.rows[${rowIndex}].values must be an array`);
          } else if (rowObj.values.length !== 4) {
            errors.push(`customTable.rows[${rowIndex}].values must have exactly 4 elements`);
          } else {
            rowObj.values.forEach((value: unknown, valueIndex: number) => {
              if (typeof value !== 'string' || !value.trim()) {
                errors.push(
                  `customTable.rows[${rowIndex}].values[${valueIndex}] must be a non-empty string`
                );
              }
            });
          }
        });
      }
    }
  }

  return errors;
}

export async function GET() {
  try {
    const db = await getDatabase();
    const tiles = await db
      .collection<ShariahTile>(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tiles);
  } catch (error) {
    console.error('Failed to fetch Shariah tiles:', error);
    return NextResponse.json({ error: 'Failed to fetch Shariah tiles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const existing = await db.collection<ShariahTile>(COLLECTION).findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { error: 'A tile with this slug already exists' },
        { status: 400 }
      );
    }

    const now = new Date();
    const tile: ShariahTile = {
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
      customTable: body.customTable
        ? {
            title: body.customTable.title.trim(),
            headings: body.customTable.headings.map((h: string) => h.trim()),
            rows: body.customTable.rows.map((row: { values: string[] }) => ({
              values: row.values.map((v: string) => v.trim()),
            })),
          }
        : undefined,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection<ShariahTile>(COLLECTION).insertOne(tile);

    return NextResponse.json({
      message: 'Shariah tile created successfully',
      _id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Failed to create Shariah tile:', error);
    return NextResponse.json({ error: 'Failed to create Shariah tile' }, { status: 500 });
  }
}

