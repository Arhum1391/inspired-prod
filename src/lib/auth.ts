import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { User } from '@/types/admin';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

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

export async function createUser(username: string, password: string): Promise<User> {
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

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDatabase();
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
  return user ? {
    _id: user._id.toString(),
    username: user.username,
    password: user.password,
    createdAt: user.createdAt
  } : null;
}
