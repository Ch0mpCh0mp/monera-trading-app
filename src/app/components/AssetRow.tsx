'use client';

type AssetRowProps = {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend: 'up' | 'down' | 'neutral';
};

export default function AssetRow({ name, symbol, price, changePct, trend }: AssetRowProps) {
  return (
    <div className="py-3 border-b border-white/10">
         {/* EINZELNE ZEILE */}
          <div className="grid grid-cols-[1fr_48px_96px] items-center gap-3">

            {/* SYMBOL UND NAME */}
          <div className="min-w-0">
            <p className="text-white text-sm font-medium">{symbol}</p>
            <p className="text-white/50 text-xs truncate">{name}</p>
          </div>

          {/* KURS TREND */}
          <div className='text-center text-xs text-white/50'>{trend}</div>

          {/* AKTIEN UND PREIS */}
          <div className='text-right'>
            <p className="text-white text-sm font-medium">{price.toFixed(2)}</p>
            <p className="text-white/50 text-xs">{changePct > 0 ? '+' : ''}{changePct.toFixed(2)}%</p>
          </div>
        </div>
    </div>
  );
}
