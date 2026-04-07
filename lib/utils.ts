import { Stock, SectorGroup } from '@/types/portfolio';

// map ticker to yahoo format (NSE -> .NS, BSE -> .BO)
export function getYahooTicker(stock: Stock): string {
  if (stock.exchange === 'NSE') {
    return `${stock.nseBse}.NS`;
  }
  return `${stock.nseBse}.BO`;
}

// add live + calculated fields
export function enrichStock(stock: Stock, cmp: number): Stock {
  const investment = stock.purchasePrice * stock.qty;
  const currentValue = cmp * stock.qty;

  // simple gain/loss calc
  const gain = currentValue - investment;

  return {
    ...stock,
    cmp,
    presentValue: currentValue,
    gainLoss: gain,
    gainLossPercent: (gain / investment) * 100,
  };
}

// add portfolio weight
export function addPortfolioPercent(stocks: Stock[]): Stock[] {
  const totalInvestment = stocks.reduce(
    (sum, s) => sum + s.purchasePrice * s.qty,
    0
  );

  return stocks.map((s) => {
    const inv = s.purchasePrice * s.qty;

    return {
      ...s,
      portfolioPercent: (inv / totalInvestment) * 100,
    };
  });
}

// group stocks by sector
export function groupBySector(stocks: Stock[]): SectorGroup[] {
  const map = new Map<string, Stock[]>();

  for (const stock of stocks) {
    if (!map.has(stock.sector)) {
      map.set(stock.sector, []);
    }
    map.get(stock.sector)!.push(stock);
  }

  return Array.from(map.entries()).map(([sector, items]) => {
    const totalInvestment = items.reduce(
      (sum, s) => sum + s.purchasePrice * s.qty,
      0
    );

    // fallback to old cmp if live not present
    const totalValue = items.reduce(
      (sum, s) =>
        sum + (s.presentValue ?? s.fallbackCmp * s.qty),
      0
    );

    return {
      sector,
      stocks: items,
      totalInvestment,
      totalPresentValue: totalValue,
      totalGainLoss: totalValue - totalInvestment,
    };
  });
}

// helper for ₹ formatting
export function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}