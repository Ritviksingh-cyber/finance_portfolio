import { NextResponse } from 'next/server';
import { YahooFinance } from 'yahoo-finance2';
import data from '@/data/portfolio.json';
import { getYahooTicker } from '@/lib/utils';
import { Stock } from '@/types/portfolio';

const yahooFinance = new YahooFinance();
yahooFinance.suppressNotices(['yahooSurvey']);

let cache: any = null;
let lastTime = 0;

export async function GET() {
  const now = Date.now();

  if (cache && now - lastTime < 15000) {
    return NextResponse.json(cache);
  }

  const stocks = data as Stock[];

  const results = await Promise.allSettled(
    stocks.map(async (stock) => {
      const ticker = getYahooTicker(stock);

      try {
        const res = await yahooFinance.quote(ticker);

        return {
          id: stock.id,
          cmp: res.regularMarketPrice ?? stock.fallbackCmp,
          peRatio: res.trailingPE ?? null,
          eps: res.epsTrailingTwelveMonths ?? null,
        };
      } catch (err) {
        console.error(`Failed for ticker ${ticker}:`, err);
        return {
          id: stock.id,
          ticker,
          cmp: stock.fallbackCmp,
          peRatio: null,
          eps: null,
          error: 'fetch_failed',
        };
      }
    })
  );

  const cl