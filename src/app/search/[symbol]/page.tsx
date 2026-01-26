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
import { useParams } from 'next/navigation';

export default function SymbolPage() {
  // ✅ Hooks IMMER ganz oben
  const params = useParams();

  const rawSymbol = params?.symbol;
  const symbol = Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol;

  const { buy, sell, positions, updatePositionPrice } = usePortfolio();

  const [tradeType, setTradeType] = useState<'buy' | 'sell' | null>(null);
  const [hidePosition, setHidePosition] = useState(false);

  // ✅ aktuelle Position
  const assetPosition = positions.find(p => p.symbol === symbol);

  // ✅ LIVE PREIS (Simulation)
  useEffect(() => {
  if (!symbol) return;

  const interval = setInterval(() => {
    const pos = positions.find(p => p.symbol === symbol);
    if (!pos) return;

    const base = pos.currentPrice ?? pos.avgPrice;
    const move = (Math.random() - 0.5) * 6;
    const newPrice = Number((base + move).toFixed(2));

    updatePositionPrice(symbol, newPrice);
  }, 1000);

  return () => clearInterval(interval);
}, [symbol, positions, updatePositionPrice]);


  if (!symbol) {
    return <p className="text-white p-6">Kein Symbol angegeben</p>;
  }

  const currentPrice =
    assetPosition?.currentPrice ?? 4443.65;

  const buyPrice = currentPrice;
  const sellPrice = currentPrice - 0.5;

  // ✅ korrektes PnL (Buy + Sell)
  const positionPreview =
  assetPosition &&
  assetPosition.entryPrice !== undefined &&
  !hidePosition
    ? {
        amount: assetPosition.amount,
        entryPrice: assetPosition.entryPrice,
        pnl:
          assetPosition.type === 'buy'
            ? (currentPrice - assetPosition.entryPrice) *
              assetPosition.amount
            : (assetPosition.entryPrice - currentPrice) *
              assetPosition.amount,
      }
    : undefined;


  // Demo Chart
  const demoPoints: ChartPoint[] = [
    { t: '1', p: 4400 },
    { t: '2', p: 4415 },
    { t: '3', p: 4425 },
    { t: '4', p: 4435 },
    { t: '5', p: currentPrice },
  ];

  return (
    <AppShell>
      {/* Trade Modal */}
      {tradeType && (
        <TradeModal
          type={tradeType}
          price={currentPrice}
          onClose={() => setTradeType(null)}
          onConfirm={(amount, leverage) => {
            if (tradeType === 'buy') {
              buy(symbol, currentPrice, amount, leverage);
            } else {
              sell(symbol, currentPrice, amount);
            }
            setTradeType(null);
          }}
        />
      )}

      <SymbolHeader />

      <h1 className="text-white text-2xl font-semibold text-center mt-2">
        {symbol}
      </h1>

      <BuySellCard
        buyPrice={buyPrice}
        sellPrice={sellPrice}
        assetIcon={<Gem className="w-6 h-6 text-yellow-400" />}
        onBuy={() => setTradeType('buy')}
        onSell={() => setTradeType('sell')}
        position={positionPreview}
        onClosePosition={() => setHidePosition(true)}
      />

      <PerformanceRow
        value={positionPreview?.pnl ?? 0}
        percent={0}
      />

      <ChartCard
        points={demoPoints}
        currentPrice={currentPrice}
        currencySuffix="€"
        defaultRange="1M"
      />
    </AppShell>
  );
}
