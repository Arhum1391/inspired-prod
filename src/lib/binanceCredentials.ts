import { ObjectId, Collection } from 'mongodb';
import { getDatabase } from './mongodb';
import { decryptString, encryptString, EncryptedPayload } from './crypto';

type Nullable<T> = T | null | undefined;

type EncryptedField = EncryptedPayload;

export type BinanceCredentialDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  apiKey: EncryptedField;
  apiSecret: EncryptedField;
  passphrase?: EncryptedField;
  useTestnet?: boolean;
  label?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBinanceCredentialsInput = {
  apiKey: string;
  apiSecret: string;
  passphrase?: Nullable<string>;
  label?: Nullable<string>;
  useTestnet?: boolean;
};

export type DecryptedBinanceCredentials = {
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  useTestnet: boolean;
  label?: string | null;
};

const COLLECTION_NAME = 'binance_credentials';

const asObjectId = (value: string): ObjectId => {
  try {
    return new ObjectId(value);
  } catch {
    throw new Error('Invalid user id provided for Binance credential lookup.');
  }
};

const getCollection = async (): Promise<Collection<BinanceCredentialDocument>> => {
  const db = await getDatabase();
  return db.collection<BinanceCredentialDocument>(COLLECTION_NAME);
};

export const upsertBinanceCredentials = async (
  userId: string,
  payload: CreateBinanceCredentialsInput
): Promise<void> => {
  const collection = await getCollection();
  const userObjectId = asObjectId(userId);
  const now = new Date();

  const encryptedApiKey = encryptString(payload.apiKey);
  const encryptedApiSecret = encryptString(payload.apiSecret);
  const encryptedPassphrase = payload.passphrase ? encryptString(payload.passphrase) : undefined;

  const setUpdate: Partial<BinanceCredentialDocument> = {
    userId: userObjectId,
    apiKey: encryptedApiKey,
    apiSecret: encryptedApiSecret,
    updatedAt: now,
    useTestnet: payload.useTestnet ?? false,
    label: payload.label ?? null,
  };

  if (encryptedPassphrase) {
    setUpdate.passphrase = encryptedPassphrase;
  }

  const updateOperations: {
    $set: Partial<BinanceCredentialDocument>;
    $setOnInsert: { createdAt: Date };
    $unset?: Record<string, ''>;
  } = {
    $set: setUpdate,
    $setOnInsert: { createdAt: now },
  };

  if (!encryptedPassphrase) {
    updateOperations.$unset = { passphrase: '' };
  }

  await collection.updateOne(
    { userId: userObjectId },
    updateOperations,
    { upsert: true }
  );
};

export const deleteBinanceCredentials = async (userId: string): Promise<void> => {
  const collection = await getCollection();
  const userObjectId = asObjectId(userId);
  await collection.deleteOne({ userId: userObjectId });
};

export const getEncryptedBinanceCredentials = async (
  userId: string
): Promise<BinanceCredentialDocument | null> => {
  const collection = await getCollection();
  const userObjectId = asObjectId(userId);
  return collection.findOne({ userId: userObjectId });
};

export const getDecryptedBinanceCredentials = async (
  userId: string
): Promise<DecryptedBinanceCredentials | null> => {
  const doc = await getEncryptedBinanceCredentials(userId);

  if (!doc) {
    return null;
  }

  const result: DecryptedBinanceCredentials = {
    apiKey: decryptString(doc.apiKey),
    apiSecret: decryptString(doc.apiSecret),
    useTestnet: doc.useTestnet ?? false,
    label: doc.label ?? null,
  };

  if (doc.passphrase) {
    result.passphrase = decryptString(doc.passphrase);
  }

  return result;
};

