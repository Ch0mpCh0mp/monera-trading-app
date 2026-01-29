// src/app/context/MarketsContext.tsx
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
  const [crypto, setCrypto] = useState<Asset[]>([]);
  const [stocks, setStocks] = useState<Asset[]>([]);
  const [gold, setGold] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCrypto = async () => {
      try {
        const res = await fetch('/api/markets/crypto');
        const data = await res.json();

        if (!isMounted) return;
        if (!Array.isArray(data) || data.length === 0) return;

        const list: Asset[] = data.map((c: any) => ({
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
        }));

        setCrypto(list);
      } catch (err) {
        console.error('Crypto fetch failed', err);
      }
    };

    const fetchGold = async () => {
      try {
        const res = await fetch('/api/markets/gold');
        const data = await res.json();
        if (!isMounted) return;

        const goldAsset: Asset = {
          name: 'Gold (XAU/USD)',
          symbol: 'XAUUSD',
          price: Number(data.price ?? 0),
          changePct: Number(data.changePct ?? 0),
          trend: data.trend ?? 'neutral',
          image: '/gold.png',
        };

        setGold([goldAsset]);
      } catch (err) {
        console.error('Gold fetch failed', err);
      }
    };

    const fetchStocks = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_FINNHUB_KEY;
        if (!apiKey) return;

        const symbols = ['AAPL', 'TSLA', 'AMZN'];
        const stockPromises = symbols.map(async (symbol) => {
          const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
          );
          const data = await res.json();
          return {
            name: symbol,
            symbol,
            price: Number(data.c),
            changePct: ((data.c - data.pc) / data.pc) * 100,
            trend: data.c - data.pc > 0 ? 'up' : data.c - data.pc < 0 ? 'down' : 'neutral',
          } as Asset;
        });

        const stockList = await Promise.all(stockPromises);
        if (!isMounted) return;

        // **Nur aktualisieren, wenn stockList Daten enthält**
        if (stockList.length > 0) setStocks(stockList);
      } catch (err) {
        console.error('Stocks fetch failed', err);
      }
    };

    const fetchAll = async () => {
      await Promise.all([fetchCrypto(), fetchGold(), fetchStocks()]);
      if (isMounted) setLoading(false);
    };

    fetchAll();
    const interval = setInterval(fetchAll, 10000); // alle 10 Sekunden

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <MarketsContext.Provider value={{ crypto, gold, stocks, loading }}>
      {children}
    </MarketsContext.Provider>
  );
}
