'use client';

import SearchShell from '../components/layout/SearchShell';
import { Search, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef, ReactNode } from 'react';

// TYPES
type TickerItem = {
  icon: string;
  label: string;
  change: string;
};

type Asset = {
  icon: string;
  name: string;
  price: string;
  change: string;
  direction: 'up' | 'down';
};

// KONSTANTEN
const ICONS: Record<string, string> = {
  gold: '🟨',
  silver: '⬜',
  apple: '',
};

const TICKER_ITEMS: TickerItem[] = [
  { icon: 'gold', label: 'Gold', change: '1,06 %' },
  { icon: 'silver', label: 'Silver', change: '5,44 %' },
  { icon: 'apple', label: 'AAPL', change: '−0,82 %' },
];

const TABS = ['Most traded', 'Raw materials', 'Top Mover'] as const;
type Tab = (typeof TABS)[number];

const ASSETS_BY_TAB: Record<Tab, Asset[]> = {
  'Most traded': [
    {
      icon: 'silver',
      name: 'Silver',
      price: '76,7969 $',
      change: '5,44 %',
      direction: 'down',
    },
    {
      icon: 'gold',
      name: 'Gold',
      price: '4.445,94 $',
      change: '1,06 %',
      direction: 'down',
    },
    {
      icon: 'apple',
      name: 'USA Tech',
      price: '25.769,6 $',
      change: '0,24 %',
      direction: 'down',
    },
  ],
  'Raw materials': [
    {
      icon: 'silver',
      name: 'Silver',
      price: '76,7969 $',
      change: '5,44 %',
      direction: 'down',
    },
    {
      icon: 'gold',
      name: 'Gold',
      price: '4.445,94 $',
      change: '1,06 %',
      direction: 'down',
    },
    {
      icon: 'apple',
      name: 'Natural Gas',
      price: '3,476 $',
      change: '1,49 %',
      direction: 'up',
    },
  ],
  'Top Mover': [
    { icon: 'apple', name: 'ALMS', price: '—', change: '—', direction: 'up' },
    { icon: 'apple', name: 'TIL', price: '—', change: '—', direction: 'down' },
  ],
};

// HILFSFUNKTION
function ScrollRow({
  ariaLabel,
  className = '',
  children,
}: {
  ariaLabel: string;
  className?: string;
  children: ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [showChevron, setShowChevron] = useState(false);

  const updateChevron = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const canScroll = el.scrollWidth > el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    // ZEIG PFEIL NUR WENN ES WAS ZU SCROLLEN GIBT
    setShowChevron(canScroll && !atEnd);
  };

  useEffect(() => {
    updateChevron();

    const el = scrollerRef.current;
    if (!el) return;

    // REAGIERE AUFS SCROLLEN
    el.addEventListener('scroll', updateChevron, { passive: true });

    // REAGIERE WENN BREITE SICH VERÄNDERT
    window.addEventListener('resize', updateChevron);

    return () => {
      el.removeEventListener('scroll', updateChevron);
      window.removeEventListener('resize', updateChevron);
    };
  }, []);

  return (
    <section aria-label={ariaLabel} className={`relative w-full ${className}`}>
      {/* SEITLICHER SCROLL BEREICH */}
      <div
        ref={scrollerRef}
        className="no-scrollbar flex flex-nowrap gap-3 overflow-x-auto overflow-y-hidden pr-12"
      >
        {children}
      </div>

      {/* PFEIL NUR WENN GEBRAUCHT WIRD */}
      {showChevron && (
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-black/90 via-black/40 to-transparent flex items-center justify-end pr-1.5">
          <div className="h-7 w-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
            <ChevronRight className="h-4 w-4 text-white/80" />
          </div>
        </div>
      )}
    </section>
  );
}

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Most traded');
  const assets = ASSETS_BY_TAB[activeTab];

  return (
    <SearchShell>
      {/* SUCHLEISTE OBEN */}
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

      {/* TICKER BEREICH */}
      <ScrollRow ariaLabel="Ticker">
        {TICKER_ITEMS.map((item) => (
          <div
            key={item.label}
            className="shrink-0 w-[130px] sm:w-[140px] md:w-[150px] h-10 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2"
          >
            <span className="text-base leading-none">{ICONS[item.icon]}</span>
            <span className="text-sm truncate">{item.label}</span>
            <span className="ml-auto whitespace-nowrap text-sm text-white/60">
              {item.change}
            </span>
          </div>
        ))}
      </ScrollRow>

      {/* TABS BEREICH */}
      <ScrollRow ariaLabel="Tabs" className="mt-6">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 flex items-center space-x-3 h-10 px-3 rounded-xl border outline-none focus-visible:ring-4 focus-visible:ring-white/10 w-[130px] sm:w-[140px] md:w-[150px] ${
                isActive
                  ? 'bg-white/25 border-white/10'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <span className="text-base leading-none">
                {ICONS[tab === 'Raw materials' ? 'gold' : 'silver']}
              </span>
              <p className="text-[12px] leading-tight text-white/80">{tab}</p>
            </button>
          );
        })}
      </ScrollRow>

      {/* ASSET BEREICH */}
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
              <p className="text-sm text-white/50">{ICONS[a.icon]}</p>
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
