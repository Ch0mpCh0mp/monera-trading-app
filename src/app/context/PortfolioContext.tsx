'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MarketsContext, Asset } from './MerketContext';

export type Position = {
  symbol: string;
  amount: number;
  avgPrice: number;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  type: 'buy' | 'sell';
  pnl: number;
  margin: number;
};

export type PortfolioContextType = {
  balance: number;
  equity: number;
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
  const marketsCtx = useContext(MarketsContext);
  const { crypto = [], stocks = [], gold = [], loading = true } = marketsCtx || {};

  const [balance, setBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('balance');
      if (saved) return parseFloat(saved);
    }
    return 10000;
  });

  const [positions, setPositions] = useState<Position[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('positions');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });

  const [equity, setEquity] = useState<number>(balance);

  const getCurrentPrice = (symbol: string, fallback: number) => {
    const asset = [...crypto, ...stocks, ...gold].find((a) => a.symbol === symbol);
    return asset?.price ?? fallback;
  };

  const calculatePnL = (pos: Position, currentPrice: number) => {
    return pos.type === 'buy'
      ? (currentPrice - pos.entryPrice) * pos.amount
      : (pos.entryPrice - currentPrice) * pos.amount;
  };

  // 🔹 Live-PnL & Equity Update
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setPositions((prevPositions) => {
        let totalPnL = 0;

        const updated = prevPositions.map((p) => {
          const currentPrice = getCurrentPrice(p.symbol, p.currentPrice);
          const pnl = calculatePnL(p, currentPrice);
          totalPnL += pnl;
          return { ...p, currentPrice, pnl };
        });

        setEquity(balance + totalPnL);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [crypto, stocks, gold, balance, loading]);

  // 🔹 LocalStorage Sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('balance', balance.toString());
    localStorage.setItem('positions', JSON.stringify(positions));
  }, [balance, positions]);

  const updatePositionPrice = (symbol: string, newPrice: number) => {
    setPositions((prev) =>
      prev.map((p) => {
        if (p.symbol !== symbol) return p;
        return { ...p, currentPrice: newPrice, pnl: calculatePnL(p, newPrice) };
      })
    );
  };

  const buy = (symbol: string, price: number, amount: number, leverage = 1) => {
    const marginNeeded = (price * amount) / leverage;
    const existing = positions.find((p) => p.symbol === symbol && p.type === 'buy');

    if (existing) {
      const newTotalAmount = existing.amount + amount;
      const newAvgPrice = (existing.avgPrice * existing.amount + price * amount) / newTotalAmount;
      const newMargin = (newAvgPrice * newTotalAmount) / leverage;
      const marginDiff = newMargin - existing.margin;

      if (marginDiff > balance) {
        alert('Nicht genug Cash!');
        return;
      }

      setBalance((prev) => prev - marginDiff);
      setPositions((prev) =>
        prev.map((p) =>
          p.symbol === symbol && p.type === 'buy'
            ? {
                ...p,
                amount: newTotalAmount,
                avgPrice: newAvgPrice,
                entryPrice: newAvgPrice,
                currentPrice: price,
                margin: newMargin,
                pnl: 0,
              }
            : p
        )
      );
    } else {
      if (marginNeeded > balance) {
        alert('Nicht genug Cash!');
        return;
      }

      setBalance((prev) => prev - marginNeeded);
      setPositions((prev) => [
        ...prev,
        {
          symbol: symbol.toUpperCase(),
          amount,
          avgPrice: price,
          entryPrice: price,
          currentPrice: price,
          type: 'buy',
          leverage,
          margin: marginNeeded,
          pnl: 0,
        },
      ]);
    }
  };

  const sell = (symbol: string, price: number, amount: number, leverage = 1) => {
    const marginNeeded = (price * amount) / leverage;
    const existing = positions.find((p) => p.symbol === symbol && p.type === 'sell');

    if (existing) {
      const newTotalAmount = existing.amount + amount;
      const newAvgPrice = (existing.avgPrice * existing.amount + price * amount) / newTotalAmount;
      const newMargin = (newAvgPrice * newTotalAmount) / leverage;
      const marginDiff = newMargin - existing.margin;

      if (marginDiff > balance) {
        alert('Nicht genug Cash!');
        return;
      }

      setBalance((prev) => prev - marginDiff);
      setPositions((prev) =>
        prev.map((p) =>
          p.symbol === symbol && p.type === 'sell'
            ? {
                ...p,
                amount: newTotalAmount,
                avgPrice: newAvgPrice,
                entryPrice: newAvgPrice,
                currentPrice: price,
                margin: newMargin,
                pnl: 0,
              }
            : p
        )
      );
    } else {
      if (marginNeeded > balance) {
        alert('Nicht genug Cash!');
        return;
      }

      setBalance((prev) => prev - marginNeeded);
      setPositions((prev) => [
        ...prev,
        {
          symbol: symbol.toUpperCase(),
          amount,
          avgPrice: price,
          entryPrice: price,
          currentPrice: price,
          type: 'sell',
          leverage,
          margin: marginNeeded,
          pnl: 0,
        },
      ]);
    }
  };

  const openPositions = () => positions.filter((p) => p.amount > 0);

  const closePosition = (symbol: string) => {
    const pos = positions.find((p) => p.symbol === symbol);
    if (!pos) return;

    const currentPrice = getCurrentPrice(pos.symbol, pos.currentPrice);
    const finalPnL = calculatePnL(pos, currentPrice);

    setBalance((prev) => prev + pos.margin + finalPnL);
    setPositions((prev) => prev.filter((p) => p.symbol !== symbol));
  };

  return (
    <PortfolioContext.Provider
      value={{
        balance,
        equity,
        positions,
        setBalance,
        buy,
        sell,
        updatePositionPrice,
        openPositions,
        closePosition,
      }}
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
