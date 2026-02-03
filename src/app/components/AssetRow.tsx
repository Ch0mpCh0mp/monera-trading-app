'use client';

import Image from 'next/image';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Trend = 'up' | 'down' | 'neutral';

type AssetRowProps = {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend: Trend;
  image?: string;
  sparklineData?: number[];
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
  const router = useRouter();

  const isPositive = changePct > 0;
  const isNegative = changePct < 0;
  const changeColorClass = isPositive
    ? 'text-green-400'
    : isNegative
    ? 'text-red-400'
    : 'text-white/70';

  // Wenn sparklineData leer ist, generiere Testwerte ±5% um Preis
  const data =
    sparklineData && sparklineData.length > 1
      ? sparklineData
<<<<<<< HEAD
      : Array.from(
          { length: 10 },
          (_, i) => price + (Math.random() - 0.5) * price * 0.1
        );

  // Farbe grün oder rot je nach Trend
  const sparklineColor =
    trend === 'up' ? '#34D399' : trend === 'down' ? '#F87171' : '#9CA3AF';

  // const sparklineColor =
  //   data[data.length - 1] >= data[0] ? '#34D399' : '#F87171';
  // --- Nur die Funktion hier ---
  const handleClick = () => {
    if (onClick) onClick(); // optionaler Callback
    router.push(`/search/${symbol.toLowerCase()}`);
  };
=======
      : Array.from({ length: 10 }, (_, i) =>
          price + (Math.random() - 0.5) * price * 0.1
        );

  // Farbe grün oder rot je nach Trend
  const sparklineColor = data[data.length - 1] >= data[0] ? '#34D399' : '#F87171';
>>>>>>> parent of ca1cdce (Merge pull request #12 from Ch0mpCh0mp/plus-dashboard)

  return (
    <div
      className="grid grid-cols-[1fr_80px_96px] items-center gap-3 py-4 min-h-[56px] border-b border-white/5 hover:bg-white/10 cursor-pointer"
      onClick={handleClick} // Layout unverändert, nur Klick hinzugefügt
    >
      {/* Name + Symbol */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10">
          {image ? (
            <Image
              src={image}
              alt={symbol}
              width={32}
              height={32}
              className="object-contain w-auto h-auto"
            />
          ) : (
            <span className="text-white/50">{symbol}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{symbol}</p>
          <p className="text-white/50 text-[11px] truncate">{name}</p>
        </div>
      </div>

      {/* Sparkline */}
      <div className="justify-self-center w-20 h-8">
        <Sparklines data={data} width={80} height={32} margin={0}>
          <SparklinesLine
            color={sparklineColor}
            style={{ strokeWidth: 2, fill: 'none' }}
          />
        </Sparklines>
      </div>

      {/* Preis + Veränderung */}
      <div className="text-right">
        <p className="text-white text-sm font-medium tabular-nums">{price.toFixed(2)}</p>
        <p className={`text-[11px] tabular-nums ${changeColorClass}`}>
          {isPositive ? '+' : ''}
          {Number.isFinite(changePct) ? changePct.toFixed(2) : '0.00'}%
        </p>
      </div>
    </div>
  );
}
