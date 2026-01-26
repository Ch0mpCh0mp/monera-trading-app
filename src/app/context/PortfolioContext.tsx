// src/context/PortfolioContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Position = {
  symbol: string;
  amount: number;
  avgPrice: number;      // Durchschnittspreis pro Einheit
  leverage?: number;     // Margin/Hebel
  entryPrice?: number;   // Preis beim Öffnen
  currentPrice?: number; // Live-PnL
  type?: 'buy' | 'sell'; // Buy/Sell
  pnl?: number;          // aktueller Gewinn/Verlust
};

export type PortfolioContextType = {
  balance: number;
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
  const [balance, setBalance] = useState<number>(10000);
  const [positions, setPositions] = useState<Position[]>([]);

  // --- Live-Update für aktuelle Positionen ---
  const updatePositionPrice = (symbol: string, newPrice: number) => {
    setPositions(prev =>
      prev.map(p => {
        if (p.symbol !== symbol) return p;

        let pnl = 0;
        if (p.type === 'buy') pnl = (newPrice - (p.entryPrice ?? p.avgPrice)) * p.amount * (p.leverage ?? 1);
        if (p.type === 'sell') pnl = ((p.entryPrice ?? p.avgPrice) - newPrice) * p.amount * (p.leverage ?? 1);

        return { ...p, currentPrice: newPrice, pnl };
      })
    );
  };

  // --- Buy ---
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
        return prev.map(p => (p.symbol === symbol && p.type === 'buy' ? { ...p, amount: totalAmount, avgPrice, currentPrice: price } : p));
      } else {
        return [...prev, { symbol, amount, avgPrice: price, entryPrice: price, currentPrice: price, type: 'buy' }];
      }
    });
  };

  // ---
