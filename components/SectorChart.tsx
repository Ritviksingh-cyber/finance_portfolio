'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SectorGroup } from '@/types/portfolio';

const COLORS = ['#4ade80', '#60a5fa', '#facc15', '#f87171', '#a78bfa'];

export default function SectorChart({ groups }: { groups: SectorGroup[] }) {
  const data = groups.map((g) => ({
    name: g.sector,
    value: g.totalInvestment,
  }));

  const formatTooltip = (value: number) => [
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value),
    'Investment',
  ];

  if (data.length === 0) return null;

  return (
    <div className="w-full mb-6 bg-gray-900 rounded-xl border border-gray-800 p-4">
      <h2 className="text-lg font-semibold mb-4">Sector Allocation</h2>
      <ResponsiveContainer width="100%" height={380}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={130}
            innerRadius={50}
            paddingAngle={3}
            label={({ name, percent }) =>
              `${name} ${((percent ?? 0) * 100).toFixed(1)}%`
            }
            labelLine={{ stroke: '#888', strokeWidth: 1 }}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={formatTooltip as any}
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#9ca3af', fontSize: 13 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}