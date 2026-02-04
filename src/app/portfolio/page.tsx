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
          className="mt-3 inline-flex items-center rounded-full bg-[rgba(0,166,62,0.9)] hover:bg-[rgba(0,166,62,1)] text-white text-xs  px-4 py-2"
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
  // HIER changesumToday eingebaut
  const { accountValue, levelPct, currency, changeSumToday } =
    useAccountSummary();
  const equity = accountValue;
  const balance = accountValue; // vorerst identisch
  const totalPnL = changeSumToday ?? 0;
  // const { balance: accountValue, levelPct, currency } = usePortfolio(); // aus PortfolioContext

  const positions: any[] = [];

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
            {/* 🔹 KRITISCHER FIX: Zeige EQUITY statt BALANCE */}
            <p className="text-white text-4xl font-light mt-1">
              {formatCurrency(equity, 'EUR')}
            </p>
            {/* 🔹 NEU: Zeige Balance & PnL separat */}
            <div className="mt-2 space-y-1">
              <p className="text-white/50 text-sm">
                Cash: {formatCurrency(balance, 'EUR')}
              </p>
              <p
                className={`text-sm font-semibold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}
              >
                PnL: {totalPnL >= 0 ? '+' : ''}
                {formatCurrency(totalPnL, 'EUR')}
              </p>
            </div>
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
          Margin-Level • {levelPct} %
          <ChevronDown size={16} className="text-white/90" />
        </button>
      </section>

      {/* OFFENE POSITIONEN */}
      {positions.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-white/70 text-sm">Offene Positionen</h2>
          {positions.map((pos, index) => (
            <div
              key={`${pos.symbol}-${pos.type}-${pos.entryPrice}-${index}`}
              className="bg-white/5 border border-white/10 p-4 rounded-xl relative group"
            >
              {/* 🔹 SCHLIESSEN-BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Position ${pos.symbol} schließen?`)) {
                    closePosition(pos.symbol);
                  }
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition"
              >
                <X size={16} />
              </button>

              <div
                onClick={() =>
                  router.push(`/search/${pos.symbol}?type=${pos.type}`)
                }
                className="cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold">
                      {pos.symbol} ({pos.type.toUpperCase()})
                    </p>
                    <p className="text-white/70 text-sm mt-1">
                      Menge: {pos.amount} • Entry: €{pos.entryPrice.toFixed(2)}
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      Margin: €{pos.margin.toFixed(2)} • Hebel: {pos.leverage}x
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${pos.currentPrice >= pos.entryPrice ? 'text-green-400' : 'text-red-400'}`}
                    >
                      €{pos.currentPrice.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm font-semibold mt-1 ${(pos.pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {(pos.pnl || 0) >= 0 ? '+' : ''}€
                      {(pos.pnl || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
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
          icon={<Boxes className="text-white/90" size={28} strokeWidth={1.25}/>}
          onClick={() => router.push('/search')}
        />
        <PromoCard
          title="Trade die wichtigsten Indizes der Welt wie den USA 500, USA 30 und UK 100"
          cta="Indizes durchsuchen"
          icon={<Globe className="text-white/90" size={28} strokeWidth={1.25}/>}
          onClick={() => router.push('/search')}
        />
        <PromoCard
          title="Handel mit Rohstoffen wie Edelmetallen, Öl, Holz, Vieh und mehr"
          cta="Durchstöbere Rohstoffe"
          icon={<Droplets className="text-white/90" size={28} strokeWidth={1.25}/>}
          onClick={() => router.push('/search')}
        />
        <PromoCard
          title="Handel mit Forex – über 180 Paare verfügbar 24/5"
          cta="Forex durchsuchen"
          icon={<DollarSign className="text-white/90" size={28} strokeWidth={1.25}/>}
          onClick={() => router.push('/search')}
        />
      </section>
    </AppShell>
  );
}
