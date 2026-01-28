'use client';

import Link from 'next/link';
import StatusCard from '../components/StatusCard';
import AssetRow from '../components/AssetRow';
import { useState, useContext } from 'react';
import AccountValueCard from '../components/AccountValueCard';
import WatchlistHeader from '../components/WatchlistHeader';
import TopBar from '../components/TopBar';
import AppShell from '../components/layout/AppShell';
import { usePortfolio } from '../context/PortfolioContext';
import { useRouter } from 'next/navigation';
import { MarketsContext } from '../context/MarketsContext';

// =====================
// Typ für Assets
// =====================
interface Asset {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend: 'up' | 'down' | 'neutral';
  image?: string; // optionales Feld für das Logo
  onClick?: () => void;
}

function LevelRing({ percent, size = 42 }: { percent: number; size?: number }) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clampedPercent / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0, 166, 62, 0.4)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0, 166, 62, 1)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const levelPercent = 100;
  const { balance } = usePortfolio();
  const router = useRouter();

  const tabs = ['New', 'Gold', 'Scalping'] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);

  // ✅ Märkte aus Context holen
  const { crypto, stocks, loading } = useContext(MarketsContext);

  // --- Assets nach Tabs filtern ---
  const assetsByTab: Record<string, Asset[]> = {
    New: crypto.filter((c) => ['BTC', 'ETH', 'SOL', 'ADA'].includes(c.symbol.toUpperCase())),
    Gold: [
      {
        name: 'Gold (XAU/USD)',
        symbol: 'XAUUSD',
        price: 4950.12,
        changePct: 0.35,
        trend: 0.35 > 0 ? 'up' : 0.35 < 0 ? 'down' : 'neutral',
        image: '/gold.png',
      },
      ...stocks, // restliche Stocks
    ],
    Scalping: crypto.filter((c) => ['SOL', 'ADA'].includes(c.symbol.toUpperCase())),
  };

  if (loading) {
    return (
      <AppShell>
        <p className="text-white p-6">Loading markets...</p>
      </AppShell>
    );
  }

  return (
    <AppShell containerClassName="flex flex-col flex-1 min-h-0 gap-3">
      <TopBar />

      <AccountValueCard value={balance} changeSumToday={0} changePct={0} currency="EUR" />

      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatusCard label="Margin" value="0,00 €" />
        <StatusCard label="Level" value={`${levelPercent}%`} rightSide={<LevelRing percent={levelPercent} />} />
      </div>

      <StatusCard
        label="Cash"
        value={`${balance.toFixed(2)} €`}
        rightSide={
          <button
            type="button"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full"
            onClick={() => router.push('/deposit')}
          >
            Deposit
          </button>
        }
      />

      <section className="border border-white/5 text-white/50 bg-white/5 rounded-2xl flex flex-col flex-1 min-h-0">
        <div className="px-4 py-4 flex flex-col flex-1 min-h-0">
          <WatchlistHeader
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddClick={() => console.log('add watchlist')}
            onEditClick={() => console.log('edit watchlists')}
          />

          <div className="mt-4 overflow-y-auto overflow-x-hidden pr-2 flex-1 min-h-0">
            {assetsByTab[activeTab]?.map((asset) => (
              <AssetRow
                key={asset.symbol}
                name={asset.name}
                symbol={asset.symbol}
                price={asset.price}
                changePct={asset.changePct}
                trend={asset.trend}
                image={asset.image}
                onClick={() => router.push(`/search/${asset.symbol.toLowerCase()}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
