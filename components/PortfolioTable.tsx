'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Stock, SectorGroup } from '@/types/portfolio';
import { formatINR } from '@/lib/utils';
import SectorSection from './SectorSection';

export default function PortfolioTable({
  groups,
  isLoading,
  lastUpdated,
}: {
  groups: SectorGroup[];
  isLoading: boolean;
  lastUpdated: Date | null;
}) {
  const columns: ColumnDef<Stock>[] = [
    {
      header: 'Stock',
      accessorKey: 'name',
      cell: ({ getValue }) => (
        <span className="font-medium text-white">{getValue<string>()}</span>
      ),
    },
    {
      header: 'Buy Price',
      accessorKey: 'purchasePrice',
      cell: ({ getValue }) =>
        `₹${getValue<number>().toLocaleString('en-IN')}`,
    },
    {
      header: 'Qty',
      accessorKey: 'qty',
    },
    {
      header: 'Investment',
      accessorFn: (row) => row.purchasePrice * row.qty,
      cell: ({ getValue }) => formatINR(getValue<number>()),
    },
    {
      header: 'Portfolio %',
      accessorKey: 'portfolioPercent',
      cell: ({ getValue }) =>
        `${(getValue<number>() ?? 0).toFixed(2)}%`,
    },
    {
      header: 'NSE/BSE',
      accessorKey: 'nseBse',
      cell: ({ getValue, row }) => (
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
          {row.original.exchange}:{getValue<string>()}
        </span>
      ),
    },
    {
      header: 'CMP',
      accessorKey: 'cmp',
      cell: ({ getValue, row }) =>
        formatINR(getValue<number>() ?? row.original.fallbackCmp),
    },
    {
      header: 'Present Value',
      accessorKey: 'presentValue',
      cell: ({ getValue, row }) =>
        formatINR(
          getValue<number>() ?? row.original.fallbackCmp * row.original.qty
        ),
    },
    {
      header: 'Gain / Loss',
      accessorKey: 'gainLoss',
      cell: ({ getValue }) => {
        const val = getValue<number>() ?? 0;
        const isGain = val >= 0;
        return (
          <span className={isGain ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
            {isGain ? '+' : ''}{formatINR(val)}
          </span>
        );
      },
    },
    {
      header: 'G/L %',
      accessorKey: 'gainLossPercent',
      cell: ({ getValue }) => {
        const val = getValue<number>() ?? 0;
        const isGain = val >= 0;
        return (
          <span className={isGain ? 'text-green-400' : 'text-red-400'}>
            {isGain ? '+' : ''}{val.toFixed(2)}%
          </span>
        );
      },
    },
    {
      header: 'P/E',
      accessorKey: 'peRatio',
      cell: ({ getValue }) => {
        const val = getValue<number | null>();
        return val != null ? (
          <span>{val.toFixed(2)}</span>
        ) : (
          <span className="text-gray-600">—</span>
        );
      },
    },
    {
      header: 'EPS',
      accessorKey: 'eps',
      cell: ({ getValue }) => {
        const val = getValue<number | null>();
        return val != null ? (
          <span>₹{val.toFixed(2)}</span>
        ) : (
          <span className="text-gray-600">—</span>
        );
      },
    },
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">

      {/* Table header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h2 className="text-base font-semibold">Holdings</h2>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {isLoading && (
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Refreshing...
            </span>
          )}
          {lastUpdated && (
            <span>
              {lastUpdated.toLocaleTimeString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 whitespace-nowrap font-medium">
                  {col.header as string}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {groups.map((g) => (
              <SectorSection key={g.sector} group={g} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}