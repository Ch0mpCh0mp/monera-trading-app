'use client';

import React, { useState, useContext } from 'react';
import AppShell from '@/app/components/layout/AppShell';
import SymbolHeader from './SymbolHeader';
import BuySellCard from './BuySellCard';
import { Gem } from 'lucide-react';
import PerformanceRow from './PerformanceRow';
import ChartCard, { type ChartPoint } from './ChartCard';
import TradeModal from './TradeModal';
import { usePortfolio } from '@/app/context/PortfolioContext';
import { useParams } from 'next/navigation';
import { MarketsContext } from '@/app/context/MarketsContext';

export default function SymbolPage() {
  const params = useParams();
  const rawSymbol = params?.symbol;
  const symbol = Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol;

  const { buy, sell, positions, closePosition } = usePortfolio();
  const { crypto, stocks, gold } = useContext(MarketsContext);

  const allAssets = [...crypto, ...stocks, ...gold];
  const asset = allAssets.find(a => a.symbol === symbol?.toUpperCase());
  const currentPrice = asset?.price ?? 0;

  const assetPosition = positions.find(p => p.symbol === symbol?.toUpperCase());

  const [tradeType, setTradeType] = useState<'buy' | 'sell' | null>(null);

  const positionPreview = assetPosition
    ? {
        amount: assetPosition.amount,
        entryPrice: assetPosition.entryPrice,
        pnl: assetPosition.pnl,
        currentPrice: assetPosition.currentPrice,
      }
    : undefined;

  const demoPoints: ChartPoint[] = [
    { t: '1', p: currentPrice - 20 },
    { t: '2', p: currentPrice - 10 },
    { t: '3', p: currentPrice - 5 },
    { t: '4', p: currentPrice - 2 },
    { t: '5', p: currentPrice },
  ];

  if (!symbol) return <p className="text-white p-6">Kein Symbol angegeben</p>;

  return (
    <AppShell>
      {tradeType && (
        <TradeModal
          type={tradeType}
          price={currentPrice}
          onClose={() => setTradeType(null)}
          onConfirm={(amount, leverage) => {
            if (tradeType === 'buy') {
              buy(symbol.toUpperCase(), currentPrice, amount, leverage);
            } else {
              sell(symbol.toUpperCase(), currentPrice, amount, leverage);
            }
            setTradeType(null);
          }}
        />
      )}

      <SymbolHeader />

      <h1 className="text-white text-2xl font-semibold text-center mt-2">
        {symbol.toUpperCase()}
      </h1>

      <BuySellCard
        buyPrice={currentPrice}
        sellPrice={currentPrice}
        assetIcon={<Gem className="w-6 h-6 text-yellow-400" />}
        onBuy={() => setTradeType('buy')}   // ✅ Button funktioniert
        onSell={() => setTradeType('sell')} // ✅ Button funktioniert
        position={positionPreview}
        onClosePosition={() => {
          if (assetPosition && confirm(`Position ${symbol} schließen?`)) {
            closePosition(assetPosition.symbol);
          }
        }}
      />

      <PerformanceRow value={positionPreview?.pnl ?? 0} percent={0} />

      <ChartCard
        points={demoPoints}
        currentPrice={currentPrice}
        currencySuffix="€"
        defaultRange="1M"
      />
    </AppShell>
  );
}
