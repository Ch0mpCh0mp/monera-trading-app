// src/context/PortfolioContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Position = {
  symbol: string;
  amount: number;
  avgPrice: number; // Durchschnittspreis pro Einheit
};

type PortfolioContextType = {
  balance: number;
  positions: Position[];
  setBalance: (value: number) => void;
  buy: (symbol: string, price: number, amount: number) => void;
  sell: (symbol: string, price: number, amount: number) => void;
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(10000); // Start-Cash
  const [positions, setPositions] = useState<Position[]>([]);

  const buy = (symbol: string, price: number, amount: number) => {
    const cost = price * amount;
    if (cost > balance) {
      alert('Nicht genug Cash!');
      return;
    }
    setBalance(prev => prev - cost);

    setPositions(prev => {
      const existing = prev.find(p => p.symbol === symbol);
      if (existing) {
        // Durchschnittspreis aktualisieren
        const totalAmount = existing.amount + amount;
        const avgPrice = (existing.avgPrice * existing.amount + price * amount) / totalAmount;
        return prev.map(p =>
          p.symbol === symbol ? { ...p, amount: totalAmount, avgPrice } : p
        );
      } else {
        return [...prev, { symbol, amount, avgPrice: price }];
      }
    });
  };

  const sell = (symbol: string, price: number, amount: number) => {
    setPositions(prev => {
      const existing = prev.find(p => p.symbol === symbol);
      if (!existing || existing.amount < amount) {
        alert('Nicht genug Position!');
        return prev;
      }

      const newAmount = existing.amount - amount;
      if (newAmount === 0) {
        // Position löschen
        return prev.filter(p => p.symbol !== symbol);
      } else {
        return prev.map(p =>
          p.symbol === symbol ? { ...p, amount: newAmount } : p
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
