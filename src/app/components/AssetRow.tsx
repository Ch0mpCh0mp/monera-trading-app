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
    <section>
         {/* EINZELNE ZEILE */}
          <div className="grid grid-cols-[1fr_60px_100px] gap-4">
          <div className="flex items-center gap-2">
            <p>{symbol}</p>
            <p>{name}</p>
          </div>

          {/* KURS */}
          <div className='flex items-center justify-center'>{trend}</div>

          {/* AKTIEN UND PREIS */}
          <div className='text-right'>
            <p>{price}</p>
            <p>{changePct}</p>
          </div>
        </div>
    </section>
  );
}
