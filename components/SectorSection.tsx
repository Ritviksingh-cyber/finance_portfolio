'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Stock, SectorGroup } from '@/types/portfolio';
import SectorGroupRow from './SectorGroup';
import SectorTable from './SectorTable';

interface Props {
  group: SectorGroup;
  columns: ColumnDef<Stock>[];
}

export default function SectorSection({ group, columns }: Props) {
  return (
    <>
      <SectorGroupRow group={group} />
      <SectorTable stocks={group.stocks} columns={columns} />
    </>
  );
}