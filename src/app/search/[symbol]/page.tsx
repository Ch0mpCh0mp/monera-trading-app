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
  const [asset, setAsset] = useState<Asset | null>(null);

  // ✅ Aktuelle Position
  const assetPosition = positions.find(p => p.symbol === symbol);

  // --- LIVE PREIS FETCH ---
 useEffect(() => {
  if (!symbol) return;

  const fetchPrice = async () => {
    try {
      const res = await fetch('/api/markets');
      const rawData = await res.json() as { crypto: any[]; stocks: any[] };

      const allAssets: Asset[] = [
        ...(Array.isArray(rawData.crypto) ? rawData.crypto : []).map(c => ({
          name: c.name,
          symbol: c.symbol.toUpperCase(),
          price: c.current_price,
          changePct: c.price_change_percentage_24h ?? 0,
          trend:
            c.price_change_percentage_24h > 0
              ? 'up'
              : c.price_change_percentage_24h < 0
              ? 'down'
              : 'neutral',
          image: c.image,
        } as Asset)), // <-- Cast auf Asset
        ...(Array.isArray(rawData.stocks) ? rawData.stocks : []).map(s => ({
          name: s['01. symbol'],
          symbol: s['01. symbol'],
          price: Number(s['05. price']),
          changePct: Number(s['10. change percent']?.replace('%', '')) || 0,
          trend:
            Number(s['10. change percent']?.replace('%', '')) > 0
              ? 'up'
              : Number(s['10. change percent']?.replace('%', '')) < 0
              ? 'down'
              : 'neutral',
        } as Asset)), // <-- Cast auf Asset
      ];

      const current = allAssets.find(a => a.symbol === symbol.toUpperCase());
      if (current) setAsset(current);
    } catch (err) {
      console.error('Failed to fetch asset:', err);
    }
  };

  fetchPrice();
  const interval = setInterval(fetchPrice, 5000); // <-- const statt let

  return () => clearInterval(interval);
}, [symbol]);


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
