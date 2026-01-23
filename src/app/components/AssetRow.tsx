'use client';

import Image from 'next/image';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useMemo } from 'react';
import { useState } from 'react';

type Trend = 'up' | 'down' | 'neutral';

type AssetRowProps = {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend: Trend;
  image?: string;
  sparklineData?: number[]; // kleine Linie
  onClick?: () => void;
};

export default function AssetRow({
  name,
  symbol,
  price,
  changePct,
  trend,
  image,
  sparklineData,
  onClick,
}: AssetRowProps) {
  const isPositive = changePct > 0;
  const isNegative = changePct < 0;
  const changeColorClass = isPositive
    ? 'text-green-400'
    : isNegative
    ? 'text-red-400'
    : 'text-white/70';

  const [data] = useState<number[]>(() => {
  if (sparklineData && sparklineData.length > 1) return sparklineData;

  // Testwerte einmalig erzeugen ±10% um den Preis
  return Array.from({ length: 10 }, (_, i) => price + (Math.random() - 0.5) * price * 0.1);
});


  const sparklineColor = data[data.length - 1] >= data[0] ? '#34D399' : '#F87171';

  return (
    <div
      className="grid grid-cols-[1fr_80px_96px] items-center gap-3 py-4 min-h-[56px] border-b border-white/5 hover:bg-white/10 cursor-pointer"
      onClick={onClick} // ✅ hier richtig
    >
      {/* ...Rest bleibt gleich */}
    </div>
  );
}
