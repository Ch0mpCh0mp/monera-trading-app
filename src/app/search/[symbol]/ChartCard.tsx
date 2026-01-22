'use client';

import { useMemo, useState } from 'react';
import { Settings } from 'lucide-react';

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'MAX';

export type ChartPoint = {
  t: string;
  p: number;
};

type ChartCardProps = {
  // DATA
  points?: ChartPoint[];
  currentPrice?: number;
  currencySuffix?: string;

  // UI
  defaultRange?: TimeRange;
};

function formatDE(n: number) {
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ChartCard({
  points = [],
  currentPrice,
  currencySuffix = '',
  defaultRange = '1M',
}: ChartCardProps) {
  const ranges: TimeRange[] = ['1D', '1W', '1M', '3M', '1Y', 'MAX'];
  const [activeRange, setActiveRange] = useState<TimeRange>(defaultRange);

  const hadData = points.length >= 2;

  const derived = useMemo(() => {
    if (!hadData) return null;

    const prices = points.map((pt) => pt.p);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const last = currentPrice ?? prices[prices.length - 1];

    const span = max - min || 1;
    const ratio = (max - last) / span; // 0 = at top, 1 = at bottom
    const topPct = Math.max(0.08, Math.min(0.92, ratio)); // keep inside view a bit

    const w = 1000;
    const h = 300;
    const pad = 20;

    const norm = points.map((pt, i) => {
      const x = pad + (i * (w - pad * 2)) / (points.length - 1);
      const y = pad + ((max - pt.p) * (h - pad * 2)) / span;
      return { x, y };
    });

    const d = norm
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    return { min, max, last, topPct, d };
  }, [points, hadData, currentPrice]);

  const priceLabel =
    typeof (derived?.last ?? currentPrice) === 'number'
      ? `${formatDE(derived?.last ?? (currentPrice as number))}${currencySuffix ? ` ${currencySuffix}` : ''}`
      : '';

  const yLabels = useMemo(() => {
    if (!derived) return [];
    const { min, max } = derived;
    // 6 labels like in screenshot
    const steps = 6;
    const arr = Array.from({ length: steps }, (_, i) => {
      const v = max - (i * (max - min)) / (steps - 1);
      return formatDE(v);
    });
    return arr;
  }, [derived]);

  function handleRangeClick(r: TimeRange) {
    setActiveRange(r);
    console.log("range:", r);
  }

  return (
    <section className="mt-6">
      <div className="relative">
        {/* Chart area */}
        <div className="relative h-64 w-full overflow-hidden rounded-2xl">
          {/* background hint */}
          <div className="absolute inset-0 bg-white/0" />

          {/* SVG chart */}
          {hadData && derived ? (
            <svg
              viewBox="0 0 1000 300"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d={derived.d}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/70"
              />
            </svg>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white/40">
              Chart data coming soon…
            </div>
          )}

          {/* horizontal price line */}
          {derived && (
            <div
              className="absolute left-0 right-0 h-[2px] bg-sky-500/70"
              style={{ top: `${derived.topPct * 100}%` }}
            />
          )}

          {/* price label on right */}
          {priceLabel && derived && (
            <div
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${derived.topPct * 100}%` }}
            >
              <div className="rounded-l-md bg-sky-500 px-2 py-1 text-xs font-semibold text-white">
                {priceLabel}
              </div>
            </div>
          )}

          {/* y-axis labels */}
          {yLabels.length > 0 && (
            <div className="absolute right-2 top-3 flex flex-col justify-between gap-0 h-[calc(100%-24px)] text-[10px] text-white/40">
              {yLabels.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          )}
        </div>

        {/* time ranges */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {ranges.map((r) => {
            const isActive = r === activeRange;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRangeClick(r)}
                className={`text-xs font-semibold ${
                  isActive
                    ? 'rounded-full bg-white/10 px-3 py-2 text-white'
                    : 'px-2 py-2 text-white/60'
                }`}
              >
                {r}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => console.log("open chart settings")}
            className="ml-1 p-2 text-white/60"
            aria-label="Chart settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
    // <section className="mt-6">
    //   <div className="relative rounded-2xl bg-black/20">
    //     {/* Chart area */}
    //     <div className="relative h-64 w-full overflow-hidden rounded-2xl">
    //       {/* fake chart placeholder */}
    //       <div className="absolute inset-0 opacity-40">
    //         <div className="h-full w-full bg-gradient-to-b from-white/5 to-transparent" />
    //       </div>

    //       {/* horizontal price line */}
    //       <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-sky-500/70" />

    //       {/* price label on the right */}
    //       <div className="absolute right-0 top-1/2 -translate-y-1/2">
    //         <div className="rounded-l-md bg-sky-500 px-2 py-1 text-xs font-semibold text-white">
    //           {currentPriceLabel}
    //         </div>
    //       </div>

    //       {/* y-axis labels (placeholder) */}
    //       <div className="absolute right-2 top-3 flex flex-col gap-5 text-[10px] text-white/40">
    //         <span>4.550,00</span>
    //         <span>4.500,00</span>
    //         <span>4.450,00</span>
    //         <span>4.400,00</span>
    //         <span>4.350,00</span>
    //         <span>4.300,00</span>
    //       </div>
    //     </div>

    //     {/* time ranges */}
    //     <div className="mt-3 flex items-center justify-center gap-3">
    //       {ranges.map((r) => {
    //         const isActive = r === activeRange;
    //         return (
    //           <button
    //             key={r}
    //             type="button"
    //             className={`text-xs font-semibold ${
    //               isActive
    //                 ? 'rounded-full bg-white/10 px-3 py-2 text-white'
    //                 : 'px-2 py-2 text-white/60'
    //             }`}
    //           >
    //             {r}
    //           </button>
    //         );
    //       })}

    //       <button
    //         type="button"
    //         className="ml-1 p-2 text-white/60"
    //         aria-label="Chart settings"
    //       >
    //         <Settings className="h-4 w-4" />
    //       </button>
    //     </div>
    //   </div>
    // </section>
  );
}
