'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

import { Stock } from '@/types/portfolio';

interface Props {
  stocks: Stock[];
  columns: ColumnDef<Stock>[];
}

export default function SectorTable({ stocks, columns }: Props) {
  const table = useReactTable({
    data: stocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}