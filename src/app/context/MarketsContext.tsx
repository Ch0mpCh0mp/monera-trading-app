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

export const MarketsContext = createContext<MarketsContextType>({
  crypto: [],
  stocks: [],
  gold: [],
  loading: true,
});

export function MarketsProvider({ children }: { children: ReactNode }) {
  const [crypto, setCrypto] = useState<Asset[]>([]);
  const [stocks, setStocks] = useState<Asset[]>([]);
  const [gold, setGold] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCrypto = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano'
        );
        if (!res.ok) throw new Error('CoinGecko fetch failed');
        const data = await res.json();
        if (!isMounted) return;

        setCrypto(
          data.map((c: any) => ({
            name: c.name,
            symbol: c.symbol.toUpperCase(),
            price: c.current_price,
            changePct: c.price_change_percentage_24h,
            trend:
              c.price_change_percentage_24h > 0
                ? 'up'
                : c.price_change_percentage_24h < 0
                ? 'down'
                : 'neutral',
            image: c.image,
          }))
        );
      } catch (err) {
        console.error('Crypto fetch failed, fallback to dummy', err);
        if (!isMounted) return;
        // Fallback: Dummy
        setCrypto([
          { name: 'Bitcoin', symbol: 'BTC', price: 25000, changePct: 2, trend: 'up', image: '/btc.png' },
          { name: 'Ethereum', symbol: 'ETH', price: 1800, changePct: -1, trend: 'down', image: '/eth.png' },
          { name: 'Solana', symbol: 'SOL', price: 100, changePct: 0, trend: 'neutral', image: '/sol.png' },
          { name: 'Cardano', symbol: 'ADA', price: 0.3, changePct: 0.5, trend: 'up', image: '/ada.png' },
        ]);
      }
    };

    // 🔹 Du kannst fetchStocks und fetchGold ähnlich einbauen

    fetchCrypto().finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <MarketsContext.Provider value={{ crypto, stocks, gold, loading }}>
      {children}
    </MarketsContext.Provider>
  );
}
