'use client';

import SearchShell from '../components/layout/SearchShell';
import { Search } from 'lucide-react';

export default function SearchPage() {
  return (
    <SearchShell>
      <header className="mb-6">
        <form>
          <div className="flex items-center px-3 h-10 bg-gray-800 rounded-lg">
            <input
              type="search"
              placeholder="searching"
              className="w-full bg-transparent text-white/60 border-0"
            />
          </div>
        </form>
      </header>

      <section
        aria-label="Ticker"
        className="no-scrollbar flex flex-nowrap overflow-x-auto overflow-y-hidden"
      >
        <div className="flex items-center space-x-3 mr-3 h-8 px-6 rounded-lg bg-green-600">
          <p>Silver</p>
          <p>5,44 %</p>
        </div>

        <div className="flex items-center space-x-3 mr-3 h-8 px-6 rounded-lg bg-green-600">
          <p>Gold</p>
          <p>1,06 %</p>
        </div>
      </section>

      <section aria-label="Tabs" className="no-scrollbar flex flex-nowrap mt-6 overflow-x-auto overflow-y-hidden">
        <div className="flex items-center space-x-3 mr-3 h-8 px-6 rounded-lg border border-gray-600">
          <p>ICON</p>
          <p>Meistgehandelt</p>
        </div>

        <div className="flex items-center space-x-3 mr-3 h-8 px-6 rounded-lg border border-gray-600">
          <p>ICON</p>
          <p>Meistgekauft</p>
        </div>
      </section>
    </SearchShell>
  );
}
