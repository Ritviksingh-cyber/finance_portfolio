'use client';

import { useEffect, useState, useCallback } from 'react';
import rawData from '@/data/portfolio.json';
import { Stock, SectorGroup } from '@/types/portfolio';
import { enrichStock, groupBySector, addPortfolioPercent } from '@/lib/utils';
import PortfolioTable from '@/components/PortfolioTable';
import SectorChart from '@/components/SectorChart';

export default function Page() {
  const [groups, setGroups] = useState<SectorGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [countdown, setCountdown] = useState(15);  // ← moved here

  const fetchData = useCallback(async () => {
    setLoading(true);
    setCountdown(15); // reset countdown on every fetch

    try {
      const res = await fetch('/api/quotes');
      if (!res.ok) throw new Error('API error');

      const quotes = await res.json();

      const updated = (rawData as Stock[]).map((stock) => {
        const q = quotes.find((x: { id: number }) => x.id === stock.id);
        return {
          ...enrichStock(stock, q?.cmp ?? stock.fallbackCmp),
          peRatio: q?.peRatio ?? null,
          eps: q?.eps ?? null,
        };
      });

      const withPercent = addPortfolioPercent(updated);
      setGroups(groupBySector(withPercent));
      setLastUpdated(new Date());
      setError(null);
      setIsLive(true);
    } catch {
      setError('Live data unavailable. Showing fallback values.');
      setIsLive(false);

      const fallback = (rawData as Stock[]).map((s) =>
        enrichStock(s, s.fallbackCmp)
      );
      setGroups(groupBySector(addPortfolioPercent(fallback)));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount, then every 15s
  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 15000);
    return () => clearInterval(id);
  }, [fetchData]);

  // Countdown timer — ticks every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 15 : c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalInvestment = groups.reduce((sum, g) => sum + g.totalInvestment, 0);
  const totalPresentValue = groups.reduce((sum, g) => sum + g.totalPresentValue, 0);
  const totalGainLoss = totalPresentValue - totalInvestment;
  const totalGainLossPct = totalInvestment > 0
    ? (totalGainLoss / totalInvestment) * 100
    : 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 space-y-6">

      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Portfolio Dashboard</h1>
        <div className="flex items-center gap-3 text-sm text-gray-400">

          {/* Countdown ring */}
          <div className="flex items-center gap-1.5">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle
                cx="10" cy="10" r="8"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
              />
              <circle
                cx="10" cy="10" r="8"
                fill="none"
                stroke={isLive ? '#4ade80' : '#6b7280'}
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 8}`}
                strokeDashoffset={`${2 * Math.PI * 8 * (1 - countdown / 15)}`}
                strokeLinecap="round"
                transform="rotate(-90 10 10)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <span className="text-xs tabular-nums">
              {loading ? 'Refreshing...' : `${countdown}s`}
            </span>
          </div>

          {lastUpdated && (
            <span className="text-xs">
              Updated {lastUpdated.toLocaleTimeString('en-IN')}
            </span>
          )}

          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            isLive
              ? 'bg-green-900 text-green-400'
              : 'bg-gray-800 text-gray-400'
          }`}>
            {isLive ? '● LIVE' : '○ FALLBACK'}
          </span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 py-3 bg-red-950 border border-red-800 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Total Invested</p>
          <p className="text-lg font-semibold">{fmt(totalInvestment)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Current Value</p>
          <p className="text-lg font-semibold">{fmt(totalPresentValue)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Total Gain / Loss</p>
          <p className={`text-lg font-semibold ${
            totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {totalGainLoss >= 0 ? '+' : ''}{fmt(totalGainLoss)}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Overall Return</p>
          <p className={`text-lg font-semibold ${
            totalGainLossPct >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {totalGainLossPct >= 0 ? '+' : ''}{totalGainLossPct.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Pie chart */}
      <SectorChart groups={groups} />

      {/* Table */}
      <PortfolioTable
        groups={groups}
        isLoading={loading}
        lastUpdated={lastUpdated}
      />
    </main>
  );
}