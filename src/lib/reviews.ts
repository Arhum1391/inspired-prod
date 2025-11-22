import { ObjectId, Collection, Document } from 'mongodb';
import { getDatabase } from './mongodb';
import { Review, ReviewStatus } from '@/types/admin';

const COLLECTION_NAME = 'reviews';

type ReviewDocument = Omit<Review, '_id'> & { _id: ObjectId };

export type CreateReviewInput = {
  analystId: number;
  analystName: string;
  reviewerName: string;
  userId?: string | null;
  rating: number;
  comment: string;
  reviewDate: string;
};

export type FetchReviewsOptions = {
  includePending?: boolean;
  limit?: number;
};

export async function getReviewsCollection(): Promise<Collection<ReviewDocument>> {
  const db = await getDatabase();
  return db.collection<ReviewDocument>(COLLECTION_NAME);
}

function serializeReview(doc: ReviewDocument): Review {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    _id: _id.toString(),
  };
}

export async function listReviewsByAnalyst(
  analystId: number,
  { includePending = false, limit }: FetchReviewsOptions = {}
): Promise<Review[]> {
  const collection = await getReviewsCollection();
  const query: Document = { analystId };

  if (!includePending) {
    query.status = 'approved';
  }

  const cursor = collection
    .find(query)
    .sort({ createdAt: -1 });

  if (limit) {
    cursor.limit(limit);
  }

  const results = await cursor.toArray();
  return results.map(serializeReview);
}

export async function listAllReviews(status?: ReviewStatus, analystId?: number): Promise<Review[]> {
  const collection = await getReviewsCollection();
  const query: Document = {};

  if (status) {
    query.status = status;
  }
  if (typeof analystId === 'number' && !Number.isNaN(analystId)) {
    query.analystId = analystId;
  }

  const reviews = await collection.find(query).sort({ createdAt: -1 }).toArray();
  return reviews.map(serializeReview);
}

export async function createReview(input: CreateReviewInput): Promise<Review> {
  const collection = await getReviewsCollection();
  const now = new Date();

  const doc: Omit<ReviewDocument, '_id'> = {
    ...input,
    reviewerName: input.reviewerName.trim(),
    comment: input.comment.trim(),
    rating: Math.min(Math.max(Math.round(input.rating), 1), 5),
    userId: input.userId || null,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(doc as ReviewDocument);
  return serializeReview({ ...doc, _id: result.insertedId });
}

export async function approveReview(reviewId: string): Promise<boolean> {
  const collection = await getReviewsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(reviewId) },
    {
      $set: {
        status: 'approved',
        approvedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount === 1;
}

export async function deleteReview(reviewId: string): Promise<boolean> {
  const collection = await getReviewsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(reviewId) });
  return result.deletedCount === 1;
}


