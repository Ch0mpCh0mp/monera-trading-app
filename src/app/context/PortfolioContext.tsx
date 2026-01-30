'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MarketsContext, Asset } from './MarketsContext';

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

  // 🔹 KRITISCHER FIX: Starte mit Defaults, DANN lade aus LocalStorage
  const [balance, setBalance] = useState<number>(10000);
  const [equity, setEquity] = useState<number>(10000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [initialized, setInitialized] = useState(false);

  // 🔹 NUR einmal beim Mount aus LocalStorage laden
  useEffect(() => {
    if (initialized || typeof window === 'undefined') return;
    
    const savedBalance = localStorage.getItem('balance');
    const savedPositions = localStorage.getItem('positions');
    
    if (savedBalance) {
      const bal = parseFloat(savedBalance);
      if (!isNaN(bal)) {
        setBalance(bal);
        setEquity(bal);
      }
    }
    
    if (savedPositions) {
      try {
        const pos = JSON.parse(savedPositions);
        if (Array.isArray(pos)) {
          setPositions(pos);
        }
      } catch (e) {
        console.error('Failed to parse positions:', e);
        localStorage.removeItem('positions');
      }
    }
    
    setInitialized(true);
  }, [initialized]);

  // 🔹 Hilfsfunktion: Aktuellen Preis holen
  const getCurrentPrice = (symbol: string, fallback: number): number => {
    const asset = [...crypto, ...stocks, ...gold].find((a) => a.symbol === symbol);
    return asset?.price ?? fallback;
  };

  // 🔹 PnL berechnen
  const calculatePnL = (pos: Position, currentPrice: number): number => {
    if (pos.type === 'buy') {
      return (currentPrice - pos.entryPrice) * pos.amount;
    } else {
      return (pos.entryPrice - currentPrice) * pos.amount;
    }
  };

  // 🔹 Positionen mit Live-Preisen updaten
  useEffect(() => {
    if (loading || !initialized || positions.length === 0) return;

    const updatePrices = () => {
      let totalPnL = 0;

      const updated = positions.map((p) => {
        const currentPrice = getCurrentPrice(p.symbol, p.currentPrice);
        const pnl = calculatePnL(p, currentPrice);
        totalPnL += pnl;

        return { ...p, currentPrice, pnl };
      });

      setPositions(updated);
      
      setEquity(balance + totalPnL);
    };

    updatePrices();

    const handler = () => updatePrices();
    window.addEventListener('markets-updated', handler);
    const interval = setInterval(updatePrices, 1000);

    return () => {
      window.removeEventListener('markets-updated', handler);
      clearInterval(interval);
    };
  }, [crypto, stocks, gold, loading, balance, initialized, positions.length]);

  // 🔹 Balance & Positions speichern
  useEffect(() => {
    if (!initialized || typeof window === 'undefined') return;
    
    localStorage.setItem('balance', balance.toString());
    localStorage.setItem('positions', JSON.stringify(positions));
  }, [balance, positions, initialized]);

  const updatePositionPrice = (symbol: string, newPrice: number) => {
    setPositions((prev) =>
      prev.map((p) => {
        if (p.symbol !== symbol) return p;
        const pnl = calculatePnL(p, newPrice);
        return { ...p, currentPrice: newPrice, pnl };
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
    if (!pos) {
      console.warn("Position nicht gefunden:", symbol);
      return;
    }

    const currentPrice = getCurrentPrice(pos.symbol, pos.currentPrice);
    const finalPnL = calculatePnL(pos, currentPrice);

    console.log("🔹 CLOSING POSITION:", {
      symbol: pos.symbol,
      entryPrice: pos.entryPrice,
      currentPrice,
      amount: pos.amount,
      margin: pos.margin,
      pnl: finalPnL,
      balanceVorher: balance,
      balanceNachher: balance + pos.margin + finalPnL,
    });

    // Balance + Margin + PnL zurückgeben
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