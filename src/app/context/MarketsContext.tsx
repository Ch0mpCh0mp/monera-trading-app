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

export const MarketsContext =
  createContext<MarketsContextType>(defaultState);

export function MarketsProvider({ children }: { children: ReactNode }) {
  const [crypto, setCrypto] = useState<Asset[]>([]);
  const [stocks] = useState<Asset[]>([]); // später
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const res = await fetch('/api/markets/crypto');
        const data = await res.json();

        let list: Asset[] = [];

        // ✅ FALLBACK wenn API blockiert
        if (!Array.isArray(data)) {
          console.warn('Crypto API blocked — fallback active');

          list = [
            {
              name: 'Bitcoin',
              symbol: 'BTC',
              price: 64000,
              changePct: 1.2,
              trend: 'up',
              image:
                'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            },
            {
              name: 'Ethereum',
              symbol: 'ETH',
              price: 3200,
              changePct: -0.6,
              trend: 'down',
              image:
                'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
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
      } finally {
        setLoading(false);
      }
    };

    fetchCrypto();

    const interval = setInterval(fetchCrypto, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MarketsContext.Provider value={{ crypto, stocks, loading }}>
      {children}
    </MarketsContext.Provider>
  );
}
