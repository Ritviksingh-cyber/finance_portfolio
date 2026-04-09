export interface Stock {
  id: number;
  name: string;
  sector: string;
  purchasePrice: number;
  qty: number;
  nseBse: string;
  exchange: 'NSE' | 'BSE';
  fallbackCmp: number;
  portfolioPercent?: number;
  cmp?: number;
  presentValue?: number;
  gainLoss?: number;
  gainLossPercent?: number;
  peRatio?: number;
  eps?: number;
}

export interface SectorGroup {
  sector: string;
  stocks: Stock[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
}