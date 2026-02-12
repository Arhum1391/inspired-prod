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
  image?: string | null;
  isPaid: boolean;
  subscriptionStatus: string;
  lastPaymentAt?: Date | null;
  emailVerified?: boolean;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpiry?: Date | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpiry?: Date | null;
  status?: 'active' | 'blocked';
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

export async function createPublicUser(email: string, password: string, name?: string, emailVerificationToken?: string): Promise<PublicUser> {
  const db = await getDatabase();
  const hashedPassword = await hashPassword(password);

  const emailVerificationTokenExpiry = emailVerificationToken
    ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    : null;

  const user: Omit<PublicUser, '_id'> = {
    email,
    password: hashedPassword,
    name: name || null,
    isPaid: false,
    subscriptionStatus: 'none',
    lastPaymentAt: null,
    emailVerified: false,
    emailVerificationToken: emailVerificationToken || null,
    emailVerificationTokenExpiry: emailVerificationTokenExpiry,
    passwordResetToken: null,
    passwordResetTokenExpiry: null,
    status: 'active',
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
    image: user.image || null,
    isPaid: user.isPaid ?? false,
    subscriptionStatus: user.subscriptionStatus ?? (user.isPaid ? 'active' : 'none'),
    lastPaymentAt: user.lastPaymentAt ?? null,
    emailVerified: user.emailVerified ?? false,
    emailVerificationToken: user.emailVerificationToken ?? null,
    emailVerificationTokenExpiry: user.emailVerificationTokenExpiry ?? null,
    passwordResetToken: user.passwordResetToken ?? null,
    passwordResetTokenExpiry: user.passwordResetTokenExpiry ?? null,
    status: (user.status as 'active' | 'blocked') || 'active',
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
    image: user.image || null,
    isPaid: user.isPaid ?? false,
    subscriptionStatus: user.subscriptionStatus ?? (user.isPaid ? 'active' : 'none'),
    lastPaymentAt: user.lastPaymentAt ?? null,
    emailVerified: user.emailVerified ?? false,
    emailVerificationToken: user.emailVerificationToken ?? null,
    emailVerificationTokenExpiry: user.emailVerificationTokenExpiry ?? null,
    passwordResetToken: user.passwordResetToken ?? null,
    passwordResetTokenExpiry: user.passwordResetTokenExpiry ?? null,
    status: (user.status as 'active' | 'blocked') || 'active',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  } : null;
}

// export async function updatePublicUser(
//   id: string,
//   updates: {
//     name?: string | null;
//     email?: string;
//     isPaid?: boolean;
//     subscriptionStatus?: string;
//     lastPaymentAt?: Date | null;
//     emailVerified?: boolean;
//     emailVerificationToken?: string | null;
//     emailVerificationTokenExpiry?: Date | null;
//     passwordResetToken?: string | null;
//     passwordResetTokenExpiry?: Date | null;
//     password?: string;
//   }
// ): Promise<PublicUser | null> {
//   const db = await getDatabase();
//   const updateData: any = {
//     ...updates,
//     updatedAt: new Date()
//   };

//   const result = await db.collection('public_users').findOneAndUpdate(
//     { _id: new ObjectId(id) },
//     { $set: updateData },
//     { returnDocument: 'after' }
//   );

//   if (!result) {
//     return null;
//   }

//   return {
//     _id: result._id.toString(),
//     email: result.email,
//     password: result.password,
//     name: result.name || null,
//     isPaid: result.isPaid ?? false,
//     subscriptionStatus: result.subscriptionStatus ?? (result.isPaid ? 'active' : 'none'),
//     lastPaymentAt: result.lastPaymentAt ?? null,
//     emailVerified: result.emailVerified ?? false,
//     emailVerificationToken: result.emailVerificationToken ?? null,
//     emailVerificationTokenExpiry: result.emailVerificationTokenExpiry ?? null,
//     passwordResetToken: result.passwordResetToken ?? null,
//     passwordResetTokenExpiry: result.passwordResetTokenExpiry ?? null,
//     createdAt: result.createdAt,
//     updatedAt: result.updatedAt
//   };
// }


export async function updatePublicUser(
  id: string,
  updates: {
    name?: string | null;
    email?: string;
    image?: string | null;
    isPaid?: boolean;
    subscriptionStatus?: string;
    lastPaymentAt?: Date | null;
    emailVerified?: boolean;
    emailVerificationToken?: string | null;
    emailVerificationTokenExpiry?: Date | null;
    passwordResetToken?: string | null;
    passwordResetTokenExpiry?: Date | null;
    status?: 'active' | 'blocked';
    password?: string;
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


  const updatedUser = result?.value;

  if (!updatedUser) {
    return null;
  }

  return {
    _id: updatedUser._id.toString(),
    email: updatedUser.email,
    password: updatedUser.password,
    name: updatedUser.name || null,
    image: updatedUser.image || null,
    isPaid: updatedUser.isPaid ?? false,
    subscriptionStatus: updatedUser.subscriptionStatus ?? (updatedUser.isPaid ? 'active' : 'none'),
    lastPaymentAt: updatedUser.lastPaymentAt ?? null,
    emailVerified: updatedUser.emailVerified ?? false,
    emailVerificationToken: updatedUser.emailVerificationToken ?? null,
    emailVerificationTokenExpiry: updatedUser.emailVerificationTokenExpiry ?? null,
    passwordResetToken: updatedUser.passwordResetToken ?? null,
    passwordResetTokenExpiry: updatedUser.passwordResetTokenExpiry ?? null,
    status: (updatedUser.status as 'active' | 'blocked') || 'active',
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt

  };
}


// Generate a secure random token
export function generateSecureToken(): string {
  return require('crypto').randomBytes(32).toString('hex');
}

// Get user by email verification token
export async function getPublicUserByVerificationToken(token: string): Promise<PublicUser | null> {
  const db = await getDatabase();
  const user = await db.collection('public_users').findOne({
    emailVerificationToken: token,
    emailVerificationTokenExpiry: { $gt: new Date() }
  });

  if (!user) return null;

  return {
    _id: user._id.toString(),
    email: user.email,
    password: user.password,
    name: user.name || null,
    image: user.image || null,
    isPaid: user.isPaid ?? false,
    subscriptionStatus: user.subscriptionStatus ?? (user.isPaid ? 'active' : 'none'),
    lastPaymentAt: user.lastPaymentAt ?? null,
    emailVerified: user.emailVerified ?? false,
    emailVerificationToken: user.emailVerificationToken ?? null,
    emailVerificationTokenExpiry: user.emailVerificationTokenExpiry ?? null,
    passwordResetToken: user.passwordResetToken ?? null,
    passwordResetTokenExpiry: user.passwordResetTokenExpiry ?? null,
    status: (user.status as 'active' | 'blocked') || 'active',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

// Get user by password reset token
export async function getPublicUserByPasswordResetToken(token: string): Promise<PublicUser | null> {
  const db = await getDatabase();
  const user = await db.collection('public_users').findOne({
    passwordResetToken: token,
    passwordResetTokenExpiry: { $gt: new Date() }
  });

  if (!user) return null;

  return {
    _id: user._id.toString(),
    email: user.email,
    password: user.password,
    name: user.name || null,
    image: user.image || null,
    isPaid: user.isPaid ?? false,
    subscriptionStatus: user.subscriptionStatus ?? (user.isPaid ? 'active' : 'none'),
    lastPaymentAt: user.lastPaymentAt ?? null,
    emailVerified: user.emailVerified ?? false,
    emailVerificationToken: user.emailVerificationToken ?? null,
    emailVerificationTokenExpiry: user.emailVerificationTokenExpiry ?? null,
    passwordResetToken: user.passwordResetToken ?? null,
    passwordResetTokenExpiry: user.passwordResetTokenExpiry ?? null,
    status: (user.status as 'active' | 'blocked') || 'active',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
