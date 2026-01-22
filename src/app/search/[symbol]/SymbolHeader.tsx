'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function SymbolHeader() {
  const router = useRouter();

  return (
    <header className='flex items-center justify-between bg-pink-300'>
      <button
        type="button"
        onClick={() => router.back()}>
        <ChevronLeft />
      </button>
    </header>
  );
}
