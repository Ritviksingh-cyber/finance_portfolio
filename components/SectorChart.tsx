'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { SectorGroup } from '@/types/portfolio';

const COLORS = ['#4ade80', '#60a5fa', '#facc15', '#f87171', '#a78bfa'];

export default function SectorChart({ groups }: { groups: SectorGroup[] }) {
  const data = groups.map((g) => ({
    name: g.sector,
    value: g.totalInvestment,
  }));

  return (
    <div className="w-full h-80 mb-6">
      <h2 className="text-lg font-semibold mb-2">
        Sector Allocation
      </h2>

      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={120} label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}