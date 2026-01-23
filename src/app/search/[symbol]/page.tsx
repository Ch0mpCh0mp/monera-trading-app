'use client';

import AppShell from '@/app/components/layout/AppShell';
import SymbolHeader from './SymbolHeader';
import BuySellCard from './BuySellCard';
import { Gem } from 'lucide-react';
import PerformanceRow from './PerformanceRow';
import ChartCard, { type ChartPoint } from './ChartCard';
import { usePortfolio } from '../../context/PortfolioContext';
import { useState, useEffect } from 'react';

export default function SymbolPage({ params }: { params: { symbol: string } }) {
  const { symbol } = params;
  const { buy, sell, positions, balance } = usePortfolio();

  // --- State für dynamische Preise ---
  const [sellPrice, setSellPrice] = useState<number>(4442.64);
  const [buyPrice, setBuyPrice] = useState<number>(4443.65);

  // --- State für Positionsanzeige ---
  const [position, setPosition] = useState<number>(
    positions.find(p => p.symbol === symbol)?.amount ?? 0
  );

  // --- Effekt um Preise und Position zu setzen, wenn Portfolio sich ändert ---
  useEffect(() => {
    const asset = positions.find(p => p.symbol === symbol);
    if (asset) {
      setSellPrice(asset.avgPrice - 0.5); // kleines Spread
      setBuyPrice(asset.avgPrice + 0.5);
      setPosition(asset.amount);
    } else {
      setSellPrice(4442.64);
      setBuyPrice(4443.65);
      setPosition(0);
    }
  }, [positions, symbol]);

  // --- Demo Chart-Daten ---
  const demoPoints: ChartPoint[] = [
    { t: '2026-01-01', p: 4200 },
    { t: '2026-01-05', p: 4250 },
    { t: '2026-01-10', p: 4305 },
    { t: '2026-01-15', p: 4520 },
    { t: '2026-01-18', p: 4380 },
    { t: '2026-01-22', p: 4442.64 },
  ];

  // --- Buy / Sell Callbacks ---
  function handleBuy(amount: number) {
    buy(symbol, buyPrice, amount);       // PortfolioContext aktualisieren
    setPosition(prev => prev + amount);  // lokal aktualisieren
  }

  function handleSell(amount: number) {
    sell(symbol, sellPrice, amount);     // PortfolioContext aktualisieren
    setPosition(prev => prev - amount);  // lokal aktualisieren
  }

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
