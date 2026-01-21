'use client';

import Link from 'next/link';
import StatusCard from '../components/StatusCard';
import AssetRow from '../components/AssetRow';
import { useState , useEffect} from 'react';
import AccountValueCard from '../components/AccountValueCard';
import WatchlistHeader from '../components/WatchlistHeader';
import TopBar from '../components/TopBar';
import AppShell from '../components/layout/AppShell';


// =====================
// Typ für Assets
// =====================
interface Asset {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend: 'up' | 'down' | 'neutral';
}

function LevelRing({ percent, size = 42 }: { percent: number; size?: number }) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clampedPercent / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* HINTERGRUND (inaktiv) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0, 166, 62, 0.4)"
          strokeWidth={stroke}
        />

        {/* FORTSCHRITT (aktiv) */}
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

  const tabs = ['New', 'Gold', 'Scalping'] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);

// --- FETCH MARKETS ANSTATT MOCKDATEN ---
const [assetsByTab, setAssetsByTab] = useState<{
  New: Asset[];
  Gold: Asset[];
  Scalping: Asset[];
}>({
  New: [],
  Gold: [],
  Scalping: [],
});

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const res = await fetch('/api/markets');
        const data = await res.json();

        // Scalping aus Crypto filtern (Beispiel: SOL + ADA)
        const scalpingAssets = (data.crypto || []).filter(
          (c: Asset) => c.symbol === 'SOL' || c.symbol === 'ADA'
        );

        setAssetsByTab({
          New: data.crypto || [],
          Gold: data.stocks || [],
          Scalping: scalpingAssets,
        });
      } catch (err) {
        console.error('Failed to fetch markets:', err);
      }
    }

    fetchMarkets();
  }, []);
  // --- ENDE FETCH ---

  return (
    <AppShell containerClassName="flex flex-col flex-1 min-h-0 gap-3">
      {/* LOGO MIT GLOCKE */}
      <TopBar />

      {/* ACCOUNT VALUE */}
      <AccountValueCard
        value={12543.21}
        changeSumToday={123.45}
        changePct={0.99}
        currency="EUR"
      />

      {/* MARGIN & LEVEL */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatusCard label="Margin" value="0,00 €" />
        <StatusCard
          label="Level"
          value={`${levelPercent}%`}
          rightSide={<LevelRing percent={levelPercent} />}
        />
      </div>

      {/* CASH UND DEPOSIT BUTTON */}
      <StatusCard
        label="Cash"
        value="0,00 €"
        rightSide={
          <Link
            href="/deposit"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full"
          >
            Deposit
          </Link>
        }
      />

      {/* GROSSER AKTIENBLOCK */}
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
              />
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
