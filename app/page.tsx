'use client';

import { useEffect, useState } from 'react';
import portfolio from '@/data/portfolio.json';
import { Stock } from '@/types/portfolio';
import {
  enrichStock,
  groupBySector,
  addPortfolioPercent,
} from '@/lib/utils';
import PortfolioTable from '@/components/PortfolioTable';
import SectorChart from '@/components/SectorChart';

export default function Page() {
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/quotes');
      if (!res.ok) throw new Error();

      const quotes = await res.json();
      setError(null);

      const updated = (portfolio as Stock[]).map((stock) => {
        const q = quotes.find((x: any) => x.id === stock.id);
        return {
          ...enrichStock(stock, q?.cmp ?? stock.fallbackCmp),
          peRatio: q?.peRatio ?? null,
          eps: q?.eps ?? null,
        };
      });

      const withPercent = addPortfolioPercent(updated);

      setGroups(groupBySector(withPercent));
      setLastUpdated(new Date());
    } catch {
      setError('Live data unavailable. Showing fallback values.');

      const fallback = (portfolio as Stock[]).map((s) =>
        enrichStock(s, s.fallbackCmp)
      );

      const withPercent = addPortfolioPercent(fallback);

      setGroups(groupBySector(withPercent));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <SectorChart groups={groups} />

      <PortfolioTable
        groups={groups}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
      />
    </main>
  );
}