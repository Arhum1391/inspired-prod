type HoldingRow = {
  asset: string;
  free: number;
  locked: number;
  total: number;
  unitPrice?: number | null;
  unitPriceSymbol?: string | null;
  value?: number | null;
};

type HoldingsTableProps = {
  holdings: HoldingRow[];
  totalValue: number;
  isLoading?: boolean;
  error?: string | null;
  missingPriceAssets?: string[];
};

const formatCurrency = (value: number | null | undefined): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 100000 ? 0 : 2,
  }).format(value);
};

const formatNumber = (value: number | null | undefined): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
};

const formatPercent = (value: number | null | undefined): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }
  return `${value.toFixed(2)}%`;
};

export default function HoldingsTable({
  holdings,
  totalValue,
  isLoading = false,
  error,
  missingPriceAssets,
}: HoldingsTableProps) {
  if (error) {
    return (
      <div className="w-full rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-[#1F1F1F] p-6 text-white">
        <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded bg-white/5" />
        <div className="h-4 w-full animate-pulse rounded bg-white/5" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
      </div>
    );
  }

  if (!holdings.length) {
    return (
      <div className="w-full rounded-2xl border border-white/10 bg-[#1F1F1F] p-6 text-sm text-white/70">
        No holdings to display yet. Connect your Binance account to see live balances.
      </div>
    );
  }

  const safeTotalValue = totalValue > 0 ? totalValue : 0;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1F1F1F]">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-left text-sm text-white">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-6 py-4 font-semibold">Asset</th>
              <th className="px-6 py-4 font-semibold text-right">Free</th>
              <th className="px-6 py-4 font-semibold text-right">Locked</th>
              <th className="px-6 py-4 font-semibold text-right">Total</th>
              <th className="px-6 py-4 font-semibold text-right">Price</th>
              <th className="px-6 py-4 font-semibold text-right">Value</th>
              <th className="px-6 py-4 font-semibold text-right">Allocation</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(row => {
              const allocation =
                safeTotalValue > 0 && typeof row.value === 'number'
                  ? (row.value / safeTotalValue) * 100
                  : null;
              return (
                <tr key={row.asset} className="border-t border-white/5">
                  <td className="px-6 py-4 font-semibold tracking-wide">{row.asset}</td>
                  <td className="px-6 py-4 text-right text-white/80">{formatNumber(row.free)}</td>
                  <td className="px-6 py-4 text-right text-white/80">{formatNumber(row.locked)}</td>
                  <td className="px-6 py-4 text-right text-white">{formatNumber(row.total)}</td>
                  <td className="px-6 py-4 text-right text-white/80">
                    {row.unitPriceSymbol ? `${row.unitPriceSymbol}: ` : ''}
                    {formatCurrency(row.unitPrice ?? null)}
                  </td>
                  <td className="px-6 py-4 text-right text-white">{formatCurrency(row.value)}</td>
                  <td className="px-6 py-4 text-right text-white/80">{formatPercent(allocation)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {missingPriceAssets && missingPriceAssets.length > 0 ? (
        <div className="border-t border-white/5 px-6 py-4 text-xs text-white/60">
          No live USD price for: {missingPriceAssets.join(', ')}. Values shown as quantities only.
        </div>
      ) : null}
    </div>
  );
}

export type { HoldingRow };
