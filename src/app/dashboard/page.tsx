'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

import StatusCard from '../components/StatusCard';
import AssetRow from '../components/AssetRow';
import AccountValueCard from '../components/AccountValueCard';
import WatchlistHeader from '../components/WatchlistHeader';
import TopBar from '../components/TopBar';
import AppShell from '../components/layout/AppShell';

import { usePortfolio } from '../context/PortfolioContext';
import { MarketsContext } from '../context/MarketsContext';

import CreateWatchlistSheet from '../components/CreateWatchlistSheet';
import AddInstrumentSheet from '../components/AddInstrumentSheet';
import WatchlistSettingsSheet from '../components/WatchlistSettingsSheet';

// =====================
// TYPES
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

// Dynamische Watchlists erlauben
interface AssetsByTab {
  [key: string]: Asset[];
}

// =====================
// LEVEL RING
// =====================

function LevelRing({ percent, size = 42 }: { percent: number; size?: number }) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,166,62,0.4)"
          strokeWidth={stroke}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,166,62,1)"
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
  const router = useRouter();
  const { balance } = usePortfolio();

  const levelPercent = 100;

  // Context
  const { crypto, gold, loading } = useContext(MarketsContext);

  // Watchlists
  const [watchlists, setWatchlists] = useState<string[]>([
    'New',
    'Gold',
    'Scalping',
  ]);

  const [activeTab, setActiveTab] = useState<string>('New');

  // Assets pro Tab
  const [assetsByTab, setAssetsByTab] = useState<AssetsByTab>({
    New: [],
    Gold: [],
    Scalping: [],
  });

  // Sheets
  const [createOpen, setCreateOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // =====================
  // LOAD MARKETS
  // =====================

  useEffect(() => {
    if (loading) return;

    const newAssets: Asset[] = crypto.map((c) => ({
      name: c.name,
      symbol: c.symbol,
      price: c.price,
      changePct: c.changePct,
      trend: c.trend,
      image: c.image,
    }));

    const goldAssets: Asset[] = gold.map((g) => ({
      name: g.name,
      symbol: g.symbol,
      price: g.price,
      changePct: g.changePct,
      trend: g.trend,
      image: g.image,
    }));

    const scalpingAssets = newAssets.filter(
      (a) => a.symbol === 'SOL' || a.symbol === 'ADA'
    );

    setAssetsByTab({
      New: newAssets,
      Gold: goldAssets,
      Scalping: scalpingAssets,
    });
  }, [crypto, gold, loading]);

  // =====================
  // INSTRUMENT UNIVERSE
  // =====================

  const instrumentUniverse: Asset[] = Object.values(assetsByTab)
    .flat()
    .reduce((acc: Asset[], item) => {
      if (!acc.some((x) => x.symbol === item.symbol)) {
        acc.push(item);
      }
      return acc;
    }, []);

  // =====================
  // LOADING
  // =====================

  if (loading) {
    return (
      <AppShell>
        <p className="text-white p-6">Loading markets...</p>
      </AppShell>
    );
  }

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

      {/* WATCHLIST */}
      <section className="border border-white/5 bg-white/5 rounded-2xl flex flex-col flex-1 min-h-0">

        <div className="px-4 py-4 flex flex-col flex-1 min-h-0">

          <WatchlistHeader
            tabs={watchlists}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddClick={() => setCreateOpen(true)}
            onEditClick={() => setSettingsOpen(true)}
          />

          <div className="mt-4 overflow-y-auto flex-1 pr-2">

            {(assetsByTab[activeTab]?.length ?? 0) === 0 ? (
              <div className="py-10 text-center">

                <p className="text-white/80 text-sm font-medium">
                  This Watchlist is empty
                </p>

                <p className="text-white/40 text-xs mt-2">
                  Add instruments to start tracking.
                </p>

                <div className="mt-6 flex justify-center gap-3">

                  <button
                    className="bg-white/10 hover:bg-white/15 px-5 py-3 rounded-full"
                    onClick={() => setAddOpen(true)}
                  >
                    + Add
                  </button>

                  <button
                    className="w-11 h-11 rounded-full bg-white/10"
                    onClick={() => setSettingsOpen(true)}
                  >
                    ⚙️
                  </button>

                </div>
              </div>
            ) : (
              assetsByTab[activeTab].map((asset) => (
                <AssetRow
                  key={asset.symbol}
                  name={asset.name}
                  symbol={asset.symbol}
                  price={asset.price}
                  changePct={asset.changePct}
                  trend={asset.trend}
                  image={asset.image}
                  onClick={() =>
                    router.push(`/search/${asset.symbol.toLowerCase()}`)
                  }
                />
              ))
            )}

          </div>
        </div>
      </section>

      {/* CREATE */}
      <CreateWatchlistSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(name) => {
          const trimmed = name.trim();
          if (!trimmed) return;

          setCreateOpen(false);

          setWatchlists((prev) =>
            prev.includes(trimmed) ? prev : [...prev, trimmed]
          );

          setAssetsByTab((prev) => ({
            ...prev,
            [trimmed]: [],
          }));

          setActiveTab(trimmed);
        }}
      />

      {/* ADD */}
      <AddInstrumentSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        instruments={instrumentUniverse}
        title={`Add to "${activeTab}"`}
        onAdd={(instrument) => {
          setAssetsByTab((prev) => {
            const list = prev[activeTab] ?? [];

            if (list.some((a) => a.symbol === instrument.symbol)) {
              return prev;
            }

            return {
              ...prev,
              [activeTab]: [...list, instrument],
            };
          });

          setAddOpen(false);
        }}
      />

      {/* SETTINGS */}
      <WatchlistSettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        watchlistName={activeTab}
        onRename={(next) => {
          const to = next.trim();
          if (!to || to === activeTab) return;

          setWatchlists((prev) =>
            prev.map((w) => (w === activeTab ? to : w))
          );

          setAssetsByTab((prev) => {
            const copy = { ...prev };

            copy[to] = copy[activeTab];
            delete copy[activeTab];

            return copy;
          });

          setActiveTab(to);
          setSettingsOpen(false);
        }}
        onDelete={() => {
          const del = activeTab;

          setWatchlists((prev) => prev.filter((w) => w !== del));

          setAssetsByTab((prev) => {
            const copy = { ...prev };
            delete copy[del];
            return copy;
          });

          setActiveTab('New');
          setSettingsOpen(false);
        }}
      />
    </AppShell>
  );
}
