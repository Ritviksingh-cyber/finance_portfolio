import { NextResponse } from 'next/server';
import portfolioData from '@/data/portfolio.json';

const API_KEY = process.env.TWELVE_DATA_API_KEY ?? '';

let cache: any = null;
let lastTime = 0;

interface StockData {
  id: number;
  nseBse: string;
  exchange: 'NSE' | 'BSE';
  fallbackCmp: number;
}

function getTwelveTicker(stock: StockData): string {
  if (stock.exchange === 'NSE') return `NSE:${stock.nseBse}`;
  return `BSE:${stock.nseBse}`;
}

async function fetchBatch(stocks: StockData[]): Promise<any[]> {
  const symbols = stocks.map(getTwelveTicker).join(',');
  const url = `https://api.twelvedata.com/price?symbol=${encodeURIComponent(symbols)}&apikey=${API_KEY}`;

  const res = await fetch(url, { cache: 'no-store' });
  const json = await res.json();

  return stocks.map((stock) => {
    const ticker = getTwelveTicker(stock);
    // If only one symbol, Twelve Data returns { price: "..." } directly
    // If multiple symbols, it returns { "NSE:HDFCBANK": { price: "..." }, ... }
    const entry = stocks.length === 1 ? json : json[ticker];

    const cmp =
      entry && entry.price && !entry.code && !entry.status
        ? parseFloat(entry.price)
        : stock.fallbackCmp;

    return {
      id: stock.id,
      cmp: isNaN(cmp) ? stock.fallbackCmp : cmp,
      peRatio: null,
      eps: null,
    };
  });
}

export async function GET() {
  const now = Date.now();

  if (cache && now - lastTime < 15000) {
    return NextResponse.json(cache);
  }

  if (!API_KEY) {
    console.error('TWELVE_DATA_API_KEY is not set in .env.local');
    const fallback = (portfolioData as StockData[]).map((s) => ({
      id: s.id,
      cmp: s.fallbackCmp,
      peRatio: null,
      eps: null,
    }));
    return NextResponse.json(fallback);
  }

  const stocks = portfolioData as StockData[];
  const batchSize = 8;
  const allResults: any[] = [];

  try {
    for (let i = 0; i < stocks.length; i += batchSize) {
      const batch = stocks.slice(i, i + batchSize);
      const results = await fetchBatch(batch);
      allResults.push(...results);

      // Wait 500ms between batches to avoid rate limiting
      if (i + batchSize < stocks.length) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    cache = allResults;
    lastTime = now;

    console.log('Live data fetched successfully for', allResults.length, 'stocks');
    return NextResponse.json(allResults);

  } catch (err: any) {
    console.error('Twelve Data fetch failed:', err.message);

    const fallback = stocks.map((s) => ({
      id: s.id,
      cmp: s.fallbackCmp,
      peRatio: null,
      eps: null,
      error: 'fetch_failed',
    }));

    return NextResponse.json(fallback);
  }
}