'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function SymbolHeader({ symbol }: { symbol: string }) {
  const router = useRouter();

  return (
    <header>
      <button
        type="button"
        onClick={() => router.back()}
        className="bg-pink-300"
      >
        <ChevronLeft />
      </button>
      {/* <p className="text-white">{symbol}</p> */}
    </header>
  );
}
