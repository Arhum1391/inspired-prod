import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authHelpers';
import {
  getEncryptedBinanceCredentials,
  getDecryptedBinanceCredentials,
} from '@/lib/binanceCredentials';
import {
  BinanceApiError,
  createBinanceClient,
  AccountInformation,
  KlinePoint,
} from '@/lib/binance';
import type { BinanceClient } from '@/lib/binance';

type HistoryRange = '1Hr' | '1D' | '1W' | '1M' | '1Y';

type RangeConfig = {
  interval: string;
  limit: number;
  stepMs: number;
  formatLabel: (date: Date) => string;
};

const RANGE_CONFIG: Record<HistoryRange, RangeConfig> = {
  '1Hr': {
    interval: '5m',
    limit: 12,
    stepMs: 300_000,
    formatLabel: date =>
      date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  },
  '1D': {
    interval: '1h',
    limit: 24,
    stepMs: 3_600_000,
    formatLabel: date =>
      date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  },
  '1W': {
    interval: '4h',
    limit: 42,
    stepMs: 14_400_000,
    formatLabel: date =>
      date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric' }),
  },
  '1M': {
    interval: '1d',
    limit: 30,
    stepMs: 86_400_000,
    formatLabel: date =>
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  },
  '1Y': {
    interval: '1w',
    limit: 52,
    stepMs: 7 * 86_400_000,
    formatLabel: date =>
      date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  },
};

const STABLE_COINS = new Set(['USDT', 'BUSD', 'USDC', 'FDUSD', 'TUSD', 'DAI', 'EUR', 'GBP']);
const MAX_PRICE_ASSETS = 6;
const MIN_HOLDING_QUANTITY = 0.000001;

const parseQuantity = (value: string): number => {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return 0;
  }
  return parsed;
};

const generateTimeline = (config: RangeConfig): number[] => {
  const now = Date.now();
  return Array.from({ length: config.limit }, (_, index) => {
    const stepsFromEnd = config.limit - index;
    return now - stepsFromEnd * config.stepMs;
  });
};

type HoldingQuantity = {
  asset: string;
  quantity: number;
};

type PricedHolding = HoldingQuantity & {
  usdValue: number;
};

const extractHoldings = (account: AccountInformation): HoldingQuantity[] => {
  return account.balances
    .map(balance => {
      const total =
        parseQuantity(balance.free) + parseQuantity(balance.locked);
      return {
        asset: balance.asset.toUpperCase(),
        quantity: total,
      };
    })
    .filter(item => item.quantity > MIN_HOLDING_QUANTITY);
};

const buildPriceSymbols = (holdings: HoldingQuantity[]): string[] => {
  const seen = new Set<string>();
  const symbols: string[] = [];

  holdings.forEach(holding => {
    if (STABLE_COINS.has(holding.asset)) {
      return;
    }
    const symbol = `${holding.asset}USDT`;
    if (!seen.has(symbol)) {
      seen.add(symbol);
      symbols.push(symbol);
    }
  });

  return symbols;
};

const fetchPriceMap = async (
  client: BinanceClient,
  symbols: string[]
): Promise<{ priceMap: Map<string, number>; unsupportedSymbols: string[] }> => {
  const priceMap = new Map<string, number>();
  const unsupportedSymbols: string[] = [];

  if (!symbols.length) {
    return { priceMap, unsupportedSymbols };
  }

  const uniqueSymbols = Array.from(
    new Set(symbols.map(symbol => symbol.toUpperCase()))
  );
  const MAX_SYMBOLS_PER_REQUEST = 100;

  for (let i = 0; i < uniqueSymbols.length; i += MAX_SYMBOLS_PER_REQUEST) {
    const chunk = uniqueSymbols.slice(i, i + MAX_SYMBOLS_PER_REQUEST);
    // eslint-disable-next-line no-await-in-loop
    await fetchChunk(chunk);
  }

  return { priceMap, unsupportedSymbols };

  async function fetchChunk(chunk: string[]) {
    try {
      const response = await client.getTickerPrices(chunk);
      response.data.forEach(price => {
        const parsed = Number(price.price);
        if (Number.isFinite(parsed)) {
          priceMap.set(price.symbol.toUpperCase(), parsed);
        }
      });
    } catch (error) {
      if (error instanceof BinanceApiError && error.code === -1121) {
        if (chunk.length === 1) {
          unsupportedSymbols.push(chunk[0]);
          return;
        }
        // eslint-disable-next-line no-await-in-loop
        for (const symbol of chunk) {
          // eslint-disable-next-line no-await-in-loop
          await fetchChunk([symbol]);
        }
        return;
      }
      throw error;
    }
  }
};

const buildBaseTimeline = (klines: KlinePoint[]): number[] =>
  klines.map(entry => entry.closeTime);

const mergeKlinesByIndex = (
  baseValues: number[],
  klines: KlinePoint[],
  quantity: number
) => {
  if (!baseValues.length || !klines.length || quantity <= 0) {
    return;
  }
  const overlap = Math.min(baseValues.length, klines.length);
  const baseStart = baseValues.length - overlap;
  const klineStart = klines.length - overlap;

  for (let i = 0; i < overlap; i += 1) {
    const kline = klines[klineStart + i];
    const closePrice = Number(kline.closePrice ?? 0);
    if (!Number.isFinite(closePrice)) {
      continue;
    }
    baseValues[baseStart + i] += quantity * closePrice;
  }
};

export async function GET(request: NextRequest) {
  const { userId, error } = await requireAuth(request);
  if (!userId) {
    return NextResponse.json(
      { error: error ?? 'Authentication required' },
      { status: 401 }
    );
  }

  const rangeParam = (request.nextUrl.searchParams.get('range') as HistoryRange) ?? '1M';
  const rangeConfig = RANGE_CONFIG[rangeParam];
  if (!rangeConfig) {
    return NextResponse.json(
      { error: 'Invalid range parameter' },
      { status: 400 }
    );
  }

  try {
    const encryptedCredentials = await getEncryptedBinanceCredentials(userId);
    if (!encryptedCredentials) {
      return NextResponse.json(
        { error: 'No Binance credentials found for user' },
        { status: 404 }
      );
    }

    const credentials = await getDecryptedBinanceCredentials(userId);
    if (!credentials) {
      return NextResponse.json(
        { error: 'Failed to decrypt Binance credentials' },
        { status: 500 }
      );
    }

    const client = createBinanceClient({
      apiKey: credentials.apiKey,
      apiSecret: credentials.apiSecret,
      useTestnet: credentials.useTestnet,
    });

    const accountResponse = await client.getAccountInformation();
    const holdings = extractHoldings(accountResponse.data);

    if (!holdings.length) {
      return NextResponse.json({ data: [] });
    }

    const priceAssetCandidates = holdings.filter(
      holding => !STABLE_COINS.has(holding.asset)
    );
    const stableAssets = holdings.filter(holding => STABLE_COINS.has(holding.asset));
    let priceAssets: PricedHolding[] = [];
    let unsupportedPriceSymbols: string[] = [];

    if (priceAssetCandidates.length) {
      const priceSymbols = buildPriceSymbols(priceAssetCandidates);
      const { priceMap, unsupportedSymbols } = await fetchPriceMap(
        client,
        priceSymbols
      );
      unsupportedPriceSymbols = unsupportedSymbols;

      priceAssets = priceAssetCandidates
        .map(holding => {
          const symbol = `${holding.asset}USDT`;
          const price = priceMap.get(symbol);
          if (!price || price <= 0) {
            return null;
          }
          return {
            ...holding,
            usdValue: price * holding.quantity,
          };
        })
        .filter((entry): entry is PricedHolding => entry !== null)
        .sort((a, b) => b.usdValue - a.usdValue)
        .slice(0, MAX_PRICE_ASSETS);
    }

    let timelineCloses: number[] = [];
    let timelineValues: number[] = [];

    if (priceAssets.length) {
      // Process assets with minimal rate limiting to avoid API limits
      const klinePromises = priceAssets.map(async (asset, index) => {
        // Add minimal delay between requests to avoid rate limiting
        if (index > 0) {
          await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay between requests
        }
        const symbol = `${asset.asset}USDT`;
        try {
          const response = await client.getKlines({
            symbol,
            interval: rangeConfig.interval,
            limit: rangeConfig.limit,
          });
          return {
            asset: asset.asset,
            quantity: asset.quantity,
            klines: response.data,
            success: true,
          };
        } catch (error) {
          if (error instanceof BinanceApiError && error.code === -1121) {
            return {
              asset: asset.asset,
              quantity: asset.quantity,
              klines: [],
              success: false,
            };
          }
          throw error;
        }
      });

      const results = await Promise.allSettled(klinePromises);
      const successfulResults = results
        .filter(result => result.status === 'fulfilled' && result.value.success && result.value.klines.length > 0)
        .map(result => (result as PromiseFulfilledResult<any>).value);

      if (successfulResults.length > 0) {
        // Use the first successful result as base timeline
        const baseResult = successfulResults[0];
        timelineCloses = buildBaseTimeline(baseResult.klines);
        timelineValues = baseResult.klines.map((point: KlinePoint) =>
          baseResult.quantity * Number(point.closePrice ?? 0)
        );

        // Merge remaining assets
        for (let i = 1; i < successfulResults.length; i++) {
          const result = successfulResults[i];
          mergeKlinesByIndex(timelineValues, result.klines, result.quantity);
        }
      } else {
        // No successful price data, create timeline with stable coins only
        console.warn('No successful price data retrieved, using generated timeline');
      }
    }

    if (!timelineCloses.length) {
      const generated = generateTimeline(rangeConfig);
      timelineCloses = generated;
      timelineValues = new Array(generated.length).fill(0);
    }

    if (stableAssets.length) {
      if (!timelineValues.length) {
        timelineCloses = generateTimeline(rangeConfig);
        timelineValues = new Array(timelineCloses.length).fill(0);
      }
      stableAssets.forEach(holding => {
        for (let i = 0; i < timelineValues.length; i += 1) {
          timelineValues[i] += holding.quantity;
        }
      });
    }

    // Calculate current portfolio value using existing data (no additional API calls)
    let currentPortfolioValue = 0;
    
    // Use the latest price data we already fetched for the chart
    if (priceAssets.length > 0 && timelineValues.length > 0) {
      // Get the most recent calculated value from our chart data
      currentPortfolioValue = timelineValues[timelineValues.length - 1] || 0;
    }
    
    // Add stable coin values
    stableAssets.forEach(asset => {
      currentPortfolioValue += asset.quantity;
    });

    const chartData = timelineCloses.map((timestamp, index) => ({
      label: rangeConfig.formatLabel(new Date(timestamp)),
      value: Number((timelineValues[index] ?? 0).toFixed(2)),
    }));

    // Add some validation to ensure data makes sense
    let validData = chartData.filter(point => 
      Number.isFinite(point.value) && point.value >= 0
    );

    // If we have no valid data, return empty array
    if (validData.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Get current portfolio value from query parameter for alignment
    const currentValueParam = request.nextUrl.searchParams.get('currentValue');
    const targetCurrentValue = currentValueParam ? Number(currentValueParam) : null;
    
    // CRITICAL FIX: Align chart data with current portfolio value if provided
    if (targetCurrentValue && targetCurrentValue > 0 && validData.length > 0) {
      const lastChartValue = validData[validData.length - 1].value;
      
      if (lastChartValue > 0) {
        // Calculate adjustment ratio to align with current portfolio value
        const adjustmentRatio = targetCurrentValue / lastChartValue;
        
        // Apply adjustment if there's any significant discrepancy
        const discrepancy = Math.abs(adjustmentRatio - 1);
        if (discrepancy > 0.01) { // More than 1% difference
          console.log(`Adjusting chart values by ratio ${adjustmentRatio.toFixed(4)} to align with current portfolio value (${targetCurrentValue} vs ${lastChartValue})`);
          
          validData = validData.map(point => ({
            ...point,
            value: Number((point.value * adjustmentRatio).toFixed(2))
          }));
          
          console.log(`Chart alignment complete. New last value: ${validData[validData.length - 1]?.value}`);
        } else {
          console.log(`Chart values already aligned (ratio: ${adjustmentRatio.toFixed(4)})`);
        }
      }
    }

    return NextResponse.json({ 
      data: validData,
      // Add metadata for debugging
      metadata: {
        originalDataPoints: chartData.length,
        validDataPoints: validData.length,
        range: rangeParam,
        assetsProcessed: holdings.length,
        priceAssets: priceAssets.length,
        stableAssets: stableAssets.length,
        unsupportedSymbols: unsupportedPriceSymbols,
        targetCurrentValue: targetCurrentValue,
        lastChartValue: validData[validData.length - 1]?.value ?? 0,
        alignmentApplied: targetCurrentValue && targetCurrentValue > 0 && validData.length > 0,
      }
    });
  } catch (err) {
    console.error('Error fetching portfolio history:', err);
    
    if (err instanceof BinanceApiError) {
      const timeoutCode = err.code as unknown as string | undefined;
      // Handle rate limiting with retry information
      if (err.isRateLimit) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded. Please wait a moment and try again.',
            code: err.code ?? null,
            isRateLimit: true,
            retryAfterMs: err.retryAfterMs ?? 60000, // Default 1 minute retry
          },
          { status: 429 }
        );
      }
      
      // Handle timestamp/recvWindow errors
      if (err.code === -1021 || err.message.includes('recvWindow') || err.message.includes('timestamp')) {
        return NextResponse.json(
          {
            error: 'Time synchronization issue. Please try again in a moment.',
            code: err.code ?? null,
            isTimestampError: true,
            retryAfterMs: 5000, // Retry after 5 seconds
          },
          { status: 400 }
        );
      }
      
      // Handle timeout errors
      if (timeoutCode === 'TIMEOUT' || timeoutCode === 'CONNECTION_TIMEOUT') {
        return NextResponse.json(
          {
            error: err.message,
            code: err.code ?? null,
            isTimeoutError: true,
            retryAfterMs: err.retryAfterMs || 10000,
          },
          { status: 408 } // Request Timeout
        );
      }
      
      return NextResponse.json(
        {
          error: err.message,
          code: err.code ?? null,
          isRateLimit: false,
        },
        { status: err.status || 400 }
      );
    }

    // For any other error, return a generic message with empty data
    return NextResponse.json(
      { 
        data: [],
        error: 'Unable to load chart data at this time. Please try again later.',
        metadata: {
          range: request.nextUrl.searchParams.get('range') ?? 'unknown',
          timestamp: new Date().toISOString(),
        }
      },
      { status: 200 } // Return 200 with empty data instead of 500
    );
  }
}


