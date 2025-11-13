import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { User } from '@/types/admin';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Password utilities (used by both admin and public users)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Token utilities (used by both admin and public users)
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// ============================================================================
// ADMIN USER FUNCTIONS (uses 'users' collection, identified by username)
// ============================================================================

export interface PublicUser {
  _id?: string;
  email: string;
  password: string;
  name?: string | null;
  isPaid: boolean;
  subscriptionStatus: string;
  lastPaymentAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function createAdminUser(username: string, password: string): Promise<User> {
  const db = await getDatabase();
  const hashedPassword = await hashPassword(password);
  
  const user: Omit<User, '_id'> = {
    username,
    password: hashedPassword,
    createdAt: new Date(),
  };

  const result = await db.collection('users').insertOne(user);
  return { ...user, _id: result.insertedId.toString() };
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const db = await getDatabase();
  const user = await db.collection('users').findOne({ username });
  return user ? {
    _id: user._id.toString(),
    username: user.username,
    password: user.password,
    createdAt: user.createdAt
  } : null;
}

export async function getAdminUserById(id: string): Promise<User | null> {
  const db = await getDatabase();
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
  return user ? {
    _id: user._id.toString(),
    username: user.username,
    password: user.password,
    createdAt: user.createdAt
  } : null;
}

// Legacy function alias for backward compatibility
export async function createUser(username: string, password: string): Promise<User> {
  return createAdminUser(username, password);
}

// Legacy function alias for backward compatibility
export async function getUserById(id: string): Promise<User | null> {
  return getAdminUserById(id);
}

// ============================================================================
// PUBLIC USER FUNCTIONS (uses 'public_users' collection, identified by email)
// ============================================================================

export async function createPublicUser(email: string, password: string, name?: string): Promise<PublicUser> {
  const db = await getDatabase();
  const hashedPassword = await hashPassword(password);
  
  const user: Omit<PublicUser, '_id'> = {
    email,
    password: hashedPassword,
    name: name || null,
    isPaid: false,
    subscriptionStatus: 'none',
    lastPaymentAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('public_users').insertOne(user);
  return { ...user, _id: result.insertedId.toString() };
}

export async function getPublicUserByEmail(email: string): Promise<PublicUser | null> {
  const db = await getDatabase();
  const user = await db.collection('public_users').findOne({ email });
  return user ? {
    _id: user._id.toString(),
    email: user.email,
    password: user.password,
    name: user.name || null,
    isPaid: user.isPaid ?? false,
    subscriptionStatus: user.subscriptionStatus ?? (user.isPaid ? 'active' : 'none'),
    lastPaymentAt: user.lastPaymentAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  } : null;
}

export async function getPublicUserById(id: string): Promise<PublicUser | null> {
  const db = await getDatabase();
  const user = await db.collection('public_users').findOne({ _id: new ObjectId(id) });
  return user ? {
    _id: user._id.toString(),
    email: user.email,
    password: user.password,
    name: user.name || null,
    isPaid: user.isPaid ?? false,
    subscriptionStatus: user.subscriptionStatus ?? (user.isPaid ? 'active' : 'none'),
    lastPaymentAt: user.lastPaymentAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  } : null;
}

export async function updatePublicUser(
  id: string,
  updates: {
    name?: string | null;
    email?: string;
    isPaid?: boolean;
    subscriptionStatus?: string;
    lastPaymentAt?: Date | null;
  }
): Promise<PublicUser | null> {
  const db = await getDatabase();
  const updateData: any = {
    ...updates,
    updatedAt: new Date()
  };

  const result = await db.collection('public_users').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  if (!result) {
    return null;
  }

  return {
    _id: result._id.toString(),
    email: result.email,
    password: result.password,
    name: result.name || null,
    isPaid: result.isPaid ?? false,
    subscriptionStatus: result.subscriptionStatus ?? (result.isPaid ? 'active' : 'none'),
    lastPaymentAt: result.lastPaymentAt ?? null,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt
  };
}
