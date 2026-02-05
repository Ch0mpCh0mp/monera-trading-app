'use client';

import React, { useState, useContext, useMemo } from 'react';

import AppShell from '@/app/components/layout/AppShell';
import SymbolHeader from './SymbolHeader';
import BuySellCard from './BuySellCard';
import { Gem } from 'lucide-react';
import PerformanceRow from './PerformanceRow';
import ChartCard, { type ChartPoint } from './ChartCard';
import TradeModal from './TradeModal';

import { usePortfolio } from '@/app/context/PortfolioContext';
import { MarketsContext } from '@/app/context/MarketsContext';
import { useParams } from 'next/navigation';

export default function SymbolPage() {
  /* =====================
     PARAMS
  ===================== */
  const params = useParams();
  const rawSymbol = params?.symbol;
  const symbol = Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol;

  const safeSymbol = symbol?.toUpperCase() ?? '';

  /* =====================
     CONTEXTS
  ===================== */
  const { buy, sell, positions, closePosition } = usePortfolio();
  const { crypto, stocks, gold } = useContext(MarketsContext);

  /* =====================
     STATE
  ===================== */
  const [tradeType, setTradeType] = useState<'buy' | 'sell' | null>(null);

  /* =====================
     DATA
  ===================== */
  const allAssets = useMemo(
    () => [...crypto, ...stocks, ...gold],
    [crypto, stocks, gold]
  );

  const asset = useMemo(
    () => allAssets.find(a => a.symbol === safeSymbol),
    [allAssets, safeSymbol]
  );

  const currentPrice = asset?.price ?? 0;

  const assetPosition = useMemo(
    () => positions.find(p => p.symbol === safeSymbol),
    [positions, safeSymbol]
  );

  const positionPreview = assetPosition
    ? {
        amount: assetPosition.amount,
        entryPrice: assetPosition.entryPrice,
        pnl: assetPosition.pnl,
        currentPrice: assetPosition.currentPrice,
      }
    : undefined;

  /* =====================
     CHART DEMO
  ===================== */
  const demoPoints: ChartPoint[] = [
    { t: '1', p: currentPrice - 20 },
    { t: '2', p: currentPrice - 10 },
    { t: '3', p: currentPrice - 5 },
    { t: '4', p: currentPrice - 2 },
    { t: '5', p: currentPrice },
  ];

  /* =====================
     SAFETY CHECK
  ===================== */
  if (!safeSymbol) {
    return <p className="text-white p-6">Kein Symbol angegeben</p>;
  }

  /* =====================
     RENDER
  ===================== */
  return (
    <AppShell>

      {/* TRADE MODAL */}
      {tradeType && (
        <TradeModal
          type={tradeType}
          price={currentPrice}
          onClose={() => setTradeType(null)}
          onConfirm={(amount, leverage) => {
            if (tradeType === 'buy') {
              buy(safeSymbol, currentPrice, amount, leverage);
            } else {
              sell(safeSymbol, currentPrice, amount, leverage);
            }

            setTradeType(null);
          }}
        />
      )}

      <SymbolHeader />

      {/* TITLE */}
      <h1 className="text-white text-2xl font-semibold text-center mt-2">
        {safeSymbol}
      </h1>

      {/* BUY / SELL CARD */}
      <BuySellCard
        buyPrice={currentPrice}
        sellPrice={currentPrice}
        assetIcon={<Gem className="w-6 h-6 text-yellow-400" />}
        onBuy={() => setTradeType('buy')}
        onSell={() => setTradeType('sell')}
        position={positionPreview}
        onClosePosition={() => {
          if (assetPosition && confirm(`Position ${safeSymbol} schließen?`)) {
            closePosition(assetPosition.symbol);
          }
        }}
      />

      {/* PERFORMANCE */}
      <PerformanceRow
        value={positionPreview?.pnl ?? 0}
        percent={0}
      />

      {/* CHART */}
      <ChartCard
        points={demoPoints}
        currentPrice={currentPrice}
        currencySuffix="€"
        defaultRange="1M"
      />
    </AppShell>
  );
}
