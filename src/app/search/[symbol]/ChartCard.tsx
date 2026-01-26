'use client';

import { useMemo, useState, useEffect } from 'react';
import { Settings } from 'lucide-react';


export type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'MAX';

export type ChartPoint = {
  t: string;
  p: number;
};

type ChartCardProps = {
  points?: ChartPoint[];
  currentPrice?: number;
  currencySuffix?: string;
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

// Lokaler State für live Chart-Daten
const [livePoints, setLivePoints] = useState<ChartPoint[]>(points);

// Realtime Simulation (kann später mit API/Websocket ersetzt werden)
useEffect(() => {
  if (!points.length) return;

  const interval = setInterval(() => {
    setLivePoints(prev => {
      const lastPoint = prev[prev.length - 1];
      const newPrice = lastPoint.p + (Math.random() - 0.5) * 5; // +/- 2,5 € zufällig
      const newPoint: ChartPoint = { t: new Date().toISOString(), p: newPrice };
      return [...prev.slice(1), newPoint]; // alter Punkt raus, neuer Punkt rein
    });
  }, 1000); // jede Sekunde

  return () => clearInterval(interval);
}, [points]);



  const hadData = livePoints.length >= 2;

  const derived = useMemo(() => {
    if (!hadData) return null;

    const prices = livePoints.map((pt) => pt.p);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const last = currentPrice ?? prices[prices.length - 1];

    const span = max - min || 1;
    const ratio = (max - last) / span;
    const topPct = Math.max(0.08, Math.min(0.92, ratio));

    const w = 1000;
    const h = 300;
    const pad = 20;

    const norm = livePoints.map((pt, i) => {
      const x = pad + (i * (w - pad * 2)) / (livePoints.length - 1);
      const y = pad + ((max - pt.p) * (h - pad * 2)) / span;
      return { x, y };
    });

    const d = norm.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return { min, max, last, topPct, d, norm };
  }, [livePoints, hadData, currentPrice]);

  const priceLabel =
    typeof (derived?.last ?? currentPrice) === 'number'
      ? `${formatDE(derived?.last ?? (currentPrice as number))}${currencySuffix ? ` ${currencySuffix}` : ''}`
      : '';

  const yLabels = useMemo(() => {
    if (!derived) return [];
    const { min, max } = derived;
    const steps = 6;
    return Array.from({ length: steps }, (_, i) => formatDE(max - (i * (max - min)) / (steps - 1)));
  }, [derived]);

  function handleRangeClick(r: TimeRange) {
    setActiveRange(r);
  }

  return (
    <section className="mt-6">
      <div className="relative">
        {/* Chart area */}
        <div className="relative h-64 w-full overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-white/0" />

          {hadData && derived ? (
            <svg viewBox="0 0 1000 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              {/* Chart line */}
              <path d={derived.d} fill="none" stroke="currentColor" strokeWidth="3" className="text-white/70" />

              {/* Marker für aktuellen Preis */}
              {derived.norm.length > 0 && (
                <circle
                  cx={derived.norm[derived.norm.length - 1].x}
                  cy={derived.norm[derived.norm.length - 1].y}
                  r={6}
                  fill="rgb(34,197,94)" // grün, kann auch rot werden je nach PnL
                  stroke="white"
                  strokeWidth={2}
                />
              )}
            </svg>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-white/40">
              Chart data coming soon…
            </div>
          )}

          {/* horizontale Preislinie */}
          {derived && (
            <div
              className="absolute left-0 right-0 h-[2px]"
              style={{
                top: `${derived.topPct * 100}%`,
              background: currentPrice! > livePoints[0].p
  ? 'linear-gradient(to right, rgba(34,197,94,0.5), rgba(34,197,94,0.1))'
  : 'linear-gradient(to right, rgba(239,68,68,0.5), rgba(239,68,68,0.1))'

              }}
            />
          )}

          {/* Preislabel rechts */}
          {priceLabel && derived && (
            <div className="absolute right-0 -translate-y-1/2" style={{ top: `${derived.topPct * 100}%` }}>
              <div className="rounded-l-md bg-sky-500 px-2 py-1 text-xs font-semibold text-white">{priceLabel}</div>
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

        {/* Time ranges */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {ranges.map((r) => {
            const isActive = r === activeRange;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRangeClick(r)}
                className={`text-xs font-semibold ${
                  isActive ? 'rounded-full bg-white/10 px-3 py-2 text-white' : 'px-2 py-2 text-white/60'
                }`}
              >
                {r}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => console.log('open chart settings')}
            className="ml-1 p-2 text-white/60"
            aria-label="Chart settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
