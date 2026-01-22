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
    <header className="grid grid-cols-[40px_1fr_64px] items-center">
      {/* LINKS */}
      <button
        type="button"
        aria-label='Back'
        onClick={() => router.back()}
        className='p-1 -ml-2 justify-self-start'
        
      >
        <ChevronLeft className='w-8 h-8 text-white/60'/>
      </button>

      {/* MITTE */}
        <button type="button" className='justify-self-center flex items-center gap-2 bg-white/10 rounded-2xl p-1 ml-5'>
          <span className='w-2 h-2 rounded-full bg-green-500 ml-2'/>
          <span className='text-sm font-md'>XAUUSD</span>
          <ChevronDown className="w-3 h-3" />
        </button>

      {/* RECHTS */}
      <div className='justify-self-end flex gap-2'>
        <button type="button" aria-label='Price alerts'>
          <AlarmClockPlus className='w-5 h-5 text-white/60'/>
       </button>
        <button type="button" aria-label='More options'>
          <Ellipsis className='w-5 h-5 text-white/60'/>
        </button>
      </div>
    </header>
  );
}
