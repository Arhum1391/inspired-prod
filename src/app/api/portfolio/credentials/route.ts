import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authHelpers';
import {
  deleteBinanceCredentials,
  getEncryptedBinanceCredentials,
  upsertBinanceCredentials,
} from '@/lib/binanceCredentials';

type CredentialsRequestBody = {
  apiKey?: unknown;
  apiSecret?: unknown;
  passphrase?: unknown;
  label?: unknown;
  useTestnet?: unknown;
};

const DEFAULT_USE_TESTNET =
  process.env.BINANCE_USE_TESTNET_DEFAULT?.toLowerCase() === 'true';

const sanitizeInput = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const parseBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }
  return undefined;
};

const respond = (data: object, status = 200) => NextResponse.json(data, { status });

export async function GET(request: NextRequest) {
  const { userId, error } = await requireAuth(request);
  if (!userId) {
    return respond({ error: error ?? 'Authentication required' }, 401);
  }

  try {
    const existing = await getEncryptedBinanceCredentials(userId);

    return respond({
      connected: !!existing,
      hasPassphrase: !!existing?.passphrase,
      useTestnet: existing?.useTestnet ?? DEFAULT_USE_TESTNET ?? false,
      label: existing?.label ?? null,
      createdAt: existing?.createdAt ?? null,
      updatedAt: existing?.updatedAt ?? null,
    });
  } catch (err) {
    console.error('Failed to fetch Binance credentials metadata', err);
    return respond({ error: 'Failed to fetch Binance credentials' }, 500);
  }
}

export async function POST(request: NextRequest) {
  const { userId, error } = await requireAuth(request);
  if (!userId) {
    return respond({ error: error ?? 'Authentication required' }, 401);
  }

  let body: CredentialsRequestBody;
  try {
    body = (await request.json()) as CredentialsRequestBody;
  } catch {
    return respond({ error: 'Invalid JSON body' }, 400);
  }

  const apiKey = sanitizeInput(body.apiKey);
  const apiSecret = sanitizeInput(body.apiSecret);
  const passphrase = sanitizeInput(body.passphrase);
  const label = sanitizeInput(body.label);

  if (!apiKey) {
    return respond({ error: 'apiKey is required' }, 400);
  }

  if (!apiSecret) {
    return respond({ error: 'apiSecret is required' }, 400);
  }

  const useTestnet = parseBoolean(body.useTestnet);

  try {
    // Check if encryption key is configured before attempting to store credentials
    if (!process.env.BINANCE_CREDENTIALS_ENCRYPTION_KEY) {
      console.error('BINANCE_CREDENTIALS_ENCRYPTION_KEY environment variable is not set');
      return respond(
        { 
          error: 'Server configuration error: Encryption key not configured. Please contact support.',
        },
        500
      );
    }

    await upsertBinanceCredentials(userId, {
      apiKey,
      apiSecret,
      passphrase,
      label,
      useTestnet: typeof useTestnet === 'boolean' ? useTestnet : DEFAULT_USE_TESTNET ?? false,
    });

    return respond({ success: true });
  } catch (err) {
    console.error('Failed to store Binance credentials', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const errorStack = err instanceof Error ? err.stack : undefined;
    
    // Log detailed error for debugging
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: err instanceof Error ? err.name : typeof err,
    });
    
    // Check if error is related to missing encryption key
    if (errorMessage.includes('BINANCE_CREDENTIALS_ENCRYPTION_KEY')) {
      return respond(
        { 
          error: 'Server configuration error: Encryption key not configured. Please contact support.',
        },
        500
      );
    }
    
    // Return a more informative error message in development, generic in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    return respond(
      { 
        error: 'Failed to store Binance credentials',
        ...(isDevelopment && { details: errorMessage })
      },
      500
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { userId, error } = await requireAuth(request);
  if (!userId) {
    return respond({ error: error ?? 'Authentication required' }, 401);
  }

  try {
    await deleteBinanceCredentials(userId);
    return respond({ success: true });
  } catch (err) {
    console.error('Failed to delete Binance credentials', err);
    return respond({ error: 'Failed to delete Binance credentials' }, 500);
  }
}







