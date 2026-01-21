'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PortfolioContextType {
  balance: number;
  levelPct: number; // <-- hinzufügen
  currency: 'EUR' | 'USD';
  setBalance: (amount: number) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(10000); // Startbetrag
  const [levelPct] = useState(100);  // Start-Level
  const currency: 'EUR' | 'USD' = 'EUR';          // Standard-Währung

  return (
    <PortfolioContext.Provider value={{ balance, setBalance, levelPct, currency }}>
      {children}
    </PortfolioContext.Provider>
  );
}



export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
}
