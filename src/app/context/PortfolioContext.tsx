'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Position = {
  symbol: string;
  amount: number;
  avgPrice: number;
  leverage?: number;
  entryPrice: number;
  currentPrice?: number;
  type: 'buy' | 'sell';
  pnl?: number;
};

export type PortfolioContextType = {
  balance: number;
  positions: Position[];
  setBalance: (value: number) => void;
  buy: (symbol: string, price: number, amount: number, leverage?: number) => void;
  sell: (symbol: string, price: number, amount: number, leverage?: number) => void;
  updatePositionPrice: (symbol: string, newPrice: number) => void;
  openPositions: () => Position[];
  closePosition: (symbol: string, type: 'buy' | 'sell') => void;
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
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

  const updatePositionPrice = (symbol: string, newPrice: number) => {
    setPositions(prev =>
      prev.map(p => {
        if (p.symbol !== symbol) return p;
        const pnl =
          p.type === 'buy'
            ? (newPrice - p.entryPrice) * p.amount * (p.leverage ?? 1)
            : (p.entryPrice - newPrice) * p.amount * (p.leverage ?? 1);
        return { ...p, currentPrice: newPrice, pnl };
      })
    );
  };

  const buy = (symbol: string, price: number, amount: number, leverage = 1) => {
    const invested = price * amount;
    if (invested > balance) {
      alert('Nicht genug Cash');
      return;
    }
    setBalance(prev => prev - invested);
    setPositions(prev => {
      const existing = prev.find(p => p.symbol === symbol && p.type === 'buy');
      if (existing) {
        const totalAmount = existing.amount + amount;
        const avgPrice = (existing.avgPrice * existing.amount + price * amount) / totalAmount;
        return prev.map(p =>
          p.symbol === symbol && p.type === 'buy'
            ? { ...p, amount: totalAmount, avgPrice, currentPrice: price }
            : p
        );
      } else {
        return [...prev, { symbol, amount, avgPrice: price, entryPrice: price, currentPrice: price, type: 'buy' }];
      }
    });
  };

  const sell = (symbol: string, price: number, amount: number, leverage = 1) => {
    const margin = (price * amount) / leverage;
    if (margin > balance) {
      alert('Nicht genug Cash für Margin');
      return;
    }
    setBalance(prev => prev - margin);
    setPositions(prev => {
      const existing = prev.find(p => p.symbol === symbol && p.type === 'sell');
      if (existing) {
        const totalAmount = existing.amount + amount;
        const avgPrice = (existing.avgPrice * existing.amount + price * amount) / totalAmount;
        return prev.map(p =>
          p.symbol === symbol && p.type === 'sell'
            ? { ...p, amount: totalAmount, avgPrice, currentPrice: price }
            : p
        );
      } else {
        return [...prev, { symbol, amount, avgPrice: price, entryPrice: price, currentPrice: price, type: 'sell', leverage }];
      }
    });
  };

  const openPositions = () => positions.filter(p => p.amount > 0);

  const closePosition = (symbol: string, type: 'buy' | 'sell') => {
    setPositions(prev => {
      const pos = prev.find(p => p.symbol === symbol && p.type === type);
      if (!pos) return prev;

      const pnl =
        pos.type === 'buy'
          ? ((pos.currentPrice ?? pos.avgPrice) - pos.entryPrice) * pos.amount * (pos.leverage ?? 1)
          : (pos.entryPrice - (pos.currentPrice ?? pos.avgPrice)) * pos.amount * (pos.leverage ?? 1);

      const margin = (pos.avgPrice * pos.amount) / (pos.leverage ?? 1);

      setBalance(prev => prev + pnl + margin);

      return prev.filter(p => !(p.symbol === symbol && p.type === type));
    });
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
