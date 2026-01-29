'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MarketsContext } from './MarketsContext';


export type Position = {
  symbol: string;
  amount: number;
  avgPrice: number;
  leverage?: number;
  entryPrice: number;
  currentPrice?: number;
  type: 'buy' | 'sell';
  pnl?: number;
  margin: number; // immer Margin speichern
};

export type PortfolioContextType = {
  balance: number; // frei verfügbare Balance
  positions: Position[];
  setBalance: (value: number) => void;
  buy: (symbol: string, price: number, amount: number, leverage?: number) => void;
  sell: (symbol: string, price: number, amount: number, leverage?: number) => void;
  updatePositionPrice: (symbol: string, newPrice: number) => void;
  openPositions: () => Position[];
  closePosition: (symbol: string) => void;
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const { stocks, crypto} = useContext(MarketsContext) || {stocks: [], crypto: []};
  const [balance, setBalance] = useState<number>(10000);
  const [positions, setPositions] = useState<Position[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('positions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('positions', JSON.stringify(positions));
    }
  }, [positions]);

  // 🔹 aktuelle Marktpreise in den Positionen updaten

// 🔹 Live-PnL alle 1s updaten
useEffect(() => {
  const updatePositions = () => {
    setPositions(prev =>
      prev.map(p => {
        // finde Asset nach Symbol
        const marketAsset =
          [...crypto, ...stocks].find(a => a.symbol === p.symbol);

        if (!marketAsset) return p;

        const pnl =
          p.type === 'buy'
            ? (marketAsset.price - p.entryPrice) * p.amount
            : (p.entryPrice - marketAsset.price) * p.amount;

        return { ...p, currentPrice: marketAsset.price, pnl };
      })
    );
  };

  // direkt beim Mount
  updatePositions();

  // alle 1 Sekunde
  const interval = setInterval(updatePositions, 1000);

  return () => clearInterval(interval);
}, [crypto, stocks]); // trigger nur, wenn neue Market-Daten hereinkommen



  // 🔹 Preis einer Position updaten + PnL berechnen
  const updatePositionPrice = (symbol: string, newPrice: number) => {
    setPositions(prev =>
      prev.map(p => {
        if (p.symbol !== symbol) return p;
        const pnl =
          p.type === 'buy'
            ? (newPrice - p.entryPrice) * p.amount
            : (p.entryPrice - newPrice) * p.amount;
        return { ...p, currentPrice: newPrice, pnl };
      })
    );
  };

 const buy = (symbol: string, price: number, amount: number, leverage = 1) => {
  const marginForTrade = (price * amount) / leverage;

  // Prüfe, ob Position schon existiert
  const existing = positions.find(p => p.symbol === symbol && p.type === 'buy');

  if (existing) {
    const totalAmount = existing.amount + amount;
    const newEntryPrice = (existing.entryPrice * existing.amount + price * amount) / totalAmount;
    const totalMargin = (totalAmount * newEntryPrice) / leverage;
    const marginDiff = totalMargin - existing.margin;

    if (marginDiff > balance) {
      alert('Nicht genug Cash für diese Erhöhung');
      return;
    }

    // ⚡ Nur einmal Balance abziehen
    setBalance(prev => prev - marginDiff);

    setPositions(prev =>
      prev.map(p =>
        p.symbol === symbol && p.type === 'buy'
          ? {
              ...p,
              amount: totalAmount,
              entryPrice: newEntryPrice,
              currentPrice: price,
              margin: totalMargin,
              avgPrice: (existing.avgPrice * existing.amount + price * amount) / totalAmount
            }
          : p
      )
    );
  } else {
    if (marginForTrade > balance) {
      alert('Nicht genug Cash');
      return;
    }

    setBalance(prev => prev - marginForTrade);

    setPositions(prev => [
      ...prev,
      { symbol, amount, avgPrice: price, entryPrice: price, currentPrice: price, type: 'buy', leverage, margin: marginForTrade }
    ]);
  }
};

      

  // 🔹 Sell-Position öffnen oder erhöhen
  
      // 🔹 Sell-Position öffnen oder erhöhen
const sell = (symbol: string, price: number, amount: number, leverage = 1) => {
  const marginForTrade = (price * amount) / leverage;

  // Prüfe, ob Position schon existiert
  const existing = positions.find(p => p.symbol === symbol && p.type === 'sell');

  if (existing) {
    const totalAmount = existing.amount + amount;
    const newEntryPrice = (existing.entryPrice * existing.amount + price * amount) / totalAmount;
    const totalMargin = (totalAmount * newEntryPrice) / leverage;
    const marginDiff = totalMargin - existing.margin;

    if (marginDiff > balance) {
      alert('Nicht genug Cash für diese Erhöhung');
      return;
    }

    setBalance(prev => prev - marginDiff);

    setPositions(prev =>
      prev.map(p =>
        p.symbol === symbol && p.type === 'sell'
          ? {
              ...p,
              amount: totalAmount,
              entryPrice: newEntryPrice,
              currentPrice: price,
              margin: totalMargin,
              avgPrice: (existing.avgPrice * existing.amount + price * amount) / totalAmount
            }
          : p
      )
    );
  } else {
    if (marginForTrade > balance) {
      alert('Nicht genug Cash für Margin');
      return;
    }

    setBalance(prev => prev - marginForTrade);

    setPositions(prev => [
      ...prev,
      { symbol, amount, avgPrice: price, entryPrice: price, currentPrice: price, type: 'sell', leverage, margin: marginForTrade }
    ]);
  }
};

      


  // 🔹 Alle offenen Positionen zurückgeben
const openPositions = () => positions.filter(p => p.amount > 0);

// 🔹 Position schließen
const closePosition = (symbol: string) => {
  const pos = positions.find(p => p.symbol === symbol);
  if (!pos) return;

  const pnl =
    pos.type === 'buy'
      ? (pos.currentPrice! - pos.entryPrice) * pos.amount
      : (pos.entryPrice - pos.currentPrice!) * pos.amount;

  setBalance(prev => prev + pos.margin + pnl);

  setPositions(prev => prev.filter(p => p.symbol !== symbol));
};



  return (
    <PortfolioContext.Provider
  value={{ balance, positions, setBalance, buy, sell, updatePositionPrice, openPositions, closePosition }}
>
  {children}
</PortfolioContext.Provider>

  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};
