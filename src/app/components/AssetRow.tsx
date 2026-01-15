'use client';

type Trend = 'up' | 'down' | 'neutral';

type AssetRowProps = {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend?: Trend;
};

export default function AssetRow({ name, symbol, price, changePct, trend, }: AssetRowProps) {
  const derivedTrend: Trend = trend ?? (changePct > 0 ? 'up' : changePct < 0 ? 'down' : 'neutral');
  const isPositive = changePct > 0;
  const isNegative = changePct < 0;
  const changeColorClass = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-white/70';

  const isUp = derivedTrend === 'up';
  const isDown = derivedTrend === 'down';

  return (
    <div className="grid grid-cols-[1fr_48px_96px] items-center gap-3 py-4 min-h-[56px] border-b border-white/5">

      {/* SYMBOL UND NAME */}
      <div className="min-w-0">
        <p className="text-white text-sm font-medium leading-tight">{symbol}</p>
        <p className="text-white/50 text-[11px] truncate">{name}</p>
      </div>

      {/* SPARKLINE */}
      <div
        role="img"
        aria-label={`Price trend ${derivedTrend}`}
        className={`justify-self-center h-4 w-10 rounded-sm ${isUp ? 'bg-green-400/60' : isDown ? 'bg-red-400/60' : 'bg-white/15'}`}
      ></div>

      {/* PREIS UND PROZENT */}
      <div className="text-right">
        <p className="text-white text-sm font-medium tabular-nums">{price.toFixed(2)}</p>
        <p className={`text-[11px] tabular-nums ${changeColorClass}`}>{isPositive ? '+' : ''}{changePct.toFixed(2)}%</p>
      </div>
    </div>
  );
}
