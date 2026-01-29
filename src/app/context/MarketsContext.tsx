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
  loading: boolean;
}

const defaultState: MarketsContextType = {
  crypto: [],
  stocks: [],
  loading: true,
};

export const MarketsContext = createContext<MarketsContextType>(defaultState);

export function MarketsProvider({ children }: { children: ReactNode }) {
  const [crypto, setCrypto] = useState<Asset[]>([]);
  const [stocks, setStocks] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const res = await fetch('/api/markets/crypto');
        const data = await res.json();

        let list: Asset[] = [];

        // Fallback, wenn API blockiert
        if (!Array.isArray(data)) {
          console.warn('Crypto API blocked — fallback active');
          list = [
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
        } else {
          list = data.map((c: any): Asset => {
            const pct = Number(c.price_change_percentage_24h ?? 0);
            return {
              name: c.name,
              symbol: String(c.symbol).toUpperCase(),
              price: Number(c.current_price ?? 0),
              changePct: pct,
              trend: pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral',
              image: c.image,
            };
          });
        }

        setCrypto(list);
      } catch (err) {
        console.error('Crypto fetch failed', err);
      }
    };

    const fetchStocks = async () => {
      // Beispiel: Gold / XAUUSD
      const goldAsset: Asset = {
        name: 'Gold (XAU/USD)',
        symbol: 'XAUUSD',
        price: 4950.12,
        changePct: 0.35,
        trend: 'up',
        image: '/gold.png',
      };
    setStocks([goldAsset]);

    };

    // 🔹 beide Daten initial laden
    Promise.all([fetchCrypto(), fetchStocks()]).finally(() => setLoading(false));

    // 🔹 Refresh alle 30s
    const interval = setInterval(() => {
      fetchCrypto();
      fetchStocks();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MarketsContext.Provider value={{ crypto, stocks, loading }}>
      {children}
    </MarketsContext.Provider>
  );
}
