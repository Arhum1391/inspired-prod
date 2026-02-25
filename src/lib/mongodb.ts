import { MongoClient, Db } from 'mongodb';

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

// Lazy initialization function - only throws error when actually trying to connect
// This prevents build-time errors when MONGODB_URI might not be available
const getClientPromise = (): Promise<MongoClient> => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local or environment variables');
  }

  // Return existing promise if already initialized
  if (clientPromise) {
    return clientPromise;
  }

  const uri = process.env.MONGODB_URI;
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode (serverless), use a global variable to reuse connections
    // This prevents creating multiple connections in serverless environments like Vercel
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  }

  return clientPromise;
};

// Export a thenable (Promise-like object) that lazily initializes when accessed
// This allows the module to load during build time without errors
// The connection is only attempted when the promise is actually awaited
const lazyClientPromise: Promise<MongoClient> = {
  then: (onFulfilled?: (value: MongoClient) => any, onRejected?: (reason: any) => any) => {
    return getClientPromise().then(onFulfilled, onRejected);
  },
  catch: (onRejected?: (reason: any) => any) => {
    return getClientPromise().catch(onRejected);
  },
  finally: (onFinally?: () => void) => {
    return getClientPromise().finally(onFinally);
  },
  [Symbol.toStringTag]: 'Promise'
} as Promise<MongoClient>;

export default lazyClientPromise;

export const getDatabase = async (): Promise<Db> => {
  const client = await getClientPromise();
  return client.db('inspired-analyst');
};
