import type { AccountSummary, Asset } from '@/types/trading';

export const mockAccountSummary: AccountSummary = {
  accountValue: { value: 12543.21, currency: 'EUR' },
  todayChange: { value: 123.45, currency: 'EUR' },
  todayChangePct: 0.99,
  margin: { value: 0, currency: 'EUR' },
  levelPct: 100,
  cash: { value: 0, currency: 'EUR' },
}

export const mockWatchlist: Asset[] = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 4321,
    changePct: 2.5,
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2345,
    changePct: -1.2,
  },
  {
    id: 'xrp',
    symbol: 'XRP',
    name: 'Ripple',
    price: 0.89,
    changePct: -0.5,
  },
];
