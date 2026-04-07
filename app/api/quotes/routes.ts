import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import portfolio from '@/data/portfolio.json';
import { getYahooTicker } from '@/lib/utils';
import { Stock } from '@/types/portfolio';

let cache: any = null;
let lastFetch = 0;

export async function GET() {
  const now = Date.now();

  if (cache && now - lastFetch < 15000) {
    return NextResponse.json(cache);
  }

  const stocks = portfolio as Stock[];

  const results = await Promise.allSettled(
    stocks.map(async (stock) => {
      const ticker = getYahooTicker(stock);

      try {
        const quote = await yahooFinance.quote(ticker);

        return {
          id: stock.id,
          cmp: quote.regularMarketPrice ?? stock.fallbackCmp,
          peRatio: quote.trailingPE ?? null,
          eps: quote.epsTrailingTwelveMonths ?? null,
        };
      } catch {
        return {
          id: stock.id,
          cmp: stock.fallbackCmp,
          peRatio: null,
          eps: null,
        };
      }
    })
  );

  const data = results
    .map((r) => (r.status === 'fulfilled' ? r.value : null))
    .filter(Boolean);

  cache = data;
  lastFetch = now;

  return NextResponse.json(data);
}