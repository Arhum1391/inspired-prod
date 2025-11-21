'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import HoldingsTable, { HoldingRow } from '@/components/HoldingsTable';
import NewsletterSubscription from '@/components/forms/NewsletterSubscription';
import PortfolioBalanceCard, { TimeRange, ChartDatum } from '@/components/PortfolioBalanceCard';
import type { ComputedDatum, PieCustomLayerProps, PieLayer } from '@nivo/pie';

type CredentialsStatus = {
  connected: boolean;
  hasPassphrase: boolean;
  useTestnet: boolean;
  label: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type PortfolioSummaryResponse = {
  totalValue: number;
  totalValueComputedAssets: number;
  missingPriceAssets: string[];
  computedAt: string;
};

type PortfolioApiResponse = {
  holdings: HoldingRow[];
  summary: PortfolioSummaryResponse;
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

type AllocationSlice = {
  id: string;
  label: string;
  value: number;
  percentage: number;
  displayValue: string;
  color: string;
};

type AllocationDatum = AllocationSlice;

const COLOR_PALETTE = ['#DE50EC', '#05B0B3', '#3813F3', '#B9B9E9', '#4B25FD', '#EB72FF'];

const formatUSD = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 100000 ? 0 : 2,
  }).format(value);

const formatPercentValue = (value: number): string =>
  `${value.toFixed(value >= 10 ? 1 : 2)}%`;

const PREVIEW_HOLDINGS: HoldingRow[] = [
  {
    asset: 'BTC',
    free: 0.5,
    locked: 0,
    total: 0.5,
    unitPrice: 48000,
    unitPriceSymbol: 'BTC/USDT',
    value: 24000,
  },
  {
    asset: 'ETH',
    free: 3.2,
    locked: 0,
    total: 3.2,
    unitPrice: 2800,
    unitPriceSymbol: 'ETH/USDT',
    value: 8960,
  },
  {
    asset: 'BNB',
    free: 10,
    locked: 0,
    total: 10,
    unitPrice: 330,
    unitPriceSymbol: 'BNB/USDT',
    value: 3300,
  },
];

const PREVIEW_TOTAL_VALUE = PREVIEW_HOLDINGS.reduce((sum, holding) => sum + (holding.value ?? 0), 0);

const PREVIEW_ALLOCATION: AllocationSlice[] = PREVIEW_HOLDINGS.map((holding, index) => {
  const value = holding.value ?? 0;
  const percentage = PREVIEW_TOTAL_VALUE ? (value / PREVIEW_TOTAL_VALUE) * 100 : 0;
  return {
    id: holding.asset,
    label: holding.asset,
    value,
    percentage,
    displayValue: formatUSD(value),
    color: COLOR_PALETTE[index % COLOR_PALETTE.length],
  };
});

export default function PortfolioPage() {
  const { isAuthenticated: isSignedIn, isLoading } = useAuth();
  const router = useRouter();
  const isAuthenticated = isSignedIn;
  const [expandedTiles, setExpandedTiles] = useState<{ [key: number]: boolean }>({});
  const [isAddHoldingModalOpen, setAddHoldingModalOpen] = useState(false);
  const [nivoComponents, setNivoComponents] = useState<typeof import('@nivo/pie') | null>(null);
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [apiSecretValue, setApiSecretValue] = useState('');
  const [passphraseValue, setPassphraseValue] = useState('');
  const [labelValue, setLabelValue] = useState('');
  const [useTestnetValue, setUseTestnetValue] = useState(false);
  const [credentialsStatus, setCredentialsStatus] = useState<CredentialsStatus | null>(null);
  const [isFetchingCredentials, setIsFetchingCredentials] = useState(false);
  const [credentialError, setCredentialError] = useState<string | null>(null);
  const [isSavingCredentials, setIsSavingCredentials] = useState(false);
  const [isRemovingCredentials, setIsRemovingCredentials] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioApiResponse | null>(null);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [isFetchingPortfolio, setIsFetchingPortfolio] = useState(false);
  const [selectedChartRange, setSelectedChartRange] = useState<TimeRange>('1W');
  const [chartDataByRange, setChartDataByRange] = useState<Partial<Record<TimeRange, ChartDatum[]>>>({});
  const [chartLoadingRange, setChartLoadingRange] = useState<TimeRange | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    // Only load @nivo/pie when we actually need it (when user is authenticated and has data)
    if (!isAuthenticated) {
      return;
    }

    let mounted = true;
    import('@nivo/pie')
      .then(mod => {
        if (mounted) {
          setNivoComponents(mod);
        }
      })
      .catch(error => {
        console.error('Failed to load @nivo/pie', error);
      });

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  const toggleTile = (index: number) => {
    setExpandedTiles(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const hasConnectedApi = credentialsStatus?.connected ?? false;

  const allocationData = useMemo<AllocationSlice[]>(() => {
    if (!portfolioData?.holdings?.length) {
      return [];
    }

    const total = portfolioData.summary?.totalValueComputedAssets ?? 0;
    if (!total) {
      return [];
    }

    // Filter holdings with value > 0 and minimum threshold to avoid dust
    const validHoldings = portfolioData.holdings
      .filter(holding => {
        const value = holding.value ?? 0;
        return typeof value === 'number' && value > 0.01; // Minimum $0.01 threshold
      })
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    console.log('Portfolio allocation data:', {
      totalHoldings: portfolioData.holdings.length,
      validHoldings: validHoldings.length,
      total,
      holdings: validHoldings.map(h => ({ asset: h.asset, value: h.value }))
    });

    return validHoldings.map((holding, index) => {
      const value = holding.value ?? 0;
      const percentage = (value / total) * 100;
      return {
        id: holding.asset,
        label: holding.asset,
        value,
        percentage,
        displayValue: formatUSD(value),
        color: COLOR_PALETTE[index % COLOR_PALETTE.length],
      };
    });
  }, [portfolioData]);

  const totalPortfolioValue = portfolioData?.summary?.totalValueComputedAssets ?? 0;
  const displayedTotalValue =
    totalPortfolioValue > 0 ? totalPortfolioValue : portfolioData?.summary?.totalValue ?? null;
  const activeChartData = chartDataByRange[selectedChartRange];
  const chartChangePercent = useMemo(() => {
    if (!activeChartData || activeChartData.length < 2) {
      return null;
    }
    const first = activeChartData[0].value;
    const last = activeChartData[activeChartData.length - 1].value;
    if (!first || first <= 0) {
      return null;
    }
    return ((last - first) / first) * 100;
  }, [activeChartData, selectedChartRange]);

  const fetchCredentialsStatus = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    setIsFetchingCredentials(true);
    try {
      const response = await fetch('/api/portfolio/credentials', { method: 'GET', cache: 'no-store' });
      if (!response.ok) {
        if (response.status === 401) {
          setCredentialsStatus(null);
          return;
        }
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error ?? 'Failed to load credential status');
      }
      const data = (await response.json()) as CredentialsStatus;
      setCredentialsStatus({
        connected: !!data.connected,
        hasPassphrase: !!data.hasPassphrase,
        useTestnet: data.useTestnet ?? false,
        label: data.label ?? null,
        createdAt: data.createdAt ?? null,
        updatedAt: data.updatedAt ?? null,
      });
      if (!data.connected) {
        setPortfolioData(null);
      }
    } catch (error) {
      console.error('Failed to fetch Binance credential status', error);
      setCredentialsStatus(null);
    } finally {
      setIsFetchingCredentials(false);
    }
  }, [isAuthenticated]);

  const fetchPortfolioBalances = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated || !hasConnectedApi) {
      return;
    }
    
    // Prevent too frequent requests (minimum 30 seconds between calls)
    const now = Date.now();
    const lastFetch = localStorage.getItem('lastPortfolioFetch');
    if (!forceRefresh && lastFetch && (now - parseInt(lastFetch)) < 30000) {
      console.log('Skipping portfolio fetch - too recent');
      return;
    }
    
    setIsFetchingPortfolio(true);
    setPortfolioError(null);
    try {
      const response = await fetch('/api/portfolio/balances', { method: 'GET', cache: 'no-store' });
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        
        // Handle timestamp errors specifically
        if (errorPayload?.isTimestampError) {
          console.log('Timestamp error in portfolio balances, will retry in 5 seconds...');
          setTimeout(() => {
            if (hasConnectedApi && !portfolioData) {
              console.log('Retrying portfolio balances fetch after timestamp error...');
              fetchPortfolioBalances();
            }
          }, 5000);
          setPortfolioError('Time synchronization issue. Retrying automatically...');
          return;
        }
        
        // Handle timeout errors specifically
        if (errorPayload?.isTimeoutError) {
          const retryDelay = errorPayload.retryAfterMs || 10000;
          console.log(`Connection timeout in portfolio balances, will retry in ${retryDelay}ms...`);
          setTimeout(() => {
            if (hasConnectedApi && !portfolioData) {
              console.log('Retrying portfolio balances fetch after timeout...');
              fetchPortfolioBalances();
            }
          }, retryDelay);
          setPortfolioError('Connection timeout. Retrying automatically...');
          return;
        }
        
        const message = errorPayload?.error ?? 'Failed to load portfolio data';
        throw new Error(message);
      }
      const data = (await response.json()) as PortfolioApiResponse;
      setPortfolioData(data);
      
      // Cache successful fetch timestamp
      localStorage.setItem('lastPortfolioFetch', now.toString());
    } catch (error) {
      console.error('Failed to fetch Binance balances', error);
      setPortfolioError(error instanceof Error ? error.message : 'Failed to load portfolio data');
      setPortfolioData(null);
    } finally {
      setIsFetchingPortfolio(false);
    }
  }, [hasConnectedApi, isAuthenticated]);

  useEffect(() => {
    fetchCredentialsStatus();
  }, [fetchCredentialsStatus]);

  useEffect(() => {
    if (hasConnectedApi) {
      fetchPortfolioBalances();
    }
  }, [fetchPortfolioBalances, hasConnectedApi]);

  const fetchChartData = useCallback(
    async (range: TimeRange, forceRefresh = false) => {
      if (!hasConnectedApi || (!forceRefresh && chartDataByRange[range]) || chartLoadingRange === range) {
        return;
      }
      
      // Prevent too frequent chart requests (minimum 60 seconds for same range)
      const now = Date.now();
      const cacheKey = `lastChartFetch_${range}`;
      const lastFetch = localStorage.getItem(cacheKey);
      if (!forceRefresh && lastFetch && (now - parseInt(lastFetch)) < 60000) {
        console.log(`Skipping chart fetch for ${range} - too recent`);
        return;
      }

      setChartLoadingRange(range);
      setChartError(null);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        // Pass current portfolio value for alignment
        const currentValue = displayedTotalValue && displayedTotalValue > 0 ? displayedTotalValue : '';
        const url = `/api/portfolio/history?range=${range}${currentValue ? `&currentValue=${currentValue}` : ''}`;
        
        const response = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 429) {
            // Rate limit error - show specific message
            throw new Error(payload?.error ?? 'Rate limit exceeded. Please wait a moment and try again.');
          }
          if (payload?.isTimestampError) {
            // Timestamp synchronization error - show specific message
            throw new Error('Time synchronization issue with Binance API. Please try again in a moment.');
          }
          throw new Error(payload?.error ?? 'Failed to load portfolio chart data');
        }

        const data = Array.isArray(payload?.data)
          ? (payload.data as Array<{ label: string; value: number }>).map(point => ({
              label: String(point.label ?? ''),
              value: Number(point.value ?? 0),
            }))
          : [];
        
        // Handle case where API returns empty data but with an error message
        if (data.length === 0 && payload?.error) {
          console.warn('API returned empty data with message:', payload.error);
          setChartError(payload.error);
        } else {
          // Validate chart data alignment with current portfolio value
          if (data.length > 0 && displayedTotalValue && displayedTotalValue > 0) {
            const lastChartValue = data[data.length - 1]?.value ?? 0;
            const discrepancy = Math.abs(lastChartValue - displayedTotalValue) / displayedTotalValue;
            
            if (discrepancy > 0.1) { // More than 10% difference
              console.warn(`Chart data misalignment detected: Chart end value ${lastChartValue}, Portfolio value ${displayedTotalValue}`);
            }
          }
        }
        
        setChartDataByRange(prev => ({ ...prev, [range]: data }));
        
        // Cache successful chart fetch timestamp
        localStorage.setItem(cacheKey, now.toString());
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('Chart data request timed out');
          setChartError('Request timed out. Please try again.');
        } else {
        console.error('Failed to fetch portfolio history', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to load portfolio chart data';
          
          // Auto-retry for timestamp errors after a short delay
          if (errorMessage.includes('Time synchronization issue')) {
            console.log('Timestamp error detected, will retry in 5 seconds...');
            setTimeout(() => {
              if (!chartDataByRange[range]) {
                console.log('Retrying chart data fetch after timestamp error...');
                fetchChartData(range);
              }
            }, 5000);
            setChartError('Time synchronization issue. Retrying automatically...');
          } else if (errorMessage.includes('Connection timeout') || errorMessage.includes('Request timeout')) {
            console.log('Timeout error detected, will retry in 10 seconds...');
            setTimeout(() => {
              if (!chartDataByRange[range]) {
                console.log('Retrying chart data fetch after timeout...');
                fetchChartData(range);
              }
            }, 10000);
            setChartError('Connection timeout. Retrying automatically...');
          } else {
            setChartError(errorMessage);
          }
        }
        setChartDataByRange(prev => {
          if (prev[range]) {
            return prev;
          }
          return { ...prev, [range]: [] };
        });
      } finally {
        setChartLoadingRange(prev => (prev === range ? null : prev));
      }
    },
    [hasConnectedApi, chartDataByRange, chartLoadingRange]
  );

  useEffect(() => {
    if (!hasConnectedApi) {
      setChartDataByRange({});
      setChartLoadingRange(null);
      setChartError(null);
      setSelectedChartRange('1W');
    }
  }, [hasConnectedApi]);

  useEffect(() => {
    if (!hasConnectedApi) {
      return;
    }
    if (chartDataByRange['1W'] || chartLoadingRange === '1W') {
      return;
    }
    fetchChartData('1W');
  }, [hasConnectedApi, chartDataByRange, chartLoadingRange, fetchChartData]);

  useEffect(() => {
    if (!hasConnectedApi) {
      return;
    }
    if (chartDataByRange[selectedChartRange] || chartLoadingRange === selectedChartRange) {
      return;
    }
    fetchChartData(selectedChartRange);
  }, [hasConnectedApi, selectedChartRange, chartDataByRange, chartLoadingRange, fetchChartData]);

  const openAddHoldingModal = () => {
    setCredentialError(null);
    setApiKeyValue('');
    setApiSecretValue('');
    setPassphraseValue('');
    setLabelValue(credentialsStatus?.label ?? '');
    setUseTestnetValue(credentialsStatus?.useTestnet ?? false);
    setAddHoldingModalOpen(true);
  };

  const closeAddHoldingModal = () => {
    setAddHoldingModalOpen(false);
    setApiKeyValue('');
    setApiSecretValue('');
    setPassphraseValue('');
    setLabelValue('');
    setUseTestnetValue(false);
    setCredentialError(null);
  };

  const handleConfirmAddHolding = async () => {
    if (!apiKeyValue.trim() || !apiSecretValue.trim()) {
      setCredentialError('API key and secret are required.');
      return;
    }

    setCredentialError(null);
    setIsSavingCredentials(true);

    try {
      const response = await fetch('/api/portfolio/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKeyValue.trim(),
          apiSecret: apiSecretValue.trim(),
          passphrase: passphraseValue.trim() || undefined,
          label: labelValue.trim() || undefined,
          useTestnet: useTestnetValue,
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error ?? 'Failed to store credentials');
      }

      closeAddHoldingModal();
      await fetchCredentialsStatus();
      await fetchPortfolioBalances();
    } catch (error) {
      console.error('Failed to store Binance credentials', error);
      setCredentialError(error instanceof Error ? error.message : 'Failed to store credentials');
    } finally {
      setIsSavingCredentials(false);
    }
  };

  const handleDisconnect = async () => {
    setIsRemovingCredentials(true);
    try {
      const response = await fetch('/api/portfolio/credentials', { method: 'DELETE' });
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error ?? 'Failed to remove credentials');
      }
      setPortfolioData(null);
      await fetchCredentialsStatus();
    } catch (error) {
      console.error('Failed to delete Binance credentials', error);
      setCredentialError(error instanceof Error ? error.message : 'Failed to delete credentials');
    } finally {
      setIsRemovingCredentials(false);
    }
  };

  const handleChartRangeChange = useCallback((range: TimeRange) => {
    setSelectedChartRange(range);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  const handleApiKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApiKeyValue(event.target.value);
  };

  const handleApiSecretChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApiSecretValue(event.target.value);
  };

  const handlePassphraseChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassphraseValue(event.target.value);
  };

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLabelValue(event.target.value);
  };

  const handleUseTestnetToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setUseTestnetValue(event.target.checked);
  };

  const AllocationDistributionCard = ({
    slices,
    isLoading,
  }: {
    slices: AllocationSlice[];
    isLoading: boolean;
  }) => {
    const ResponsivePie = nivoComponents?.ResponsivePie;
    const isChartReady = ResponsivePie && !isLoading && slices.length > 0;
    const chartData = useMemo<AllocationDatum[]>(
      () =>
        slices.map(slice => ({
          id: slice.id,
          label: slice.label,
          value: slice.value,
          percentage: slice.percentage,
          displayValue: slice.displayValue,
          color: slice.color,
        })),
      [slices]
    );

    const { gradientAngles, chartColors, gradientDefs, gradientFill } = useMemo(() => {
      const presetAngles = [35.87, 27.79, 92.41, 140, 185, 225];
      const angles = chartData.map((datum, index) => presetAngles[index % presetAngles.length]);
      const colors = chartData.map(() => '#141414');
      
      const defs = chartData.map((datum, index) => {
        const angle = angles[index];
          const angleRad = ((angle - 90) * Math.PI) / 180;
          const length = 0.707;
          const x1 = 0.5 - length * Math.cos(angleRad);
          const y1 = 0.5 - length * Math.sin(angleRad);
          const x2 = 0.5 + length * Math.cos(angleRad);
          const y2 = 0.5 + length * Math.sin(angleRad);

          return {
            id: `allocation-gradient-${datum.id}`,
            type: 'linearGradient' as const,
            colors: [
              { offset: 0, color: '#141414', opacity: 1 },
              { offset: 3.62, color: '#141414', opacity: 1 },
              { offset: 96.98, color: '#3A3A3A', opacity: 1 },
              { offset: 100, color: '#3A3A3A', opacity: 1 },
            ],
            x1,
            y1,
            x2,
            y2,
            gradientUnits: 'objectBoundingBox' as const,
          };
      });

      const fill = chartData.map(datum => ({
          match: { id: datum.id } as const,
          id: `allocation-gradient-${datum.id}`,
      }));

      return {
        gradientAngles: angles,
        chartColors: colors,
        gradientDefs: defs,
        gradientFill: fill,
      };
    }, [chartData]);


    // Simplified pie chart without complex connectors
    const pieLayers = useMemo<PieLayer<AllocationDatum>[]>(
      () => ['arcs'],
      []
    );

    if (isLoading || !nivoComponents) {
      return (
        <div className="relative flex h-[344px] w-[413px] flex-col gap-6 overflow-hidden rounded-2xl bg-[#1F1F1F] p-5">
          <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/10" />
          <div className="flex flex-col gap-4">
            <div className="h-6 w-40 animate-pulse rounded bg-white/15" />
            <div className="h-[200px] w-full animate-pulse rounded-full bg-white/5" />
            <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      );
    }

    if (!chartData.length) {
      return (
        <div className="relative flex h-[344px] w-[413px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#1F1F1F] p-5 text-center text-sm text-white/70">
          <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/10" />
          <span>No allocation data available. Add holdings to see distribution.</span>
        </div>
      );
    }

    return (
      <div className="relative flex h-[344px] w-[413px] flex-col overflow-hidden rounded-2xl bg-[#1F1F1F] p-4">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: '16px',
            background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
            padding: '1px',
          }}
        >
          <div
            className="w-full h-full rounded-[15px]"
            style={{
              background: '#1F1F1F',
            }}
          ></div>
        </div>
        
        {/* Header */}
        <div className="relative z-10 flex w-full items-center mb-3">
          <span className="text-[20px] font-[400] leading-[1.3] text-white" style={{ fontFamily: 'Gilroy-SemiBold' }}>
            Allocation
          </span>
        </div>

        {/* Chart and Legend Side by Side */}
        <div className="relative z-10 flex w-full flex-1 gap-4">
          {/* Pie Chart */}
          <div className="flex-shrink-0 w-[180px] h-[180px]">
            {isChartReady ? (
              React.createElement(ResponsivePie as any, {
                data: chartData,
                margin: { top: 10, right: 10, bottom: 10, left: 10 },
                innerRadius: 0.35,
                padAngle: 0.5,
                cornerRadius: 1,
                activeOuterRadiusOffset: 4,
                sortByValue: false, // Keep original order to maintain consistency
                enableArcLinkLabels: false,
                enableArcLabels: false,
                borderWidth: 2,
                borderColor: '#1F1F1F',
                colors: (datum: any) => datum.data.color,
                startAngle: 0,
                endAngle: 360,
                fit: true,
                theme: {
                  background: 'transparent',
                  tooltip: {
                    container: {
                      background: '#1F1F1F',
                      color: '#FFFFFF',
                      fontFamily: 'Gilroy-Medium',
                      fontSize: 12,
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '8px 12px',
                    },
                  },
                },
                tooltip: ({ datum }: any) => (
                  <div style={{ padding: '4px 8px' }}>
                    <strong>{datum.data.label}</strong>
                    <br />
                    {datum.data.displayValue} ({formatPercentValue(datum.data.percentage)})
                  </div>
                ),
                legends: [],
              })
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
                {ResponsivePie ? 'No data available' : 'Loading chart...'}
              </div>
            )}
          </div>
          
          {/* Legend */}
          {isChartReady && chartData.length > 0 && (
            <div className="flex-1 flex flex-col justify-center">
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
                {chartData.map((datum) => (
                  <div key={datum.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: datum.color }}
                      />
                      <span className="text-white font-medium truncate">{datum.label}</span>
                    </div>
                    <div className="flex flex-col items-end text-right ml-2 flex-shrink-0">
                      <span className="text-white text-xs font-medium">{formatPercentValue(datum.percentage)}</span>
                      <span className="text-white/60 text-xs">{datum.displayValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Total Assets Count */}
        {isChartReady && chartData.length > 0 && (
          <div className="relative z-10 mt-3 pt-2 border-t border-white/10">
            <div className="text-xs text-white/60 text-center">
              {chartData.length} Asset{chartData.length !== 1 ? 's' : ''} • Total Portfolio
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        button:focus,
        button:active,
        button:focus-visible {
          outline: none !important;
        }
        button:focus {
          border: inherit !important;
        }
        button:active {
          border: inherit !important;
        }
        /* Portfolio hero mobile styles (match research page patterns) */
        @media (max-width: 768px) {
          .portfolio-hero-container {
            padding-top: 112px !important;
            padding-bottom: 64px !important;
          }
          .portfolio-section-wrapper {
            width: 100% !important;
            max-width: 375px !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .portfolio-hero-logo {
            display: none !important;
          }
          .portfolio-title {
            width: 343px !important;
            height: auto !important;
            min-height: 38px !important;
            margin-top: 0 !important;
            font-size: 32px !important;
            line-height: 120% !important;
          }
          .portfolio-description {
            width: 343px !important;
            margin-top: 12px !important;
          }
          .portfolio-background-svg {
            width: 1100px !important;
            height: 565px !important;
            left: -400px !important;
            top: -120px !important;
            rotate: -8deg !important;
          }
          /* Move 'Your Portfolio' sections up on mobile */
          .portfolio-auth-section {
            margin: 160px auto 0 auto !important;
          }
          .portfolio-guest-section {
            margin: 48px auto 0 !important;
          }
          /* Make Binance connect panel a bit wider on mobile */
          .portfolio-connect-tile {
            padding: 20px 12px !important;
          }
          .portfolio-connect-inner {
            max-width: 373px !important; /* slightly wider than 343 */
            width: 100% !important;
          }
          /* Auth cards row: stack graph and pie chart */
          .portfolio-auth-section {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .portfolio-auth-cards-row {
            flex-direction: column !important;
            align-items: center !important;
            gap: 20px !important;
            width: 100% !important;
            max-width: 343px !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          /* Graph card sizing on mobile */
          .portfolio-graph-card {
            width: 343px !important;
            height: 260px !important;
            border-radius: 10px !important;
          }
          .portfolio-graph-card > .absolute {
            border-radius: 10px !important;
          }
          /* Ensure inner card min-height fits the wrapper to avoid clipping */
          .portfolio-graph-card .min-h-\[344px\] {
            min-height: 260px !important;
          }
          /* Keep internal chart area visible within available height */
          .portfolio-graph-card .h-\[200px\] {
            height: 200px !important;
          }
          /* Allocation card sizing on mobile */
          .portfolio-allocation-card > div {
            width: 343px !important;
            height: 316px !important;
            border-radius: 10px !important;
            padding: 20px 12px !important;
          }
          /* Match calculator FAQ mobile styles */
          .portfolio-faq-header {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 0 !important;
            gap: 24px !important;
            width: 343px !important;
            height: 140px !important;
            margin: 48px auto 0 !important;
          }
          .portfolio-faq-header h2,
          .portfolio-faq-title {
            width: 343px !important;
            height: 84px !important;
            font-size: 32px !important;
            line-height: 130% !important;
            text-align: center !important;
            margin: 0 !important;
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
          }
          .portfolio-faq-header p,
          .portfolio-faq-desc {
            width: 343px !important;
            height: 32px !important;
            font-size: 16px !important;
            line-height: 100% !important;
            text-align: center !important;
            margin: 0 !important;
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
          }
          .portfolio-faq-container {
            width: 100% !important;
            max-width: 373px !important;
            gap: 16px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .portfolio-faq-item {
            width: 100% !important;
            max-width: 373px !important;
            padding: 20px !important;
            border-radius: 16px !important;
          }
          /* Stack buttons vertically on mobile */
          .portfolio-buttons-container {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .portfolio-buttons-wrapper {
            flex-direction: column !important;
            width: 100% !important;
            max-width: 343px !important;
            gap: 12px !important;
          }
          .portfolio-manage-button,
          .portfolio-disconnect-button {
            width: 100% !important;
            max-width: 343px !important;
          }
        }
      `}} />
      <Navbar />
      
      {/* Background SVG Gradient */}
      <svg 
        className="absolute pointer-events-none portfolio-background-svg"
        style={{
          left: '-500px',
          top: '-80px',
          width: '1686.4px',
          height: '934.41px',
          rotate: '-12deg',
          zIndex: 0,
        }}
        viewBox="0 0 635 728" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <g filter="url(#filter0_f_portfolio)">
          <path d="M-323.419 -963.166C-339.01 -913.804 -341.542 -793.642 -219.641 -721.835C68.1756 -552.293 47.4452 -238.748 50.2608 -183.474C54.8056 -94.2532 60.7748 113.384 232.274 209.929C361.298 282.563 423.638 276.679 416.511 277.203L434.837 526.531C384.709 530.216 273.76 520.175 109.635 427.781C-199.701 253.642 -196.356 -110.679 -199.416 -170.757C-204.206 -264.783 -195.12 -417.24 -346.527 -506.428C-604.593 -658.445 -598.186 -923.295 -561.811 -1038.46L-323.419 -963.166Z" fill="url(#paint0_linear_portfolio)" opacity="1"/>
        </g>
        <defs>
          <filter id="filter0_f_portfolio" x="-780.181" y="-1238.46" width="1415.02" height="1965.62" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_portfolio"/>
          </filter>
          <linearGradient id="paint0_linear_portfolio" x1="-442.615" y1="-1000.81" x2="328.493" y2="452.779" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3813F3"/>
            <stop offset="0.307692" stopColor="#DE50EC"/>
            <stop offset="0.543269" stopColor="#B9B9E9"/>
            <stop offset="0.740385" stopColor="#4B25FD"/>
            <stop offset="0.9999" stopColor="#05B0B3"/>
          </linearGradient>
        </defs>
      </svg>
      
      {/* Main Content */}
      <div className="relative z-10">
        <div className="min-h-screen pt-32 pb-32 px-4 sm:px-6 lg:px-8 flex items-start portfolio-hero-container">
          <div className="max-w-7xl mx-auto w-full relative portfolio-section-wrapper">
            {/* Vector Logo */}
            <svg
              width="538"
              height="633"
              viewBox="0 0 538 633"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                left: '847px',
                top: '-50px',
                transform: 'rotate(5deg)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
              className="portfolio-hero-logo"
            >
              <g opacity="0.5">
                <path d="M485.003 448.627C449.573 580.853 314.193 659.464 182.624 624.21C51.0543 588.956 -26.8824 453.187 8.54736 320.961C43.9772 188.735 179.378 110.129 310.947 145.383L478.648 190.318C517.106 200.623 558.36 174.855 558.36 174.855L485.003 448.627ZM266.707 306.134C223.047 294.435 178.123 320.521 166.366 364.399C154.609 408.277 180.471 453.33 224.131 465.029C267.791 476.727 312.715 450.641 324.472 406.763L345.76 327.316L266.707 306.134Z" fill="url(#paint0_linear_vector_logo_portfolio)"/>
                <path d="M417.104 61.0593C428.861 17.1816 473.785 -8.90461 517.445 2.79402C561.105 14.4926 586.967 59.5461 575.21 103.424C563.453 147.301 518.529 173.388 474.869 161.689L395.816 140.507L417.104 61.0593Z" fill="url(#paint1_linear_vector_logo_portfolio)"/>
              </g>
              <defs>
                <linearGradient id="paint0_linear_vector_logo_portfolio" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="1" stopColor="#1F1F1F"/>
                </linearGradient>
                <linearGradient id="paint1_linear_vector_logo_portfolio" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="1" stopColor="#1F1F1F"/>
                </linearGradient>
              </defs>
            </svg>
            
            {/* Title - Left Middle */}
            <h1
              style={{
                width: '630px',
                height: '174px',
                fontFamily: 'Gilroy-SemiBold',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '48px',
                lineHeight: '120%',
                color: '#FFFFFF',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0,
                marginTop: '120px',
                position: 'relative',
                zIndex: 2,
              }}
              className="portfolio-title"
            >
              {isAuthenticated 
                ? 'Your Portfolio - Track Allocation, P/L, and Performance in One View'
                : 'Unlock the full experience with Inspired Analyst Premium'
              }
            </h1>
            {/* Description */}
            <p
              style={{
                width: '630px',
                fontFamily: 'Gilroy-Medium',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '130%',
                color: '#FFFFFF',
                marginTop: '24px',
              }}
              className="portfolio-description"
            >
              {isAuthenticated
                ? 'Analyze your holdings, visualize profit & loss, and monitor diversification over time. Built for clarity and accountability.'
                : 'Full research library, Position Sizing Calculator (save scenarios), portfolio analytics, and Shariah project details. Cancel anytime.'
              }
            </p>
            {/* Bullet Points */}
            {!isAuthenticated && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '16px',
                width: '630px',
                height: '112px',
                flex: 'none',
                order: 2,
                alignSelf: 'stretch',
                flexGrow: 0,
                marginTop: '24px',
              }}
            >
              {/* Bullet 1 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '323px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Deep-dive reports with downloadable PDFs
                </span>
              </div>
              
              {/* Bullet 2 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '246px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Position sizing tailored to your risk
                </span>
              </div>
              
              {/* Bullet 3 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '247px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Portfolio allocation & P/L tracking
                </span>
              </div>
              
              {/* Bullet 4 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 3,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '299px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Shariah methodology & detailed screens
                </span>
              </div>
            </div>
            )}
            {/* Buttons Container */}
            {!isAuthenticated && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '20px',
                width: '414px',
                height: '50px',
                flex: 'none',
                order: 3,
                flexGrow: 0,
                marginTop: '32px',
              }}
            >
              {/* Button 1 */}
              <button
                style={{
                  padding: '12px 32px',
                  background: '#FFFFFF',
                  color: '#0A0A0A',
                  borderRadius: '100px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontSize: '14px',
                  fontWeight: 400,
                  border: 'none',
                  cursor: 'pointer',
                  flex: 'none',
                  minWidth: '180px',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                }}
                onMouseDown={(e) => e.preventDefault()}
                onFocus={(e) => e.currentTarget.style.outline = 'none'}
                onClick={() => router.push('/pricing')}
              >
                Start Subscription
              </button>
              {/* Button 2 */}
              <button
                style={{
                  padding: '12px 32px',
                  background: '#000000',
                  color: '#FFFFFF',
                  borderRadius: '100px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontSize: '14px',
                  fontWeight: 400,
                  border: '1px solid #FFFFFF',
                  cursor: 'pointer',
                  flex: 'none',
                  minWidth: '180px',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.border = '1px solid #FFFFFF';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.border = '1px solid #FFFFFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '1px solid #FFFFFF';
                }}
              >
                Watch Free Videos
              </button>
            </div>
            )}

            {isAuthenticated && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '64px',
                width: '100%',
                maxWidth: '1280px',
                margin: '300px auto 0 auto',
              }}
              className="portfolio-auth-section"
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '24px',
                  width: '100%',
                }}
              >
                <div
                  className="portfolio-buttons-container"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    width: '100%',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '36px',
                      lineHeight: '130%',
                      color: '#FFFFFF',
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    Your Portfolio
                  </h2>
                  <div className="portfolio-buttons-wrapper" style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="portfolio-manage-button"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '12px 16px',
                        gap: '4px',
                        width: '180px',
                        height: '48px',
                        background: '#FFFFFF',
                        borderRadius: '100px',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'Gilroy-SemiBold',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#404040',
                      }}
                      onClick={openAddHoldingModal}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px',
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 3.33337V12.6667"
                            stroke="#404040"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.33398 8H12.6673"
                            stroke="#404040"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {hasConnectedApi ? 'Manage API Key' : 'Connect Binance'}
                    </button>
                    {hasConnectedApi ? (
                      <button
                        type="button"
                        className="portfolio-disconnect-button"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '12px 16px',
                          gap: '4px',
                          width: '180px',
                          height: '48px',
                          background: 'transparent',
                          borderRadius: '100px',
                          border: '1px solid rgba(255,255,255,0.4)',
                          cursor: 'pointer',
                          fontFamily: 'Gilroy-SemiBold',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                        }}
                        onClick={handleDisconnect}
                        disabled={isRemovingCredentials}
                      >
                        {isRemovingCredentials ? 'Disconnecting…' : 'Disconnect'}
                      </button>
                    ) : null}
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  Track allocation, P/L, and trends - all in one place.
                </p>
                {hasConnectedApi && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: '#FFFFFF',
                      fontFamily: 'Gilroy-Medium',
                      fontSize: '14px',
                    }}
                  >
                    <span>Connected to Binance</span>
                    <span style={{ color: '#DE50EC' }}>
                      {credentialsStatus?.useTestnet ? 'Testnet' : 'Mainnet'}
                    </span>
                    {credentialsStatus?.label ? (
                      <span style={{ color: '#9D9D9D' }}>· {credentialsStatus.label}</span>
                    ) : null}
                  </div>
                )}
              </div>

              <div style={{ width: '100%' }}>
                {hasConnectedApi ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '1280px',
                  }}
                  className="portfolio-auth-cards-row"
                >
                  <div
                      style={{
                        position: 'relative',
                        width: '847px',
                        height: '344px',
                        borderRadius: '16px',
                        background: '#1F1F1F',
                        overflow: 'hidden',
                      }}
                    className="portfolio-graph-card"
                    >
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          borderRadius: '16px',
                          background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                          padding: '1px',
                        }}
                      >
                        <div
                          className="w-full h-full rounded-[15px]"
                          style={{
                            background: '#1F1F1F',
                          }}
                        ></div>
                      </div>
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        height: '100%',
                        borderRadius: '15px',
                      }}
                    >
                      <PortfolioBalanceCard
                        totalValue={displayedTotalValue}
                        changePercent={chartChangePercent ?? undefined}
                        chartData={activeChartData}
                        isLoading={isFetchingPortfolio}
                        isChartLoading={chartLoadingRange === selectedChartRange}
                        lastUpdated={portfolioData?.summary?.computedAt ?? null}
                        selectedRange={selectedChartRange}
                        onRangeChange={handleChartRangeChange}
                      />
                    </div>
                    </div>
                  {chartError && (
                    <div className="mt-4 w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {chartError}
                    </div>
                  )}
                    <div className="portfolio-allocation-card">
                      <AllocationDistributionCard
                        slices={allocationData}
                        isLoading={isFetchingPortfolio}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '100px',
                      gap: '40px',
                      width: '100%',
                      background: '#1F1F1F',
                      borderRadius: '16px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    className="portfolio-connect-tile"
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        borderRadius: '16px',
                        background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                        padding: '1px',
                      }}
                    >
                      <div
                        className="w-full h-full rounded-[15px]"
                        style={{
                          background: '#1F1F1F',
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '24px',
                        width: '100%',
                        maxWidth: '1240px',
                      }}
                      className="portfolio-connect-inner"
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '24px',
                          width: '100%',
                        }}
                      >
                        <h3
                          style={{
                            width: '100%',
                            fontFamily: 'Gilroy-SemiBold',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '24px',
                            lineHeight: '100%',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            margin: 0,
                          }}
                        >
                          Connect Your Binance Account
                        </h3>
                        <p
                          style={{
                            width: '100%',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '100%',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            margin: 0,
                          }}
                        >
                          Securely connect your Binance API key to load balances, allocation, and performance in real-time.
                        </p>
                      </div>
                      <button
                        type="button"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '12px 16px',
                          gap: '10px',
                          width: '180px',
                          height: '48px',
                          background: '#FFFFFF',
                          borderRadius: '100px',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'Gilroy-SemiBold',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          color: '#404040',
                        }}
                        onClick={openAddHoldingModal}
                      >
                        Connect Binance
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {hasConnectedApi && (
                <div className="mt-[116px] w-full">
                  <HoldingsTable
                    holdings={portfolioData?.holdings ?? []}
                    totalValue={totalPortfolioValue}
                    isLoading={isFetchingPortfolio}
                    error={portfolioError}
                    missingPriceAssets={portfolioData?.summary?.missingPriceAssets}
                  />
                </div>
              )}
            </div>
            )}

            {!isAuthenticated && (
            <>
            <div
              style={{
                position: 'relative',
                width: '1280px',
                maxWidth: '100%',
                margin: '120px auto 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '64px',
              }}
              className="portfolio-guest-section"
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '24px',
                  width: '100%',
                }}
              >
                <h2
                  style={{
                    width: '100%',
                    maxWidth: '1280px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '36px',
                    lineHeight: '130%',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  Your Portfolio
                </h2>
                <p
                  style={{
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  Sample view—subscribe to add holdings and track P/L.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '20px',
                  width: '100%',
                  maxWidth: '1280px',
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    width: '847px',
                    height: '344px',
                    borderRadius: '16px',
                    background: '#1F1F1F',
                    position: 'relative',
                  }}
                >
                  <Image
                    src="/graph.svg"
                    alt="Portfolio preview chart"
                    width={847}
                    height={344}
                    priority
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>

                <div className="relative">
                  <AllocationDistributionCard
                    slices={allocationData.length ? allocationData : PREVIEW_ALLOCATION}
                    isLoading={false}
                  />
                <div
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                      background: 'linear-gradient(180deg, rgba(10, 10, 10, 0) 0%, #0A0A0A 100%)',
                        }}
                      ></div>
                    </div>
                          </div>
            </div>
            <div
              style={{
                marginTop: '150px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <HoldingsTable
                holdings={PREVIEW_HOLDINGS}
                totalValue={PREVIEW_TOTAL_VALUE}
                isLoading={false}
              />
            </div>
            </>
            )}
            
            {/* Big Gap */}
            <div style={{ marginTop: isAuthenticated ? '220px' : '160px' }}></div>
            
            {/* Ready to unlock full access Tile */}
            {!isAuthenticated && (
            <div
              className="relative overflow-hidden"
              style={{
                width: '1064px',
                height: '247px',
                borderRadius: '16px',
                background: '#1F1F1F',
                padding: '40px',
                gap: '10px',
                boxSizing: 'border-box',
                marginTop: '0px',
                marginBottom: '220px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* Curved Gradient Border */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                }}
              >
                <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
              </div>

              {/* Gradient Ellipse - Top Left */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  width: '588px',
                  height: '588px',
                  left: '-403px',
                  top: '-510px',
                  background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                  filter: 'blur(200px)',
                  transform: 'rotate(90deg)',
                  flex: 'none',
                  flexGrow: 0,
                  zIndex: 0,
                  borderRadius: '50%'
                }}
              ></div>

              {/* Gradient Ellipse - Bottom Right */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  width: '588px',
                  height: '588px',
                  left: '739px',
                  bottom: '-510px',
                  background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                  filter: 'blur(200px)',
                  transform: 'rotate(90deg)',
                  flex: 'none',
                  flexGrow: 0,
                  zIndex: 1,
                  borderRadius: '50%'
                }}
              ></div>
              
              {/* Content */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center" style={{ gap: '10px' }}>
                {/* Frame 81 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '24px',
                    width: '461px',
                    height: '77px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                >
                  {/* Title */}
                  <h2
                    style={{
                      width: '461px',
                      height: '32px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '32px',
                      lineHeight: '100%',
                      textAlign: 'center',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      margin: 0,
                    }}
                  >
                    Ready to unlock full access?
                  </h2>
                  
                  {/* Description */}
                  <p
                    style={{
                      width: '461px',
                      height: '21px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '130%',
                      textAlign: 'center',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      margin: 0,
                    }}
                  >
                    Join thousands of informed investors making better decisions.
                  </p>
                </div>
                
                {/* Buttons Container */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '20px',
                    width: '414px',
                    height: '50px',
                    flex: 'none',
                    flexGrow: 0,
                    marginTop: '24px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  {/* Button 1 */}
                  <button
                    style={{
                      padding: '12px 32px',
                      background: '#FFFFFF',
                      color: '#0A0A0A',
                      borderRadius: '100px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '14px',
                      fontWeight: 400,
                      border: 'none',
                      cursor: 'pointer',
                      flex: 'none',
                      minWidth: '180px',
                      whiteSpace: 'nowrap',
                      outline: 'none',
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onFocus={(e) => e.currentTarget.style.outline = 'none'}
                    onClick={() => router.push('/pricing')}
                  >
                    Start Subscription
                  </button>
                  {/* Button 2 */}
                  <button
                    style={{
                      padding: '12px 32px',
                      background: 'transparent',
                      color: '#FFFFFF',
                      borderRadius: '100px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '14px',
                      fontWeight: 400,
                      border: '1px solid #FFFFFF',
                      cursor: 'pointer',
                      flex: 'none',
                      minWidth: '180px',
                      whiteSpace: 'nowrap',
                      outline: 'none',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = 'none';
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                  >
                    Watch Free Videos
                  </button>
                </div>
              </div>
            </div>
            )}
            
            {/* Frequently Asked Questions Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '24px',
                width: '847px',
                height: '87px',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: isAuthenticated ? '220px' : '0px',
              }}
              className="portfolio-faq-header"
            >
              {/* Heading */}
              <h2
                style={{
                  width: '847px',
                  height: '47px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '36px',
                  lineHeight: '130%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
                className="portfolio-faq-title"
              >
                Frequently Asked Questions
              </h2>
              
              {/* Description */}
              <p
                style={{
                  width: '847px',
                  height: '16px',
                  fontFamily: 'Gilroy-Medium',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
                className="portfolio-faq-desc"
              >
                Everything you need to know about your subscription.
              </p>
            </div>
            
            {/* FAQ Tiles Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '1064px',
                marginTop: isAuthenticated ? '24px' : '48px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              className="portfolio-faq-container"
            >
              {/* FAQ Tile 1 */}
              <div
                className="relative overflow-hidden portfolio-faq-item"
                style={{
                  width: '1064px',
                  height: expandedTiles[0] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(0)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Can I cancel anytime?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[0] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[0] && (
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Yes - your access continues until your period ends.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 2 */}
              <div
                className="relative overflow-hidden portfolio-faq-item"
                style={{
                  width: '1064px',
                  height: expandedTiles[1] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(1)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Do you offer refunds?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[1] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[1] && (
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      We offer a 7-day money-back guarantee for all new subscribers.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 3 */}
              <div
                className="relative overflow-hidden portfolio-faq-item"
                style={{
                  width: '1064px',
                  height: expandedTiles[2] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(2)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    What's Included?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[2] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[2] && (
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Full research library, position sizing calculator, portfolio analytics, and Shariah project details & screens.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 4 */}
              <div
                className="relative overflow-hidden portfolio-faq-item"
                style={{
                  width: '1064px',
                  height: expandedTiles[3] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(3)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Will you add more features?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[3] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[3] && (
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Yes! We continuously improve our platform and add new features based on user feedback.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Newsletter Subscription */}
            {isAuthenticated && (
            <div className="w-full" style={{ marginTop: '220px' }}>
              <NewsletterSubscription />
            </div>
            )}
          </div>
        </div>
      </div>

    {isAddHoldingModalOpen && (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-holding-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 10, 10, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '24px',
      }}
      onClick={closeAddHoldingModal}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#1F1F1F',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0px 24px 80px rgba(0, 0, 0, 0.6)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
        onClick={event => event.stopPropagation()}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2
            id="add-holding-modal-title"
            style={{
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '24px',
              lineHeight: '130%',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Connect Binance API
          </h2>
          <p
            style={{
              fontFamily: 'Gilroy-Medium',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '130%',
              color: '#9D9D9D',
              margin: 0,
            }}
          >
            Your credentials are encrypted with AES-256 and stored in MongoDB. Use read-only keys restricted to balance endpoints whenever possible.
          </p>
        </div>
        {credentialError ? (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 0, 0, 0.12)',
              border: '1px solid rgba(255, 0, 0, 0.4)',
              color: '#FFB3B3',
              fontFamily: 'Gilroy-Medium',
              fontSize: '14px',
            }}
          >
            {credentialError}
          </div>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="portfolio-api-key-input"
            style={{
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '130%',
              color: '#FFFFFF',
            }}
          >
            API Key
          </label>
          <input
            id="portfolio-api-key-input"
            type="text"
            value={apiKeyValue}
            onChange={handleApiKeyChange}
            placeholder="Enter your API key"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: '#0A0A0A',
              color: '#FFFFFF',
              fontFamily: 'Gilroy-Medium',
              fontSize: '14px',
              lineHeight: '130%',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="portfolio-api-secret-input"
            style={{
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '130%',
              color: '#FFFFFF',
            }}
          >
            API Secret
          </label>
          <input
            id="portfolio-api-secret-input"
            type="password"
            value={apiSecretValue}
            onChange={handleApiSecretChange}
            placeholder="Enter your API secret"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: '#0A0A0A',
              color: '#FFFFFF',
              fontFamily: 'Gilroy-Medium',
              fontSize: '14px',
              lineHeight: '130%',
              outline: 'none',
            }}
            autoComplete="off"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="portfolio-passphrase-input"
            style={{
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '130%',
              color: '#FFFFFF',
            }}
          >
            Passphrase (optional)
          </label>
          <input
            id="portfolio-passphrase-input"
            type="password"
            value={passphraseValue}
            onChange={handlePassphraseChange}
            placeholder="Enter if your key requires a passphrase"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: '#0A0A0A',
              color: '#FFFFFF',
              fontFamily: 'Gilroy-Medium',
              fontSize: '14px',
              lineHeight: '130%',
              outline: 'none',
            }}
            autoComplete="off"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="portfolio-label-input"
            style={{
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '130%',
              color: '#FFFFFF',
            }}
          >
            Label (optional)
          </label>
          <input
            id="portfolio-label-input"
            type="text"
            value={labelValue}
            onChange={handleLabelChange}
            placeholder="e.g. Personal account"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: '#0A0A0A',
              color: '#FFFFFF',
              fontFamily: 'Gilroy-Medium',
              fontSize: '14px',
              lineHeight: '130%',
              outline: 'none',
            }}
            autoComplete="off"
          />
        </div>
        <label
          htmlFor="portfolio-use-testnet-toggle"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '4px',
            fontFamily: 'Gilroy-Medium',
            fontSize: '14px',
            color: '#FFFFFF',
          }}
        >
          <input
            id="portfolio-use-testnet-toggle"
            type="checkbox"
            checked={useTestnetValue}
            onChange={handleUseTestnetToggle}
            style={{ width: '16px', height: '16px' }}
          />
          Use Binance testnet
        </label>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            type="button"
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#FFFFFF',
              borderRadius: '100px',
              border: '1px solid rgba(255, 255, 255, 0.24)',
              fontFamily: 'Gilroy-SemiBold',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={closeAddHoldingModal}
            disabled={isSavingCredentials}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              padding: '12px 24px',
              background: '#FFFFFF',
              color: '#0A0A0A',
              borderRadius: '100px',
              border: 'none',
              fontFamily: 'Gilroy-SemiBold',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={handleConfirmAddHolding}
            disabled={isSavingCredentials}
          >
            {isSavingCredentials ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
    )}

      <Footer />
    </div>
  );
}

