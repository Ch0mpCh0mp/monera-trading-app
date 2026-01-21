'use client';

import SearchShell from '../components/layout/SearchShell';
import { Search } from 'lucide-react';
import { useState } from 'react';

type Asset = {
  name: string;
  price: string;
  change: string;
  direction: 'up' | 'down';
};

const TABS = ['Most traded', 'Raw materials', 'Top Mover'] as const;
type Tab = (typeof TABS)[number];

const ASSETS_BY_TAB: Record<Tab, Asset[]> = {
  'Most traded': [
    { name: 'Silver', price: '76,7969 $', change: '5,44 %', direction: 'down' },
    { name: 'Gold', price: '4.445,94 $', change: '1,06 %', direction: 'down' },
    {
      name: 'USA Tech',
      price: '25.769,6 $',
      change: '0,24 %',
      direction: 'down',
    },
  ],
  'Raw materials': [
    { name: 'Silver', price: '76,7969 $', change: '5,44 %', direction: 'down' },
    { name: 'Gold', price: '4.445,94 $', change: '1,06 %', direction: 'down' },
    {
      name: 'Natural Gas',
      price: '3,476 $',
      change: '1,49 %',
      direction: 'up',
    },
  ],
  'Top Mover': [
    { name: 'ALMS', price: '—', change: '—', direction: 'up' },
    { name: 'TIL', price: '—', change: '—', direction: 'down' },
  ],
};

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Most traded');
  const assets = ASSETS_BY_TAB[activeTab];

  return (
    <SearchShell>
      <header className="mb-6">
        <form>
          <div className="flex items-center px-3 h-10 rounded-xl bg-white/5 border border-white/10">
            <Search size={18} className="text-white/40 mr-2" />
            <input
              type="search"
              placeholder="Search"
              className="w-full bg-transparent text-white/60 border-0 outline-none"
            />
          </div>
        </form>
      </header>

      <section
        aria-label="Ticker"
        className="no-scrollbar flex flex-nowrap overflow-x-auto overflow-y-hidden"
      >
        <div className="flex items-center space-x-3 mr-3 h-8 px-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm">Silver</p>
          <p className="whitespace-nowrap text-sm">5,44 %</p>
        </div>

        <div className="flex items-center space-x-3 mr-3 h-8 px-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm">Gold</p>
          <p className="whitespace-nowrap text-sm">1,06 %</p>
        </div>

        <div className="flex items-center space-x-3 mr-3 h-8 px-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm">Silver</p>
          <p className="whitespace-nowrap text-sm">5,44 %</p>
        </div>

        <div className="flex items-center space-x-3 mr-3 h-8 px-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm">Gold</p>
          <p className="whitespace-nowrap text-sm">1,06 %</p>
        </div>
      </section>

      <section
        aria-label="Tabs"
        className="no-scrollbar flex flex-nowrap mt-6 overflow-x-auto overflow-y-hidden"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center space-x-3 mr-3 h-8 px-3 rounded-xl border outline-none focus-visible:ring-4 focus-visible:ring-white/10 ${
                isActive
                  ? 'bg-white/25 border-white/10'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <p>Icon</p>
              <p className="whitespace-nowrap">{tab}</p>
            </button>
          );
        })}
      </section>

      <section
        aria-label="Assets"
        className="no-scrollbar mt-6 flex gap-4 overflow-x-auto overflow-y-hidden pb-2"
      >
        {assets.map((a) => (
          <div
            key={a.name}
            className="shrink-0 w-[130px] flex flex-col items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-2 min-h-[160px]"
          >
            <div className="self-start">
              <p className="text-sm text-white/50">Icon</p>
              <p className="font-medium">{a.name}</p>
            </div>

            <div className="flex flex-col self-stretch items-end text-right">
              <p className="text-xl">{a.price}</p>
              <p
                className={`text-sm ${a.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}
              >
                {a.direction === 'up' ? '↑' : '↓'} {a.change}
              </p>
            </div>
          </div>
        ))}
      </section>
    </SearchShell>
  );
}
