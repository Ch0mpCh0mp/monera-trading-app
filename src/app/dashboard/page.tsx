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
// Typ für Assets
// =====================
interface Asset {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend: 'up' | 'down' | 'neutral';
  image?: string; // optionales Feld für das Logo

  // ANDREA, HAB DAS HIER NOCH EINGEFÜGT FÜR SPARKLINE
  sparklineData?: number[];
}

interface StockRaw {
  '01. symbol': string;
  '05. price': string;
  '10. change percent': string;
}

// Typ für Crypto-Rohdaten
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
  const { balance, setBalance } = usePortfolio();
  const router = useRouter();

  // RAUSNEHMEN NICHT VERGESSEN
  // const tabs = ['New', 'Gold', 'Scalping'] as const;
  // const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);

  const [watchlists, setWatchlists] = useState<string[]>([
    'New',
    'Gold',
    'Scalping',
  ]);
  const [activeTab, setActiveTab] = useState<string>('New');

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  // --- FETCH MARKETS ANSTATT MOCKDATEN ---
  // const [assetsByTab, setAssetsByTab] = useState<{
  //   New: Asset[];
  //   Gold: Asset[];
  //   Scalping: Asset[];
  // }>({
  //   New: [],
  //   Gold: [],
  //   Scalping: [],
  // });

  const [assetsByTab, setAssetsByTab] = useState<Record<string, Asset[]>>({
    New: [],
    Gold: [],
    Scalping: [],
  });

  const [isAddInstrumentOpen, setIsAddInstrumentOpen] = useState(false);
  const [isWatchlistSettingsOpen, setIsWatchlistSettingsOpen] = useState(false);

  const instrumentUniverse = [
    ...(assetsByTab.New ?? []),
    ...(assetsByTab.Gold ?? []),
  ].reduce((acc, item) => {
    // unique by symbol
    if (!acc.some((x) => x.symbol === item.symbol)) acc.push(item);
    return acc;
  }, [] as Asset[]);

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const res = await fetch('/api/markets');
        const rawData = (await res.json()) as {
          crypto: any[];
          stocks: StockRaw[];
        };
        console.log('rawData:', rawData);

        // Crypto für New-Tab (Live-Daten) inkl. Sparkline
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
          // Wenn echte Sparkline nicht existiert, generiere Testwerte (leicht variiert)
          sparklineData:
            c.sparkline_in_7d?.price && c.sparkline_in_7d.price.length > 0
              ? c.sparkline_in_7d.price
              : Array.from(
                  { length: 10 },
                  (_, i) =>
                    c.current_price + Math.sin(i / 2) * (c.current_price * 0.01)
                ),
        }));

        // Stocks für Gold-Tab
        const goldAssets: Asset[] = (rawData.stocks || [])
          .filter((s): s is StockRaw => s !== null && s !== undefined)
          .map((s) => {
            const changePctNum =
              Number(s['10. change percent']?.replace('%', '')) || 0;
            return {
              name: s['01. symbol'] || 'Unknown',
              symbol: s['01. symbol'] || 'UNK',
              price: Number(s['05. price']) || 0,
              changePct: changePctNum,
              trend:
                changePctNum > 0 ? 'up' : changePctNum < 0 ? 'down' : 'neutral',
            };
          });

        //  HIER XAU/USD HINZUFÜGEN
        goldAssets.unshift({
          name: 'Gold (XAU/USD)',
          symbol: 'XAUUSD',
          price: 4950.12, // Hier kannst du einen aktuellen Goldpreis einsetzen
          changePct: 0.35, // Beispielwert für die Veränderung
          trend: 0.35 > 0 ? 'up' : 0.35 < 0 ? 'down' : 'neutral',
          image: '/gold.png', // optional, wenn du ein Icon hast, sonst weglassen
        });

        // Scalping aus Crypto filtern
        const scalpingAssets = newAssets.filter(
          (c) => c.symbol === 'SOL' || c.symbol === 'ADA'
        );

        setAssetsByTab((prev) => ({
          ...prev,
          New: newAssets,
          Gold: goldAssets,
          Scalping: scalpingAssets,
        }));

        // setAssetsByTab({
        //   New: newAssets,
        //   Gold: goldAssets,
        //   Scalping: scalpingAssets,
        // });
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
        value={balance} // vorher 12543.21
        changeSumToday={0} // optional: wir starten mit 0 Veränderung
        changePct={0} // optional: 0%
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

      {/* GROSSER AKTIENBLOCK */}
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
                <p className="text-white/80 text-sm font-medium">
                  This Watchlist is empty
                </p>

                <p className="text-white/40 text-xs mt-2 max-w-sm mx-auto">
                  Add the instruments that interest you to easily track their
                  performance and price changes in one place.
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
              assetsByTab[activeTab]!.map((asset) => (
                <AssetRow
                  key={asset.symbol}
                  name={asset.name}
                  symbol={asset.symbol}
                  price={asset.price}
                  changePct={asset.changePct}
                  trend={asset.trend}
                  image={asset.image}
                />
              ))
            )}
          </div>

          {/* <div className="mt-4 overflow-y-auto overflow-x-hidden pr-2 flex-1 min-h-0">
            {assetsByTab[activeTab]?.map((asset) => (
              <AssetRow
                key={asset.symbol}
                name={asset.name}
                symbol={asset.symbol}
                price={asset.price}
                changePct={asset.changePct}
                trend={asset.trend}
                image={asset.image}
              />
            ))}
          </div> */}
        </div>
      </section>

      {/* PLUSZEICHEN */}
      <CreateWatchlistSheet
        open={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        onCreate={(name) => {
          // 1) Sheet schließen
          setIsCreateSheetOpen(false);

          // 2) Watchlist-Tab hinzufügen (falls noch nicht da)
          setWatchlists((prev) => {
            const trimmed = name.trim();
            if (!trimmed) return prev;

            const exists = prev.some(
              (w) => w.toLowerCase() === trimmed.toLowerCase()
            );
            return exists ? prev : [...prev, trimmed];
          });

          // 3) Leere Liste für diese Watchlist anlegen (falls noch nicht da)
          setAssetsByTab((prev) => {
            const trimmed = name.trim();
            if (!trimmed) return prev;

            return prev[trimmed] ? prev : { ...prev, [trimmed]: [] };
          });

          // 4) Direkt auf den neuen Tab wechseln
          setActiveTab(name.trim());
        }}

        // onCreate={(name) => {
        //   console.log('Create watchlist:', name);
        // }}
      />

      <AddInstrumentSheet
        open={isAddInstrumentOpen}
        onClose={() => setIsAddInstrumentOpen(false)}
        instruments={instrumentUniverse}
        title={`Add to "${activeTab}"`}
        onAdd={(instrument) => {
          setAssetsByTab((prev) => {
            const list = prev[activeTab] ?? [];
            const exists = list.some((a) => a.symbol === instrument.symbol);
            if (exists) return prev;

            return {
              ...prev,
              [activeTab]: [...list, instrument],
            };
          });

          setIsAddInstrumentOpen(false);
        }}
      />

      <WatchlistSettingsSheet
        open={isWatchlistSettingsOpen}
        onClose={() => setIsWatchlistSettingsOpen(false)}
        watchlistName={activeTab}
        onRename={(nextName) => {
          const from = activeTab;
          const to = nextName.trim();
          if (!to || to === from) return;

          const dupe = watchlists.some(
            (w) => w.toLowerCase() === to.toLowerCase()
          );
          if (dupe) return;

          setWatchlists((prev) => prev.map((w) => (w === from ? to : w)));

          setAssetsByTab((prev) => {
            const next = { ...prev };
            next[to] = next[from] ?? [];
            delete next[from];
            return next;
          });

          setActiveTab(to);
          setIsWatchlistSettingsOpen(false);
        }}
        onDelete={() => {
          const toDelete = activeTab;

          setWatchlists((prev) => prev.filter((w) => w !== toDelete));

          setAssetsByTab((prev) => {
            const next = { ...prev };
            delete next[toDelete];
            return next;
          });

          const remaining = watchlists.filter((w) => w !== toDelete);
          setActiveTab(remaining[0] ?? 'New');

          setIsWatchlistSettingsOpen(false);
        }}
      />
    </AppShell>
  );
}
