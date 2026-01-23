'use client';

import { useState } from 'react';
import AppShell from '@/app/components/layout/AppShell';
import SymbolHeader from './SymbolHeader';
import BuySellCard from './BuySellCard';
import { Gem } from 'lucide-react';
import PerformanceRow from './PerformanceRow';
import ChartCard, { type ChartPoint } from './ChartCard';

export default function SymbolPage({ params }: { params: { symbol: string } }) {
  const { symbol } = params;

  // --- Demo Chart-Daten ---
  const demoPoints: ChartPoint[] = [
    { t: '2026-01-01', p: 4200 },
    { t: '2026-01-05', p: 4250 },
    { t: '2026-01-10', p: 4305 },
    { t: '2026-01-15', p: 4520 },
    { t: '2026-01-18', p: 4380 },
    { t: '2026-01-22', p: 4442.64 },
  ];

  // --- Position State ---
  const [position, setPosition] = useState<number>(0);

  // --- Buy / Sell Callbacks ---
  function handleBuy(amount: number) {
    setPosition(prev => prev + amount);
    console.log(`Bought ${amount} of ${symbol}, new position: ${position + amount}`);
  }

  function handleSell(amount: number) {
    setPosition(prev => prev - amount);
    console.log(`Sold ${amount} of ${symbol}, new position: ${position - amount}`);
  }

  // Beispielpreise
  const sellPrice = 4442.64;
  const buyPrice = 4443.65;

  return (
    <AppShell>
      <SymbolHeader />

      <h1 className="text-white/90 text-2xl font-semibold text-center mt-2">
        {symbol}
      </h1>

      <BuySellCard
        sellPrice={sellPrice}
        buyPrice={buyPrice}
        assetIcon={<Gem className="w-6 h-6 text-yellow-400" />}
        onBuy={handleBuy}
        onSell={handleSell}
      />

      {/* Aktuelle Position */}
      <div className="mt-2 text-center text-white/90">
        Aktuelle Position: {position.toFixed(2)} {symbol}
      </div>

      {/* Performance Row */}
      <PerformanceRow value={242.14} percent={5.76} />

      {/* Chart */}
      <ChartCard
        points={demoPoints}
        currentPrice={buyPrice}
        currencySuffix="€"
        defaultRange="1M"
      />
    </AppShell>
  );
}
