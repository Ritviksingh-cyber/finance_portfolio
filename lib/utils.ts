import { Stock, SectorGroup } from '@/types/portfolio';

export function getYahooTicker(stock: Stock): string {
  if (stock.exchange === 'NSE') {
    return `${stock.nseBse}.NS`;
  }
  return `${stock.nseBse}.BO`;
}

export function enrichStock(stock: Stock, cmp: number): Stock {
  const presentValue = cmp * stock.qty;
  const investment = stock.purchasePrice * stock.qty;
  return {
    ...stock,
    cmp,
    presentValue,
    gainLoss: presentValue - investment,
    gainLossPercent: ((presentValue - investment) / investment) * 100,
  };
}

export function addPortfolioPercent(stocks: Stock[]): Stock[] {
  const total = stocks.reduce(
    (sum, s) => sum + s.purchasePrice * s.qty,
    0
  );
  return stocks.map((s) => ({
    ...s,
    portfolioPercent: total > 0
      ? ((s.purchasePrice * s.qty) / total) * 100
      : 0,
  }));
}

export function groupBySector(stocks: Stock[]): SectorGroup[] {
  const map = new Map<string, Stock[]>();

  for (const stock of stocks) {
    if (!map.has(stock.sector)) map.set(stock.sector, []);
    map.get(stock.sector)!.push(stock);
  }

  return Array.from(map.entries()).map(([sector, sectorStocks]) => {
    const totalInvestment = sectorStocks.reduce(
      (sum, s) => sum + s.purchasePrice * s.qty,
      0
    );
    const totalPresentValue = sectorStocks.reduce(
      (sum, s) => sum + (s.presentValue ?? s.fallbackCmp * s.qty),
      0
    );
    return {
      sector,
      stocks: sectorStocks,
      totalInvestment,
      totalPresentValue,
      totalGainLoss: totalPresentValue - totalInvestment,
    };
  });
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}