'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Stock, SectorGroup } from '@/types/portfolio';
import { formatINR } from '@/lib/utils';

export default function SectorSection({
  group,
  columns,
}: {
  group: SectorGroup;
  columns: ColumnDef<Stock>[];
}) {
  const table = useReactTable({
    data: group.stocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isGain = group.totalGainLoss >= 0;

  return (
    <>
      {/* Sector summary row */}
      <tr className="bg-gray-800 border-y border-gray-700">
        <td colSpan={3} className="px-4 py-2.5 font-semibold text-white text-xs uppercase tracking-wider">
          {group.sector}
        </td>
        <td className="px-4 py-2.5 text-gray-300 text-sm font-medium">
          {formatINR(group.totalInvestment)}
        </td>
        <td />
        <td />
        <td />
        <td className="px-4 py-2.5 text-gray-300 text-sm font-medium">
          {formatINR(group.totalPresentValue)}
        </td>
        <td className={`px-4 py-2.5 text-sm font-semibold ${isGain ? 'text-green-400' : 'text-red-400'}`}>
          {isGain ? '+' : ''}{formatINR(group.totalGainLoss)}
        </td>
        <td colSpan={3} />
      </tr>

      {/* Stock rows */}
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors"
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}