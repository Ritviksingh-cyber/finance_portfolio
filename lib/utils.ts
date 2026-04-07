import { Stock, SectorGroup } from '@/types/portfolio';

export function getYahooTicker(stock: Stock): string {
  return stock.exchange === 'NSE'
    ? `${stock.nseBse}.NS`
    : `${stock.nseBse}.BO`;
}

export function enrichStock(stock: Stock, cmp: number): Stock {
  const investment = stock.purchasePrice * stock.qty;
  const presentValue = cmp * stock.qty;
  const gainLoss = presentValue - investment;

  return {
    ...stock,
    cmp,
    presentValue,
    gainLoss,
    gainLossPercent: (gainLoss / investment) * 100,
  };
}

export function addPortfolioPercent(stocks: Stock[]): Stock[] {
  const total = stocks.reduce(
    (sum, s) => sum + s.purchasePrice * s.qty,
    0
  );

  return stocks.map((s) => {
    const investment = s.purchasePrice * s.qty;

    return {
      ...s,
      portfolioPercent: (investment / total) * 100,
    };
  });
}

export function groupBySector(stocks: Stock[]): SectorGroup[] {
  const map = new Map<string, Stock[]>();

  stocks.forEach((s) => {
    if (!map.has(s.sector)) map.set(s.sector, []);
    map.get(s.sector)!.push(s);
  });

  return Array.from(map.entries()).map(([sector, stocks]) => {
    const totalInvestment = stocks.reduce(
      (sum, s) => sum + s.purchasePrice * s.qty,
      0
    );

    const totalPresentValue = stocks.reduce(
      (sum, s) =>
        sum + (s.presentValue ?? s.fallbackCmp * s.qty),
      0
    );

    return {
      sector,
      stocks,
      totalInvestment,
      totalPresentValue,
      totalGainLoss: totalPresentValue - totalInvestment,
    };
  });
}

export function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}