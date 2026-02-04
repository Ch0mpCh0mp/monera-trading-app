'use client';

import { use, useMemo } from 'react';
import AppShell from '@/app/components/layout/AppShell';
import SymbolHeader from './SymbolHeader';
import BuySellCard from './BuySellCard';
import { Gem } from 'lucide-react';
import PerformanceRow from './PerformanceRow';
import ChartCard, { type ChartPoint } from './ChartCard';
import { usePortfolio } from '../../context/PortfolioContext';

// =====================
// PAGE
// =====================
export default function SymbolPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  // ✅ Next.js 15: params korrekt entpacken
  const { symbol } = use(params);

  const { buy, sell, positions, balance } = usePortfolio();

  // =====================
  // ABGELEITETER STATE (KEIN useEffect, KEIN setState)
  // =====================
  const asset = useMemo(
    () => positions.find(p => p.symbol === symbol),
    [positions, symbol]
  );

  const sellPrice = asset ? asset.avgPrice - 0.5 : 4442.64;
  const buyPrice  = asset ? asset.avgPrice + 0.5 : 4443.65;
  const position  = asset ? asset.amount : 0;

  // =====================
  // DEMO CHART DATEN
  // =====================
  const demoPoints: ChartPoint[] = [
    { t: '2026-01-01', p: 4200 },
    { t: '2026-01-05', p: 4250 },
    { t: '2026-01-10', p: 4305 },
    { t: '2026-01-15', p: 4520 },
    { t: '2026-01-18', p: 4380 },
    { t: '2026-01-22', p: 4442.64 },
  ];

  // =====================
  // BUY / SELL
  // =====================
  function handleBuy(amount: number) {
    buy(symbol, buyPrice, amount);
  }

  function handleSell(amount: number) {
    sell(symbol, sellPrice, amount);
  }

  // =====================
  // RENDER
  // =====================
  return (
    <AppShell>
      <SymbolHeader />
      <h1 className="text-white/90 text-2xl font-semibold text-center mt-2">
        {symbol.toUpperCase()}
      </h1>
      <BuySellCard
        sellPrice="4.442,64 €"
        buyPrice="4.443,65 €"
        assetIcon={<Gem className="w-6 h-6 text-yellow-400" />}
      />

      {/* Aktuelle Position */}
      <div className="mt-2 text-center text-white/90">
        Aktuelle Position: {position.toFixed(2)} {symbol}
      </div>

      {/* Performance */}
      <PerformanceRow value={242.14} percent={5.76} />

      <ChartCard
        points={demoPoints}
        currentPrice={4442.64}
        currencySuffix="$"
        defaultRange="1M"
      />
    </AppShell>
  );
}
