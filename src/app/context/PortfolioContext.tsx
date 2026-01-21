'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type PortfolioContextType = {
  balance: number;
  setBalance: (amount: number) => void;
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(10000); // Startbetrag

  return (
    <PortfolioContext.Provider value={{ balance, setBalance }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
}
