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

export type Asset = {
    id: string;
    symbol: string;
    name: string;
    price: number;
    changePct: number;
    sparkline?: number[];
}

export type PortfolioDiscoverCard = {
    id: 'stocks' | 'indices' | 'comodities' | 'forex';
    title: string;
    cta: string;
}