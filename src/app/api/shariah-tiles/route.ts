import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import type { ShariahTile } from '@/types/admin';

const COLLECTION = 'shariahTiles';

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

