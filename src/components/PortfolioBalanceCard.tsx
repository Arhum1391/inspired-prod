'use client';

import { useMemo, useState } from 'react';
import * as Recharts from 'recharts';

const { Area, AreaChart: RechartsAreaChart, ResponsiveContainer, XAxis, YAxis } = Recharts;

type TimeRange = '1Hr' | '1D' | '1W' | '1M' | '1Y';

type ChartDatum = {
  label: string;
  value: number;
};

const chartSeries: Record<TimeRange, ChartDatum[]> = {
  '1Hr': [
    { label: '10:05', value: 1400 },
    { label: '10:15', value: 1820 },
    { label: '10:25', value: 1680 },
    { label: '10:35', value: 2100 },
    { label: '10:45', value: 2350 },
    { label: '10:55', value: 2480 },
    { label: '11:05', value: 2320 },
  ],
  '1D': [
    { label: '6 AM', value: 1200 },
    { label: '9 AM', value: 1560 },
    { label: '12 PM', value: 1710 },
    { label: '3 PM', value: 1890 },
    { label: '6 PM', value: 2200 },
    { label: '9 PM', value: 2460 },
    { label: '12 AM', value: 2380 },
  ],
  '1W': [
    { label: 'Mon', value: 1180 },
    { label: 'Tue', value: 1420 },
    { label: 'Wed', value: 1670 },
    { label: 'Thu', value: 1980 },
    { label: 'Fri', value: 2260 },
    { label: 'Sat', value: 2390 },
    { label: 'Sun', value: 2230 },
  ],
  '1M': [
    { label: '16/6', value: 980 },
    { label: '22/6', value: 1360 },
    { label: '28/6', value: 1680 },
    { label: '4/7', value: 2140 },
    { label: '10/7', value: 2420 },
    { label: '16/7', value: 2760 },
    { label: '22/7', value: 2610 },
  ],
  '1Y': [
    { label: 'Jan', value: 760 },
    { label: 'Mar', value: 1040 },
    { label: 'May', value: 1380 },
    { label: 'Jul', value: 1760 },
    { label: 'Sep', value: 2120 },
    { label: 'Nov', value: 2470 },
    { label: 'Dec', value: 2680 },
  ],
};

export default function PortfolioBalanceCard() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');

  const data = useMemo(() => chartSeries[selectedRange], [selectedRange]);
  const dataWithPosition = useMemo(
    () => data.map((point, index) => ({ ...point, position: index })),
    [data]
  );

  const xPositionPercentages = useMemo(() => {
    if (data.length === 0) {
      return { monthLines: [] as number[], midLines: [] as number[], labelPositions: [] as number[] };
    }

    if (data.length === 1) {
      return { monthLines: [50], midLines: [], labelPositions: [50] };
    }

    const step = 100 / data.length;
    const monthLines = Array.from({ length: data.length }, (_, index) =>
      Number(((index + 0.5) * step).toFixed(3))
    );

    const midLines = Array.from({ length: data.length - 1 }, (_, index) =>
      Number(((monthLines[index] + monthLines[index + 1]) / 2).toFixed(3))
    );

    return {
      monthLines,
      midLines,
      labelPositions: monthLines,
    };
  }, [data]);

  const xDomain = useMemo<[number, number]>(() => {
    if (data.length === 0) return [0, 1];
    if (data.length === 1) return [-0.5, 0.5];
    const maxIndex = data.length - 1;
    return [-0.5, maxIndex + 0.5];
  }, [data.length]);

  const getTranslate = (position: number) => {
    if (position <= 0) return '0%';
    if (position >= 100) return '-100%';
    return '-50%';
  };

  return (
    <div className="flex h-full min-h-[344px] w-full flex-col justify-between overflow-hidden rounded-2xl bg-[#1F1F1F] p-5 text-white shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-[20px] font-semibold leading-[1.3]">Portfolio Value</span>
              <div className="flex items-center gap-3 text-sm font-medium text-white/80">
                <span>BTC: $24,000</span>
                <div className="rounded-full border border-[#05B353] bg-[rgba(5,179,83,0.12)] px-3 py-1 text-xs font-medium text-[#05B353]">
                  +14.29%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#DE50EC] bg-[rgba(222,80,236,0.1)] px-2 py-1">
              {(['1Hr', '1D', '1W', '1M', '1Y'] as TimeRange[]).map(range => {
                const isActive = range === selectedRange;
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setSelectedRange(range)}
                    className={`rounded-full px-3 py-1 text-[14px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1F1F1F] text-[#DE50EC] shadow-[0_0_0_1px_rgba(222,80,236,0.6)]'
                        : 'text-[#DE50EC]'
                    }`}
                  >
                    {range}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="max-w-[380px] text-sm font-medium leading-[1.1] text-white/80">
            Track allocation, P/L, and trends - all in one place.
          </p>
        </div>

        <div className="relative flex h-[200px] w-full items-center">
          <div className="flex h-full w-full gap-4 pl-6 pr-6">
            <div
              className="flex h-full flex-col justify-between text-right text-xs font-medium tracking-[0.02em] text-white"
              style={{ paddingTop: '16px', paddingBottom: '30px' }}
            >
              {['$3000', '$2000', '$1000', '$0'].map(label => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <div className="relative h-full w-full">
              <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[32px] z-0">
                {xPositionPercentages.monthLines.map((position, index) => (
                  <span
                    key={`month-line-${index}`}
                    className="absolute top-0 bottom-0 border-l border-dashed border-[#909090]/50"
                    style={{ left: `${position}%`, transform: `translateX(${getTranslate(position)})` }}
                    aria-hidden
                  />
                ))}

                {xPositionPercentages.midLines.map((position, index) => (
                  <span
                    key={`mid-line-${index}`}
                    className="absolute top-0 bottom-0 border-l border-dashed border-[#909090]/35"
                    style={{ left: `${position}%`, transform: `translateX(${getTranslate(position)})` }}
                    aria-hidden
                  />
                ))}
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart data={dataWithPosition} margin={{ top: 16, right: 0, bottom: 30, left: 0 }}>
                  <XAxis
                    dataKey="position"
                    type="number"
                    domain={xDomain}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={false}
                  />
                  <YAxis
                    domain={[0, 3000]}
                    hide
                    axisLine={false}
                    tickLine={false}
                    tickMargin={16}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#DE50EC"
                    strokeWidth={4}
                    fill="none"
                    dot={false}
                    activeDot={false}
                  />
                </RechartsAreaChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute bottom-6 left-0 right-0 text-xs font-medium tracking-[0.02em] text-white">
                {xPositionPercentages.labelPositions.map((position, index) => (
                  <span
                    key={`label-${position}-${index}`}
                    className="absolute whitespace-nowrap"
                    style={{
                      left: `${position}%`,
                      transform: `translateX(${getTranslate(position)})`,
                    }}
                  >
                    {data[index]?.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

