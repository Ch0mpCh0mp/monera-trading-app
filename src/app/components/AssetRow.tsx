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

      {/* ANZEIGENZEILE DER JEWEILIGEN ASSETS */}
      <div className="min-w-0">
        {/* FIRMEN LOGO */}
        <p className="text-white text-sm font-medium leading-tight">{symbol}</p>
        {/* FIRMEN NAME */}
        <p className="text-white/50 text-[11px] truncate">{name}</p>
      </div>

      {/* SPARKLINE */}
      <div
        role="img"
        aria-label={`Price trend ${derivedTrend}`}
        className={`justify-self-center h-4 w-10 rounded-sm ${isUp ? 'bg-green-400/60' : isDown ? 'bg-red-400/60' : 'bg-white/15'}`}
      ></div>

      <div className="text-right">
        {/* AKTUELLER PREIS */}
        <p className="text-white text-sm font-medium tabular-nums">{price.toFixed(2)}</p>
        {/* VERÄNDERUNGSPROZENT */}
        <p className={`text-[11px] tabular-nums ${changeColorClass}`}>{isPositive ? '+' : ''}{Number.isFinite(changePct) ? changePct.toFixed(2) : '0.00'}%</p>
      </div>
    </div>
  );
}
