export type Money = {
    value: number;
    currency: 'EUR' | 'USD';
}

export type AccountSummary = {
    accountValue: Money;
    todayChange: Money;
    todayChangePct: number;
    margin: Money;
    levelPct: number;
    cash: Money;
}

export type Trend = 'up' | 'down' | 'neutral';

export type Asset = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend?: Trend;
}

export type PortfolioDiscoverCard = {
    id: 'stocks' | 'indices' | 'commodities' | 'forex';
    title: string;
    cta: string;
}