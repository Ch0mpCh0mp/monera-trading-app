'use client';

import SearchShell from '../components/layout/SearchShell';
import { Search } from 'lucide-react';

export default function SearchPage() {
  return (
    <SearchShell>
      <header className="mb-6">
        <form>
          <div className="flex items-center px-3 h-10 rounded-xl bg-white/5 border border-white/10">
            <Search size={18} className='text-white/40 mr-2'/>
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
          <p className='text-sm'>Silver</p>
          <p className='whitespace-nowrap text-sm'>5,44 %</p>
        </div>

        <div className="flex items-center space-x-3 mr-3 h-8 px-3 rounded-xl bg-white/5 border border-white/10">
          <p className='text-sm'>Gold</p>
          <p className='whitespace-nowrap text-sm'>1,06 %</p>
        </div>

        <div className="flex items-center space-x-3 mr-3 h-8 px-6 rounded-xl bg-white/5 border border-white/10">
          <p className='text-sm'>Silver</p>
          <p className='whitespace-nowrap text-sm'>5,44 %</p>
        </div>

        <div className="flex items-center space-x-3 mr-3 h-8 px-6 rounded-xl bg-white/5 border border-white/10">
          <p className='text-sm'>Gold</p>
          <p className='whitespace-nowrap text-sm'>1,06 %</p>
        </div>
      </section>

      <section
        aria-label="Tabs"
        className="no-scrollbar flex flex-nowrap mt-6 overflow-x-auto overflow-y-hidden"
      >
        <button
          type="button"
          className="flex items-center space-x-3 mr-3 h-8 px-3 rounded-xl bg-white/25 border border-white/10 outline-none focus-visible:ring-4 focus-visible:ring-white/10"
        >
          <p>Icon</p>
          <p>Meistgehandelt</p>
        </button>

        <button
          type="button"
          className="flex items-center space-x-3 mr-3 h-8 px-3 rounded-xl bg-white/5 border border-white/10"
        >
          <p>Icon</p>
          <p>Meistgekauft</p>
        </button>

        <button
          type="button"
          className="flex items-center space-x-3 mr-3 h-8 px-3 rounded-xl bg-white/25 border border-white/10 outline-none focus-visible:ring-4 focus-visible:ring-white/10"
        >
          <p>Icon</p>
          <p>Meistgehandelt</p>
        </button>

        <button
          type="button"
          className="flex items-center space-x-3 mr-3 h-8 px-3 rounded-xl bg-white/5 border border-white/10"
        >
          <p>Icon</p>
          <p>Meistgekauft</p>
        </button>
      </section>

      <section aria-label="Assets" className="no-scrollbar mt-6 flex gap-4 overflow-x-auto overflow-y-hidden pb-2">
        <div className="shrink-0 w-[130px] flex flex-col items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-2 min-h-[160px]">
          <div>
            <p>Icon</p>
            <p className="text-sm text-white/50">Name</p>
          </div>
          <div className="flex flex-col self-stretch items-end text-right">
            <p className="text-xl">Price</p>
            <p className="text-sm text-green-500">↑ Percent</p>
          </div>
        </div>

        <div className="shrink-0 w-[130px] flex flex-col items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-2 min-h-[160px]">
          <div>
            <p>Icon</p>
            <p className="text-sm text-white/50">Name</p>
          </div>
          <div className="flex flex-col self-stretch items-end text-right">
            <p className="text-xl">Price</p>
            <p className="text-sm text-red-500">↓ Percent</p>
          </div>
        </div>

        <div className="shrink-0 w-[130px] flex flex-col items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-2 min-h-[160px]">
          <div>
            <p>Icon</p>
            <p className="text-sm text-white/50">Name</p>
          </div>
          <div className="flex flex-col self-stretch items-end text-right">
            <p className="text-xl">Price</p>
            <p className="text-sm text-green-500">↑ Percent</p>
          </div>
        </div>

        <div className="shrink-0 w-[130px] flex flex-col items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-2 min-h-[160px]">
          <div>
            <p>Icon</p>
            <p className="text-sm text-white/50">Name</p>
          </div>
          <div className="flex flex-col self-stretch items-end text-right">
            <p className="text-xl">Price</p>
            <p className="text-sm text-red-500">↓ Percent</p>
          </div>
        </div>

        <div className="shrink-0 w-[130px] flex flex-col items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-2 min-h-[160px]">
          <div>
            <p>Icon</p>
            <p className="text-sm text-white/50">Name</p>
          </div>
          <div className="flex flex-col self-stretch items-end text-right">
            <p className="text-xl">Price</p>
            <p className="text-sm text-green-500">↑ Percent</p>
          </div>
        </div>

        <div className="shrink-0 w-[130px] flex flex-col items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-2 min-h-[160px]">
          <div>
            <p>Icon</p>
            <p className="text-sm text-white/50">Name</p>
          </div>
          <div className="flex flex-col self-stretch items-end text-right">
            <p className="text-xl">Price</p>
            <p className="text-sm text-red-500">↓ Percent</p>
          </div>
        </div>

        <div className="shrink-0 w-[130px] flex flex-col items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-2 min-h-[160px]">
          <div>
            <p>Icon</p>
            <p className="text-sm text-white/50">Name</p>
          </div>
          <div className="flex flex-col self-stretch items-end text-right">
            <p className="text-xl">Price</p>
            <p className="text-sm text-green-500">↑ Percent</p>
          </div>
        </div>

        <div className="shrink-0 w-[130px] flex flex-col items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-2 min-h-[160px]">
          <div>
            <p>Icon</p>
            <p className="text-sm text-white/50">Name</p>
          </div>
          <div className="flex flex-col self-stretch items-end text-right">
            <p className="text-xl">Price</p>
            <p className="text-sm text-red-500">↓ Percent</p>
          </div>
        </div>
      </section>
    </SearchShell>
  );
}
