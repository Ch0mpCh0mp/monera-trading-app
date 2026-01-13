'use client';

import Link from 'next/link';
import StatusCard from '../components/StatusCard';
import { House, ChartPie, Search, User, Menu } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function DashboardPage() {
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
      <div className="flex justify-between rounded-2xl bg-white/5 border border-white/10 p-4 mx-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/50">CASH</p>
          <p className="text-2xl font-semibold text-white">0,00 €</p>
        </div>

        <Link
          href="/deposit"
          className="mt-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full"
        >
          Deposit
        </Link>
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
        <div className='mt-4 h-48 overflow-y-auto pr-2'>

          {/* EINZELNE REIHEN */}
          <div className="grid grid-cols-[1fr_60px_100px] gap-4">
          <div className="flex items-center gap-2">
            <p>icon</p>
            <p>name</p>
          </div>

          {/* KURS */}
          <div className='flex items-center justify-center'>kurs</div>

          {/* AKTIEN UND PREIS */}
          <div className='text-right'>
            <p>aktien</p>
            <p>preis</p>
          </div>
        </div>

         <div className="grid grid-cols-[1fr_60px_100px] gap-4">
          <div className="flex items-center gap-2">
            <p>icon</p>
            <p>name</p>
          </div>

          {/* KURS */}
          <div className='flex items-center justify-center'>kurs</div>

          {/* AKTIEN UND PREIS */}
          <div className='text-right'>
            <p>aktien</p>
            <p>preis</p>
          </div>
        </div> <div className="grid grid-cols-[1fr_60px_100px] gap-4">
          <div className="flex items-center gap-2">
            <p>icon</p>
            <p>name</p>
          </div>

          {/* KURS */}
          <div className='flex items-center justify-center'>kurs</div>

          {/* AKTIEN UND PREIS */}
          <div className='text-right'>
            <p>aktien</p>
            <p>preis</p>
          </div>
        </div> <div className="grid grid-cols-[1fr_60px_100px] gap-4">
          <div className="flex items-center gap-2">
            <p>icon</p>
            <p>name</p>
          </div>

          {/* KURS */}
          <div className='flex items-center justify-center'>kurs</div>

          {/* AKTIEN UND PREIS */}
          <div className='text-right'>
            <p>aktien</p>
            <p>preis</p>
          </div>
        </div> <div className="grid grid-cols-[1fr_60px_100px] gap-4">
          <div className="flex items-center gap-2">
            <p>icon</p>
            <p>name</p>
          </div>

          {/* KURS */}
          <div className='flex items-center justify-center'>kurs</div>

          {/* AKTIEN UND PREIS */}
          <div className='text-right'>
            <p>aktien</p>
            <p>preis</p>
          </div>
        </div> <div className="grid grid-cols-[1fr_60px_100px] gap-4">
          <div className="flex items-center gap-2">
            <p>icon</p>
            <p>name</p>
          </div>

          {/* KURS */}
          <div className='flex items-center justify-center'>kurs</div>

          {/* AKTIEN UND PREIS */}
          <div className='text-right'>
            <p>aktien</p>
            <p>preis</p>
          </div>
        </div> <div className="grid grid-cols-[1fr_60px_100px] gap-4">
          <div className="flex items-center gap-2">
            <p>icon</p>
            <p>name</p>
          </div>

          {/* KURS */}
          <div className='flex items-center justify-center'>kurs</div>

          {/* AKTIEN UND PREIS */}
          <div className='text-right'>
            <p>aktien</p>
            <p>preis</p>
          </div>
        </div>
        </div>
      </section>

      {/* BOTTOM NAVIGATION */}
      <BottomNav />
    </main>
  );
}
