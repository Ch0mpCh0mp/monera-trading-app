'use client';

import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronDown,
  AlarmClockPlus,
  Ellipsis,
} from 'lucide-react';

export default function SymbolHeader() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between bg-pink-300">
      {/* LINKS */}
      <button
        type="button"
        onClick={() => router.back()}
        className="bg-blue-300 h-8"
      >
        <ChevronLeft className="bg-green-200" />
      </button>

      {/* MITTE */}
      <div className='flex bg-red-500 rounded-2xl'>
        <p className='bg-green-600 rounded-full'></p>
        <p className='p-1'>XAUUSD</p>
        <button type="button">
          <ChevronDown className="text-sm p-1" />
        </button>
      </div>

      {/* RECHTS */}
      <div className='flex gap-2'>
        <button type="button">
          <AlarmClockPlus />
        </button>
        <button type="button">
          <Ellipsis />
        </button>
      </div>
    </header>
  );
}
