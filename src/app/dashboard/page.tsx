'use client';

import Link from 'next/link';
import StatusCard from '../components/StatusCard';
import { House, ChartPie, Search, User, Menu } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import AssetRow from '../components/AssetRow';

export default function DashboardPage() {
  const assets: Array<{
    name: string;
    symbol: string;
    price: number;
    changePct: number;
    trend: 'up' | 'down' | 'neutral';
  }> = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 4321.0,
      changePct: 2.5,
      trend: 'up',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 2345.0,
      changePct: -1.2,
      trend: 'down',
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      price: 98.76,
      changePct: 5.3,
      trend: 'up',
    },
    {
      name: 'Cardano',
      symbol: 'ADA',
      price: 1.23,
      changePct: 0.0,
      trend: 'neutral',
    },
    {
      name: 'Ripple',
      symbol: 'XRP',
      price: 0.89,
      changePct: -0.5,
      trend: 'down',
    },
    {
      name: 'Polkadot',
      symbol: 'DOT',
      price: 25.67,
      changePct: 3.1,
      trend: 'up',
    },
    {
      name: 'Dogecoin',
      symbol: 'DOGE',
      price: 0.25,
      changePct: -2.3,
      trend: 'down',
    },
    {
      name: 'Litecoin',
      symbol: 'LTC',
      price: 150.45,
      changePct: 1.8,
      trend: 'up',
    },
  ];

  return (
    <main className="min-h-screen bg-black pt-8 pb-24">
      {/* KONTO WERT */}
      <section className="mb-8 px-6">
        <p className="text-xs uppercase tracking-wider text-white/50 mb-2">
          Account Value
        </p>
        <p className="text-4xl font-semibold text-white">10.000,00 €</p>
        <p className="text-sm text-white/70 underline">+0.00 € (0.00%) Today</p>
      </section>

      {/* STATUS KARTEN */}
      <div className="grid grid-cols-2 gap-4 mb-8 px-6">
        <StatusCard label="Margin" value="0,00 €" />
        <StatusCard label="Level" value="100%" />
      </div>

      {/* CASH UND DEPOSIT BUTTON */}
      <div className="mb-8 px-6">
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
      </div>

      {/* GROSSER AKTIENBLOCK */}
      <section className="border border-white/10 text-white/50 bg-white/5 rounded-2xl mt-8 p-4 gap-2">
        {/* TABS */}
        <header className="flex items-center justify-between">
          <button>New</button>
          <button>Gold</button>
          <button>Scalping</button>
          <button>Plus</button>
          <button>Write</button>
        </header>

        {/* LISTE (scrollbar) */}
        <div className="mt-4 h-48 overflow-y-auto pr-2">
          {assets.map((asset) => (
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
      </section>

      {/* BOTTOM NAVIGATION */}
      <BottomNav />
    </main>
  );
}
