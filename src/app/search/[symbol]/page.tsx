'use client';

import AppShell from '@/app/components/layout/AppShell';
import SymbolHeader from './SymbolHeader';
import BuySellCard from './BuySellCard';
import { Gem } from 'lucide-react';
import PerformanceRow from './PerformanceRow';
import ChartCard, { type ChartPoint } from './ChartCard';
import { usePortfolio } from '../../context/PortfolioContext';
import { useState, useEffect, useContext } from 'react';
import TradeModal from './TradeModal';
import { useParams } from 'next/navigation';
import { MarketsContext, Asset as ContextAsset } from '../../context/MarketsContext';


// Typ für Asset
interface Asset {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend: 'up' | 'down' | 'neutral';
  image?: string;
}

export default function SymbolPage() {
  const params = useParams();
  const rawSymbol = params?.symbol;
  const symbol = Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol;

  const { buy, sell, positions, updatePositionPrice, closePosition } = usePortfolio();

  const [tradeType, setTradeType] = useState<'buy' | 'sell' | null>(null);

  // ✅ Aktuelle Position
  const assetPosition = positions.find(p => p.symbol === symbol);

  // --- LIVE PREIS FETCH ---

const { crypto, stocks, loading } = useContext(MarketsContext);

// Suche das aktuelle Asset aus Context
const allAssets: Asset[] = [...crypto, ...stocks];
const asset = allAssets.find(a => a.symbol === symbol?.toUpperCase()) || null;





  const currentPrice = asset?.price ?? 0;

  const buyPrice = currentPrice;
  const sellPrice = currentPrice - 0.5;

  // ✅ PnL
  const positionPreview =
    assetPosition &&
    assetPosition.entryPrice !== undefined
      ? {
          amount: assetPosition.amount,
          entryPrice: assetPosition.entryPrice,
          pnl:
            assetPosition.type === 'buy'
              ? (currentPrice - assetPosition.entryPrice) * assetPosition.amount
              : (assetPosition.entryPrice - currentPrice) * assetPosition.amount,
        }
      : undefined;

  // Demo Chart
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
        onClosePosition={() => {
        if (assetPosition) closePosition(assetPosition.symbol);

        }}
      />

      <PerformanceRow value={positionPreview?.pnl ?? 0} percent={0} />

      <ChartCard points={demoPoints} currentPrice={currentPrice} currencySuffix="€" defaultRange="1M" />
    </AppShell>
  );
}
