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
import CreateWatchlistSheet from '../components/CreateWatchlistSheet';
import AddInstrumentSheet from '../components/AddInstrumentSheet';
import WatchlistSettingsSheet from '../components/WatchlistSettingsSheet';

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
  type Tab = (typeof tabs)[number];

  const [watchlists, setWatchlists] = useState<Tab[]>(['New', 'Gold', 'Scalping']);
  const [activeTab, setActiveTab] = useState<Tab>('New');
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isAddInstrumentOpen, setIsAddInstrumentOpen] = useState(false);
  const [isWatchlistSettingsOpen, setIsWatchlistSettingsOpen] = useState(false);

  const [assetsByTab, setAssetsByTab] = useState<Record<Tab, Asset[]>>({
    New: [],
    Gold: [],
    Scalping: [],
  });

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const res = await fetch('/api/markets');
        const rawData = (await res.json()) as {
          crypto: CryptoRaw[];
          stocks: StockRaw[];
        };

        // Crypto für New-Tab
        const newAssets: Asset[] = (rawData.crypto || []).map((c) => ({
          name: c.name,
          symbol: c.symbol.toUpperCase(),
          price: c.current_price || 0,
          changePct: c.price_change_percentage_24h || 0,
          trend:
            c.price_change_percentage_24h > 0
              ? 'up'
              : c.price_change_percentage_24h < 0
              ? 'down'
              : 'neutral',
          image: c.image,
        }));

        // Stocks für Gold-Tab
        const goldAssets: Asset[] = (rawData.stocks || [])
          .filter((s): s is StockRaw => !!s)
          .map((s) => {
            const changePctNum = Number(s['10. change percent']?.replace('%', '')) || 0;
            return {
              name: s['01. symbol'] || 'Unknown',
              symbol: s['01. symbol'] || 'UNK',
              price: Number(s['05. price']) || 0,
              changePct: changePctNum,
              trend: changePctNum > 0 ? 'up' : changePctNum < 0 ? 'down' : 'neutral',
            };
          });

        // Gold (XAU/USD) hinzufügen
        goldAssets.unshift({
          name: 'Gold (XAU/USD)',
          symbol: 'XAUUSD',
          price: 4950.12,
          changePct: 0.35,
          trend: 0.35 > 0 ? 'up' : 0.35 < 0 ? 'down' : 'neutral',
          image: '/gold.png',
        });

        // Scalping aus Crypto filtern
        const scalpingAssets = newAssets.filter((c) => c.symbol === 'SOL' || c.symbol === 'ADA');

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
            tabs={watchlists}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddClick={() => setIsCreateSheetOpen(true)}
            onEditClick={() => setIsWatchlistSettingsOpen(true)}
          />

          <div className="mt-4 overflow-y-auto overflow-x-hidden pr-2 flex-1 min-h-0">
            {(assetsByTab[activeTab]?.length ?? 0) === 0 ? (
              <div className="py-10 text-center">
                <p className="text-white/80 text-sm font-medium">This Watchlist is empty</p>
                <p className="text-white/40 text-xs mt-2 max-w-sm mx-auto">
                  Add the instruments that interest you to easily track their performance.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-full"
                    onClick={() => setIsAddInstrumentOpen(true)}
                  >
                    <span className="text-lg leading-none">+</span>
                    Add Instruments
                  </button>

                  <button
                    type="button"
                    aria-label="settings"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/15 text-white/80"
                    onClick={() => setIsWatchlistSettingsOpen(true)}
                  >
                    ⚙️
                  </button>
                </div>
              </div>
            ) : (
              assetsByTab[activeTab]?.map((asset) => (
                <Link
                  key={asset.symbol}
                  href={`/search/${asset.symbol}`}
                  className="block"
                >
                  <AssetRow
                    name={asset.name}
                    symbol={asset.symbol}
                    price={asset.price}
                    changePct={asset.changePct}
                    trend={asset.trend}
                    image={asset.image}
                  />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <CreateWatchlistSheet
        open={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        onCreate={(name) => console.log('Create watchlist:', name)}
      />

      <WatchlistSettingsSheet
        open={isWatchlistSettingsOpen}
        onClose={() => setIsWatchlistSettingsOpen(false)}
        watchlistName={activeTab}
        onRename={(next) => console.log('rename:', next)}
        onDelete={() => console.log('delete watchlist')}
      />

      <AddInstrumentSheet
        open={isAddInstrumentOpen}
        onClose={() => setIsAddInstrumentOpen(false)}
        instruments={[]}
        onAdd={(instrument) => console.log('add instrument:', instrument)}
      />
    </AppShell>
  );
}
