import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import type { ShariahTile } from '@/types/admin';

const COLLECTION = 'shariahTiles';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const db = await getDatabase();
    const { slug } = params;

    const tile =
      (await db.collection<ShariahTile>(COLLECTION).findOne({ slug })) ||
      (ObjectId.isValid(slug)
        ? await db.collection<ShariahTile>(COLLECTION).findOne({ _id: new ObjectId(slug) })
        : null);

    if (!tile) {
      return NextResponse.json({ error: 'Shariah tile not found' }, { status: 404 });
    }

    return NextResponse.json(tile);
  } catch (error) {
    console.error('Failed to fetch Shariah tile:', error);
    return NextResponse.json({ error: 'Failed to fetch Shariah tile' }, { status: 500 });
  }
}

