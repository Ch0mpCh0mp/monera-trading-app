'use client';

type Trend = 'up' | 'down' | 'neutral';

type AssetRowProps = {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend?: Trend;
  image?: string; // optionales Logo
};

export default function AssetRow({ name, symbol, price, changePct, trend, image }: AssetRowProps) {
  const derivedTrend: Trend = trend ?? (changePct > 0 ? 'up' : changePct < 0 ? 'down' : 'neutral');
  const isPositive = changePct > 0;
  const isNegative = changePct < 0;
  const changeColorClass = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-white/70';

  const isUp = derivedTrend === 'up';
  const isDown = derivedTrend === 'down';

  return (
    <div className="grid grid-cols-[48px_1fr_96px] items-center gap-3 py-4 min-h-[56px] border-b border-white/5">

      {/* LOGO */}
      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
        {image ? <img src={image} alt={name} className="w-8 h-8 object-contain" /> : <span className="text-white/50">{symbol[0]}</span>}
      </div>

      {/* NAME UND SYMBOL */}
      <div className="min-w-0">
        <p className="text-white text-sm font-medium leading-tight">{symbol}</p>
        <p className="text-white/50 text-[11px] truncate">{name}</p>
      </div>

      {/* PREIS UND SPARKLINE */}
      <div className="text-right">
        <p className="text-white text-sm font-medium tabular-nums">{(price ?? 0).toFixed(2)}</p>
        <p className={`text-[11px] tabular-nums ${changeColorClass}`}>{isPositive ? '+' : ''}{Number.isFinite(changePct) ? changePct.toFixed(2) : '0.00'}%</p>
        <div
          role="img"
          aria-label={`Price trend ${derivedTrend}`}
          className={`mt-1 h-2 w-10 rounded-sm ${isUp ? 'bg-green-400/60' : isDown ? 'bg-red-400/60' : 'bg-white/15'}`}
        ></div>
      </div>
    </div>
  );
}
