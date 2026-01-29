
  'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface Asset {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend: 'up' | 'down' | 'neutral';
  image?: string;
}

interface MarketsContextType {
  crypto: Asset[];
  stocks: Asset[];
  gold: Asset[];
  loading: boolean;
}

const defaultState: MarketsContextType = {
  crypto: [],
  stocks: [],
  gold: [],
  loading: true,
};

export const MarketsContext = createContext<MarketsContextType>(defaultState);

export function MarketsProvider({ children }: { children: ReactNode }) {
  const [crypto, setCrypto] = useState<Asset[]>([]); // Scalping Tab (Solana)
const [stocks, setStocks] = useState<Asset[]>([]); // New Tab
const [gold, setGold] = useState<Asset[]>([]);     // Gold Tab
const [loading, setLoading] = useState(true);


  useEffect(() => {
    let isMounted = true;

    // 🔹 Crypto von CoinGecko
    const fetchCrypto = async () => {
      try {
        const res = await fetch(
          '/api/markets/crypto'
        );
        const data = await res.json();

        if (!isMounted) return;

        const list: Asset[] = Array.isArray(data)
          ? data.map((c: any) => ({
              name: c.name,
              symbol: c.symbol.toUpperCase(),
              price: Number(c.current_price),
              changePct: Number(c.price_change_percentage_24h),
              trend:
                c.price_change_percentage_24h > 0
                  ? 'up'
                  : c.price_change_percentage_24h < 0
                  ? 'down'
                  : 'neutral',
              image: c.image,
            }))
          : [
              // 🔹 Default-Fallback
              {
                name: 'Bitcoin',
                symbol: 'BTC',
                price: 64000,
                changePct: 1.2,
                trend: 'up',
                image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
              },
              {
                name: 'Ethereum',
                symbol: 'ETH',
                price: 3200,
                changePct: -0.6,
                trend: 'down',
                image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
              },
            ];

        setCrypto(list);
      } catch (err) {
        console.error('Crypto fetch failed', err);
      }
    };

    // 🔹 Gold von GoldAPI
    const fetchGold = async () => {
      try {
        const res = await fetch('/api/markets/gold'); // Proxy-Route
        const data = await res.json();
        if (!isMounted) return;

        const goldAsset: Asset = {
         name: data.name ?? 'Gold (XAU/USD)',
  symbol: data.symbol ?? 'XAUUSD',
  price: Number(data.price ?? 0),
  changePct: Number(data.chp ?? 0),
  trend: data.trend ?? 'neutral',
  image: data.image ?? '/gold.png',
        };

        setGold([goldAsset]); // Gold Tab
  } catch (err) {
    console.error('Gold fetch failed', err);
  }
};

    // 🔹 Stocks von Finnhub (AAPL, TSLA, AMZN)
    const fetchStocks = async () => {
      try {
        const symbols = ['AAPL', 'TSLA', 'AMZN'];
        const apiKey = process.env.NEXT_PUBLIC_FINNHUB_KEY;
        if (!apiKey) return;

        const stockPromises = symbols.map(async symbol => {
          const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
          );
          const data = await res.json();
          return {
            name: symbol,
            symbol: symbol,
            price: Number(data.c),
            changePct: ((data.c - data.pc) / data.pc) * 100,
            trend: data.c - data.pc > 0 ? 'up' : data.c - data.pc < 0 ? 'down' : 'neutral',
          } as Asset;
        });

        const stockList = await Promise.all(stockPromises);
        if (!isMounted) return;

        setStocks(stockList);
      } catch (err) {
        console.error('Stocks fetch failed', err);
      }
    };

    const fetchAll = async () => {
      await Promise.all([fetchCrypto(), fetchGold(), fetchStocks()]);
    };

    fetchAll().finally(() => setLoading(false));
    const interval = setInterval(fetchAll, 5000); // 🔹 alle 5 Sekunden aktualisieren

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <MarketsContext.Provider value={{ crypto,gold, stocks, loading }}>
      {children}
    </MarketsContext.Provider>
  );
}
