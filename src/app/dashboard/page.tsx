'use client';

import Link from 'next/link';
import StatusCard from '../components/StatusCard';
import AssetRow from '../components/AssetRow';
import { useState, useEffect } from 'react';
import AccountValueCard from '../components/AccountValueCard';
import WatchlistHeader from '../components/WatchlistHeader';
import TopBar from '../components/TopBar';
import AppShell from '../components/layout/AppShell';
import { usePortfolio } from '../context/PortfolioContext';
import { useRouter } from 'next/navigation';

// =====================
// Typen
// =====================
interface Asset {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend: 'up' | 'down' | 'neutral';
  image?: string;
  sparklineData?: number[];
  onClick?: () => void;
}

interface StockRaw {
  '01. symbol': string;
  '05. price': string;
  '10. change percent': string;
}

interface CryptoRaw {
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

// =====================
// Level Ring
// =====================
function LevelRing({ percent, size = 42 }: { percent: number; size?: number }) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

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

// =====================
// PAGE
// =====================
export default function DashboardPage() {
  const levelPercent = 100;
  const { balance } = usePortfolio();
  const router = useRouter();

  const tabs = ['New', 'Gold', 'Scalping'] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('New');

  const [assetsByTab, setAssetsByTab] = useState<{
    New: Asset[];
    Gold: Asset[];
    Scalping: Asset[];
  }>({
    New: [],
    Gold: [],
    Scalping: [],
  });

  // =====================
  // FETCH MARKETS
  // =====================
  useEffect(() => {
    async function fetchMarkets() {
      try {
        const res = await fetch('/api/markets');
        const rawData = await res.json();

        // ---------- CRYPTO NORMALISIEREN (MERGE-SICHER) ----------
        const cryptoArray: CryptoRaw[] = Array.isArray(rawData.crypto)
          ? rawData.crypto
          : Array.isArray(rawData.crypto?.data)
          ? rawData.crypto.data
          : [];

        const newAssets: Asset[] = cryptoArray.map((c) => ({
          name: c.name,
          symbol: c.symbol.toUpperCase(),
          price: c.current_price ?? 0,
          changePct: c.price_change_percentage_24h ?? 0,
          trend:
            c.price_change_percentage_24h > 0
              ? 'up'
              : c.price_change_percentage_24h < 0
              ? 'down'
              : 'neutral',
          image: c.image,
          sparklineData:
            c.sparkline_in_7d?.price?.length
              ? c.sparkline_in_7d.price
              : Array.from({ length: 10 }, (_, i) =>
                  (c.current_price ?? 0) +
                  Math.sin(i / 2) * ((c.current_price ?? 0) * 0.01)
                ),
        }));

        // ---------- STOCKS ----------
        const goldAssets: Asset[] = (rawData.stocks ?? [])
          .filter(Boolean)
          .map((s: StockRaw) => {
            const changePctNum =
              Number(s['10. change percent']?.replace('%', '')) || 0;

            return {
              name: s['01. symbol'],
              symbol: s['01. symbol'],
              price: Number(s['05. price']) || 0,
              changePct: changePctNum,
              trend:
                changePctNum > 0
                  ? 'up'
                  : changePctNum < 0
                  ? 'down'
                  : 'neutral',
            };
          });

        // ---------- XAU/USD MANUELL ----------
        goldAssets.unshift({
          name: 'Gold (XAU/USD)',
          symbol: 'XAUUSD',
          price: 4950.12,
          changePct: 0.35,
          trend: 'up',
          image: '/gold.png',
        });

        // ---------- SCALPING ----------
        const scalpingAssets = newAssets.filter(
          (a) => a.symbol === 'SOL' || a.symbol === 'ADA'
        );

        setAssetsByTab({
          New: newAssets,
          Gold: goldAssets,
          Scalping: scalpingAssets,
        });
      } catch (err) {
        console.error('Failed to fetch markets:', err);
      }
    }

    fetchMarkets();
  }, []);

  // =====================
  // RENDER
  // =====================
  return (
    <AppShell containerClassName="flex flex-col flex-1 min-h-0 gap-3">
      <TopBar />

      <AccountValueCard
        value={balance}
        changeSumToday={0}
        changePct={0}
        currency="EUR"
      />

      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatusCard label="Margin" value="0,00 €" />
        <StatusCard
          label="Level"
          value={`${levelPercent}%`}
          rightSide={<LevelRing percent={levelPercent} />}
        />
      </div>

      <StatusCard
        label="Cash"
        value={`${balance.toFixed(2)} €`}
        rightSide={
          <button
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full"
            onClick={() => router.push('/deposit')}
          >
            Deposit
          </button>
        }
      />

      <section className="border border-white/5 bg-white/5 rounded-2xl flex flex-col flex-1 min-h-0">
        <div className="px-4 py-4 flex flex-col flex-1 min-h-0">
          <WatchlistHeader
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddClick={() => {}}
            onEditClick={() => {}}
          />

          <div className="mt-4 overflow-y-auto pr-2 flex-1 min-h-0">
            {assetsByTab[activeTab].map((asset) => (
              <AssetRow
              {...asset}
onClick={() => {
  if (asset?.symbol === 'XAUUSD') {
    router.push(`/search/${asset.symbol.toLowerCase()}`);
  }
}}

                key={asset.symbol}
               
              />
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}