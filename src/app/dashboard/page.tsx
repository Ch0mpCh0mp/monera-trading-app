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
        const rawData = (await res.json()) as {
          crypto: any[];
          stocks: StockRaw[];
        };
        console.log('rawData:', rawData); // Crypto für New-Tab (Live-Daten) inkl. Sparkline

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
          image: c.image, // Wenn echte Sparkline nicht existiert, generiere Testwerte (leicht variiert)
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
          }); //  HIER XAU/USD HINZUFÜGEN

        goldAssets.unshift({
          name: 'Gold (XAU/USD)',
          symbol: 'XAUUSD',
          price: 4950.12, // Hier kannst du einen aktuellen Goldpreis einsetzen
          changePct: 0.35, // Beispielwert für die Veränderung
          trend: 0.35 > 0 ? 'up' : 0.35 < 0 ? 'down' : 'neutral',
          image: '/gold.png', // optional, wenn du ein Icon hast, sonst weglassen
        }); // Scalping aus Crypto filtern

        const scalpingAssets = newAssets.filter(
          (c) => c.symbol === 'SOL' || c.symbol === 'ADA'
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
  }, []); // --- ENDE FETCH ---

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
                onClick={() => {
                  if (asset.symbol === 'XAUUSD') {
                    router.push(`/search/${asset.symbol.toLowerCase()}`);
                  }
                }}
              />
            ))}
                      
          </div>
                  
        </div>
              
      </section>
          
    </AppShell>
  );
}
