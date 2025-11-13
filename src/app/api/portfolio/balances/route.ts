import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authHelpers';
import {
  getDecryptedBinanceCredentials,
  getEncryptedBinanceCredentials,
} from '@/lib/binanceCredentials';
import {
  BinanceApiError,
  createBinanceClient,
  AccountInformation,
  TickerPrice,
} from '@/lib/binance';

type Holding = {
  asset: string;
  free: number;
  locked: number;
  total: number;
  unitPrice?: number | null;
  unitPriceSymbol?: string | null;
  value?: number | null;
};

type HoldingsSummary = {
  totalValue: number;
  totalValueComputedAssets: number;
  missingPriceAssets: string[];
  computedAt: string;
};

type PortfolioResponse = {
  holdings: Holding[];
  summary: HoldingsSummary;
  credentialsMetadata?: {
    useTestnet: boolean;
    label?: string | null;
    updatedAt?: string | null;
  };
  rateLimit?: {
    account?: Record<string, unknown>;
    prices?: Record<string, unknown>;
  };
};

const respond = (data: object, status = 200) => NextResponse.json(data, { status });

const parseNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isStablecoin = (asset: string): boolean => {
  const stableCoins = new Set(['USDT', 'BUSD', 'USDC', 'FDUSD', 'TUSD', 'DAI', 'EUR', 'GBP']);
  return stableCoins.has(asset.toUpperCase());
};

const buildPriceSymbols = (assets: string[]): string[] => {
  const seen = new Set<string>();
  const symbols: string[] = [];

  assets.forEach(asset => {
    const normalized = asset.toUpperCase();
    if (isStablecoin(normalized) || normalized === 'USD') {
      return;
    }
    const symbol = `${normalized}USDT`;
    if (!seen.has(symbol)) {
      seen.add(symbol);
      symbols.push(symbol);
    }
  });

  return symbols;
};

const buildPriceMap = (prices: TickerPrice[]): Map<string, number> => {
  const map = new Map<string, number>();
  prices.forEach(price => {
    const value = Number(price.price);
    if (Number.isFinite(value)) {
      map.set(price.symbol.toUpperCase(), value);
    }
  });
  return map;
};

const computeHoldings = (
  account: AccountInformation,
  priceMap: Map<string, number>
): { holdings: Holding[]; summary: HoldingsSummary } => {
  const holdings: Holding[] = [];
  const missingPrices: string[] = [];

  let totalValue = 0;

  account.balances.forEach(balance => {
    const free = parseNumber(balance.free);
    const locked = parseNumber(balance.locked);
    const total = free + locked;

    if (total <= 0) {
      return;
    }

    const asset = balance.asset.toUpperCase();
    let unitPrice: number | null | undefined;
    let unitPriceSymbol: string | null | undefined = null;

    if (isStablecoin(asset) || asset === 'USD') {
      unitPrice = 1;
      unitPriceSymbol = `${asset}/USD`;
    } else {
      unitPriceSymbol = `${asset}USDT`;
      unitPrice = priceMap.get(unitPriceSymbol) ?? null;
    }

    const value =
      typeof unitPrice === 'number' && Number.isFinite(unitPrice) ? total * unitPrice : null;

    holdings.push({
      asset,
      free,
      locked,
      total,
      unitPrice,
      unitPriceSymbol,
      value,
    });

    if (typeof value === 'number') {
      totalValue += value;
    } else {
      missingPrices.push(asset);
    }
  });

  const summary: HoldingsSummary = {
    totalValue,
    totalValueComputedAssets: totalValue,
    missingPriceAssets: missingPrices,
    computedAt: new Date().toISOString(),
  };

  return {
    holdings,
    summary,
  };
};

const mapRateLimitInfo = (source?: Record<string, unknown>) => {
  if (!source) {
    return undefined;
  }
  const entries = Object.entries(source).reduce<Record<string, unknown>>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
  return entries;
};

export async function GET(request: NextRequest) {
  const { userId, error } = await requireAuth(request);
  if (!userId) {
    return respond({ error: error ?? 'Authentication required' }, 401);
  }

  try {
    const encryptedCredentials = await getEncryptedBinanceCredentials(userId);

    if (!encryptedCredentials) {
      return respond({ error: 'No Binance credentials found for user' }, 404);
    }

    const credentials = await getDecryptedBinanceCredentials(userId);
    if (!credentials) {
      return respond({ error: 'Failed to decrypt Binance credentials' }, 500);
    }

    const client = createBinanceClient({
      apiKey: credentials.apiKey,
      apiSecret: credentials.apiSecret,
      useTestnet: credentials.useTestnet,
    });

    const accountResponse = await client.getAccountInformation();

    const relevantAssets = accountResponse.data.balances
      .map(balance => balance.asset)
      .filter(Boolean);

    const priceSymbols = buildPriceSymbols(relevantAssets);
    const priceData: TickerPrice[] = [];
    const aggregatedPriceHeaders: Record<string, string> = {};

    const unsupportedSymbols: string[] = [];

    if (priceSymbols.length > 0) {
      const MAX_SYMBOLS_PER_REQUEST = 100; // Increased batch size
      
      // Process in parallel batches for better performance
      const batchPromises: Promise<void>[] = [];
      
      for (let i = 0; i < priceSymbols.length; i += MAX_SYMBOLS_PER_REQUEST) {
        const chunk = priceSymbols.slice(i, i + MAX_SYMBOLS_PER_REQUEST);
        
        const batchPromise = (async () => {
          try {
            const responseChunk = await client.getTickerPrices(chunk);
            priceData.push(...responseChunk.data);
            Object.assign(
              aggregatedPriceHeaders,
              responseChunk.rateLimit?.rawHeaders ?? {}
            );
          } catch (error) {
            if (error instanceof BinanceApiError && error.code === -1121) {
              // Process invalid symbols individually
              const individualPromises = chunk.map(async (symbol) => {
                try {
                  const singleResponse = await client.getTickerPrices([symbol]);
                  priceData.push(...singleResponse.data);
                  Object.assign(
                    aggregatedPriceHeaders,
                    singleResponse.rateLimit?.rawHeaders ?? {}
                  );
                } catch (singleError) {
                  if (
                    singleError instanceof BinanceApiError &&
                    singleError.code === -1121
                  ) {
                    unsupportedSymbols.push(symbol);
                  } else {
                    throw singleError;
                  }
                }
              });
              await Promise.all(individualPromises);
            } else {
              throw error;
            }
          }
        })();
        
        batchPromises.push(batchPromise);
      }
      
      await Promise.all(batchPromises);
    }

    const priceMap = buildPriceMap(priceData);

    const { holdings, summary } = computeHoldings(accountResponse.data, priceMap);

    const dedupedUnsupportedSymbols = Array.from(new Set(unsupportedSymbols));
    if (dedupedUnsupportedSymbols.length) {
      summary.missingPriceAssets.push(
        ...dedupedUnsupportedSymbols.map(symbol => symbol.replace(/USDT$/i, ''))
      );
    }

    const response: PortfolioResponse = {
      holdings,
      summary,
      credentialsMetadata: {
        useTestnet: credentials.useTestnet,
        label: credentials.label ?? null,
        updatedAt: encryptedCredentials.updatedAt?.toISOString() ?? null,
      },
      rateLimit: {
        account: mapRateLimitInfo(accountResponse.rateLimit?.rawHeaders ?? undefined),
        prices: mapRateLimitInfo(
          Object.keys(aggregatedPriceHeaders).length ? aggregatedPriceHeaders : undefined
        ),
      },
    };

    return respond(response);
  } catch (err) {
    if (err instanceof BinanceApiError) {
      // Handle timestamp/recvWindow errors specifically
      if (err.code === -1021 || err.message.includes('recvWindow') || err.message.includes('timestamp')) {
        return respond(
          {
            error: 'Time synchronization issue. Please try again in a moment.',
            code: err.code,
            isTimestampError: true,
            retryAfterMs: 5000,
          },
          400
        );
      }
      
      // Handle timeout errors
      if (err.code === 'TIMEOUT' || err.code === 'CONNECTION_TIMEOUT') {
        return respond(
          {
            error: err.message,
            code: err.code,
            isTimeoutError: true,
            retryAfterMs: err.retryAfterMs || 10000,
          },
          408 // Request Timeout
        );
      }
      
      const status = err.status || 400;
      return respond(
        {
          error: err.message,
          code: err.code,
          isRateLimit: err.isRateLimit,
          retryAfterMs: err.retryAfterMs ?? null,
        },
        status
      );
    }

    console.error('Unexpected error fetching Binance balances', err);
    return respond({ error: 'Failed to fetch Binance balances' }, 500);
  }
}

