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
    { header: 'Stock', accessorKey: 'name' },
    {
      header: 'Buy Price',
      accessorKey: 'purchasePrice',
      cell: ({ getValue }) =>
        `₹${getValue<number>().toLocaleString('en-IN')}`,
    },
    { header: 'Qty', accessorKey: 'qty' },
    {
      header: 'Investment',
      accessorFn: (row) => row.purchasePrice * row.qty,
      cell: ({ getValue }) => formatINR(getValue<number>()),
    },
    {
      header: 'Portfolio %',
      accessorKey: 'portfolioPercent',
      cell: ({ getValue }) =>
        `${getValue<number>()?.toFixed(2)}%`,
    },
    { header: 'Code', accessorKey: 'nseBse' },
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
          getValue<number>() ??
            row.original.fallbackCmp * row.original.qty
        ),
    },
    {
      header: 'Gain/Loss',
      accessorKey: 'gainLoss',
      cell: ({ getValue }) => {
        const val = getValue<number>() ?? 0;
        return (
          <span className={val >= 0 ? 'text-green-600' : 'text-red-600'}>
            {formatINR(val)}
          </span>
        );
      },
    },
    {
      header: 'P/E',
      accessorKey: 'peRatio',
      cell: ({ getValue }) =>
        getValue<number | null>()?.toFixed(2) ?? '—',
    },
    {
      header: 'EPS',
      accessorKey: 'eps',
      cell: ({ getValue }) => {
        const val = getValue<number | null>();
        return val != null ? `₹${val.toFixed(2)}` : '—';
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Portfolio Dashboard</h1>
        <div className="text-sm text-gray-500">
          {isLoading && 'Refreshing...'}
          {lastUpdated && (
            <span> | {lastUpdated.toLocaleTimeString('en-IN')}</span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3">
                  {col.header as string}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {groups.map((group) => (
              <SectorSection
                key={group.sector}
                group={group}
                columns={columns}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}