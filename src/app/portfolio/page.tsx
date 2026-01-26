'use client';

import React from 'react';
import AppShell from '../components/layout/AppShell';
import {
  Plus,
  Boxes,
  Globe,
  Droplets,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import TopBar from '../components/TopBar';
import { useAccountSummary } from '@/hooks/useAccountSummary';
import { formatCurrency } from '@/lib/formatCurrency';
import { usePortfolio } from '../context/PortfolioContext';
import { useRouter } from 'next/navigation';

function PromoCard({
  title,
  cta,
  icon,
  onClick,
}: {
  title: string;
  cta: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
      <div className="pr-3">
        <p className="text-white text-sm leading-snug">{title}</p>

        <button
          type="button"
          onClick={onClick}
          className="
            mt-3 inline-flex items-center rounded-full bg-[rgba(0,166,62,0.9)] hover:bg-[rgba(0,166,62,1)] text-white text-xs  px-4 py-2"
        >
          {cta}
        </button>
      </div>

      <div className="shrink-0 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white/80">
        {icon}
      </div>
    </div>
  );
}

export default function PortfolioPage() {
const { balance , openPositions } = usePortfolio();
const positions = openPositions(); // aktuelle offene Positionen


  const router = useRouter();


  return (
    <AppShell containerClassName="space-y-6">
      {/* TOPBAR */}
      <TopBar />

      {/* VALUE + PLUS BUTTON */}
     <section>
  <div className="flex items-start justify-between">
    <div>
      <p className="text-white/70 text-lg">Wert</p>
      <p className="text-white text-4xl font-light mt-1">
        {formatCurrency(balance, 'EUR')}
      </p>
    </div>
    <button
      type="button"
      aria-label="Add"
      onClick={() => router.push('/deposit')}
      className="mt-2 w-12 h-12 rounded-full bg-[rgba(0,166,62,1)] hover:bg-[rgba(0,166,62,0.85)] flex items-center justify-center text-white"
    >
      <Plus size={22} />
    </button>
  </div>



        {/* MARGIN LEVEL PILL */}
        <button
          type="button"
          className="mt-5 w-full rounded-full bg-[rgba(0,166,62,0.9)] hover:bg-[rgba(0,166,62,1)] text-white py-3 flex items-center justify-center gap-2 text-sm"
          >
          Margin-Level • 0 %
          <ChevronDown size={16} className="text-white/90" />
        </button>
      </section>

{/* OFFENE POSITIONEN */}
      {positions.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-white/70 text-sm">Offene Positionen</h2>
          {positions.map((pos) => (
            <div
  key={pos.symbol}
  onClick={() => router.push(`/search/GOLD`)}
  className="bg-white/5 border border-white/10 p-3 rounded-xl flex justify-between items-center cursor-pointer hover:bg-white/10 transition"
>

              <div>
                <p className="text-white font-semibold">
                  {pos.symbol} ({pos.type?.toUpperCase()})
                </p>
                <p className="text-white/70 text-sm">
                  Menge: {pos.amount} • Einstieg: {pos.entryPrice?.toFixed(2)}€
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    pos.currentPrice! >= pos.avgPrice ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {pos.currentPrice?.toFixed(2)}€
                </p>
                <p className="text-white/70 text-sm">
                  PnL: {((pos.currentPrice! - pos.avgPrice) * pos.amount).toFixed(2)}€
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* PROMO CARDS */}
      <section className="space-y-4">
        <PromoCard
          title="Handel mit über 9.000 Aktien, long und short Positionen"
          cta="Aktien durchsuchen"
          icon={<Boxes className="text-white/90" size={28} />}
          onClick={() => router.push('/search')}
        />
        <PromoCard
          title="Trade die wichtigsten Indizes der Welt wie den USA 500, USA 30 und UK 100"
          cta="Indizes durchsuchen"
          icon={<Globe className="text-white/90" size={28} />}
          onClick={() => router.push('/search')}
        />
        <PromoCard
          title="Handel mit Rohstoffen wie Edelmetallen, Öl, Holz, Vieh und mehr"
          cta="Durchstöbere Rohstoffe"
          icon={<Droplets className="text-white/90" size={28} />}
          onClick={() => router.push('/search')}
        />
        <PromoCard
          title="Handel mit Forex – über 180 Paare verfügbar 24/5"
          cta="Forex durchsuchen"
          icon={<DollarSign className="text-white/90" size={28} />}
          onClick={() => router.push('/search')}
        />
      </section>
    </AppShell>
  );
}







      