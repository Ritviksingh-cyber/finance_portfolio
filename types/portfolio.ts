export interface Stock {
  id: number;
  name: string;
  sector: string;
  purchasePrice: number;
  qty: number;
  nseBse: string;           // ticker code e.g. "HDFCBANK" or "532174"
  exchange: 'NSE' | 'BSE';
  fallbackCmp: number;      // from your Excel IFERROR values
  // live data — filled in by API
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

export interface QuoteResult {
  ticker: string;
  cmp: number | null;
  peRatio: number | null;
  eps: number | null;
  error?: string;
}