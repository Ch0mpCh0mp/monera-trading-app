// src/context/PortfolioContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Position = {
  symbol: string;
  amount: number;
  avgPrice: number;  // Durchschnittspreis pro Einheit
  leverage?: number; // neu: Margin/Hebel
  entryPrice?: number;  // neu: Preis beim Öffnen
  currentPrice?: number; // neu: für Live-PnL
  type?: 'buy' | 'sell';  // neu: Buy oder Sell


};

type PortfolioContextType = {
  balance: number;
  positions: Position[];
  setBalance: (value: number) => void;
  buy: (symbol: string, price: number, amount: number, leverage?: number) => void;
  sell: (symbol: string, price: number, amount: number, leverage?: number) => void;
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(10000); // Start-Cash
  const [positions, setPositions] = useState<Position[]>([]);

  const buy = (symbol: string, price: number, amount: number, leverage = 1) => {
  const cost = price * amount;
  if (cost > balance) {
    alert('Nicht genug Cash!');
    return;
  }
  setBalance(prev => prev - cost);

  setPositions(prev => {
    const existing = prev.find(p => p.symbol === symbol && p.type === 'buy');
    if (existing) {
      const totalAmount = existing.amount + amount;
      const avgPrice = (existing.avgPrice * existing.amount + price * amount) / totalAmount;
      return prev.map(p =>
        p.symbol === symbol && p.type === 'buy' ? { ...p, amount: totalAmount, avgPrice } : p
      );
    } else {
      return [...prev, { symbol, amount, avgPrice: price, leverage, entryPrice: price, currentPrice: price, type: 'buy' }];
    }
  });
};


  const sell = (symbol: string, price: number, amount: number, leverage = 1) => {
  setPositions(prev => {
    const existing = prev.find(p => p.symbol === symbol && p.type === 'sell');
    if (!existing || existing.amount < amount) {
      alert('Nicht genug Position!');
      return prev;
    }

    const newAmount = existing.amount - amount;
    if (newAmount === 0) {
      return prev.filter(p => !(p.symbol === symbol && p.type === 'sell'));
    } else {
      return prev.map(p =>
        p.symbol === symbol && p.type === 'sell' ? { ...p, amount: newAmount } : p
      );
    }
  });
    // Cash erhöhen

  setBalance(prev => prev + price * amount);
};


  return (
    <PortfolioContext.Provider value={{ balance, positions, setBalance, buy, sell }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};
