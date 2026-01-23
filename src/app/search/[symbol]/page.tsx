'use client';

import AppShell from '@/app/components/layout/AppShell';
import SymbolHeader from './SymbolHeader';
import BuySellCard from './BuySellCard';
import { Gem } from 'lucide-react';
import PerformanceRow from './PerformanceRow';
import ChartCard, { type ChartPoint } from './ChartCard';
import { usePortfolio } from '../../context/PortfolioContext';
import { useState, useEffect } from 'react';
import TradeModal from './TradeModal';


export default function SymbolPage({ params }: { params: { symbol: string } }) {
  const { symbol } = params;
  const { buy, sell, positions, balance } = usePortfolio();

  // --- State für dynamische Preise ---
  const [sellPrice, setSellPrice] = useState<number>(4442.64);
  const [buyPrice, setBuyPrice] = useState<number>(4443.65);
  const [tradeType, setTradeType] = useState<'buy' | 'sell' | null>(null);

  
  // --- Effekt um Preise und Position zu setzen, wenn Portfolio sich ändert ---
  useEffect(() => {
    const asset = positions.find(p => p.symbol === symbol);
    if (asset) {
      setSellPrice(asset.avgPrice - 0.5); // kleines Spread
      setBuyPrice(asset.avgPrice + 0.5);
    } else {
      setSellPrice(4442.64);
      setBuyPrice(4443.65);
    }
  }, [positions, symbol]);

  const assetPosition = positions.find(p => p.symbol === symbol);

const positionPreview = assetPosition
  ? {
      amount: assetPosition.amount,
      entryPrice: assetPosition.avgPrice,
      pnl:
        (buyPrice - assetPosition.avgPrice) *
        assetPosition.amount,
    }
  : undefined;


  // --- Demo Chart-Daten ---
  const demoPoints: ChartPoint[] = [
    { t: '2026-01-01', p: 4200 },
    { t: '2026-01-05', p: 4250 },
    { t: '2026-01-10', p: 4305 },
    { t: '2026-01-15', p: 4520 },
    { t: '2026-01-18', p: 4380 },
    { t: '2026-01-22', p: 4442.64 },
  ];




return (
  <AppShell>
    {tradeType && (
      <TradeModal
        type={tradeType}
        price={tradeType === 'buy' ? buyPrice : sellPrice}
        onClose={() => setTradeType(null)}
        onConfirm={(amount) => {
          if (tradeType === 'buy') {
            buy(symbol, buyPrice, amount);
          } else {
            sell(symbol, sellPrice, amount);
          }
          setTradeType(null);
        }}
      />
    )}

    <SymbolHeader />

    <h1 className="text-white/90 text-2xl font-semibold text-center mt-2">
      {symbol}
    </h1>

    <BuySellCard
      sellPrice={sellPrice}
      buyPrice={buyPrice}
      assetIcon={<Gem className="w-6 h-6 text-yellow-400" />}
      onBuy={() => setTradeType('buy')}
      onSell={() => setTradeType('sell')}
      position={positionPreview}
    />

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