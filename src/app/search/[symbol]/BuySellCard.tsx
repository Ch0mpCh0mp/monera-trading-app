'use client';

import {useState, ReactNode } from 'react';

type BuySellCardProps = {
  sellLabel?: string;
  buyLabel?: string;
  sellPrice: number;
  buyPrice: number;
  assetIcon?: ReactNode;
  assetIconAriaLabel?: string;


//Callbacks
onBuy?: (amount: number) => void;
onSell?: (amount: number) => void;

};


export default function BuySellCard({
  sellLabel = 'Sell',
  buyLabel = 'Buy',
  sellPrice,
  buyPrice,
  assetIcon,
  assetIconAriaLabel = 'Asset icon',
  onBuy,
  onSell,
}: BuySellCardProps) {
  const [amount, setAmount] = useState<number>(1);


  return (
    <section className="mt-4">
      <div className="relative">
        {/* ZWEI HÄLFTEN */}
        <div className="grid grid-cols-2 overflow-hidden">
          {/* SELL */}
          <div className="rounded-l-2xl bg-red-600 px-4 py-4 pr-10 flex flex-col gap-2">
            <p className="text-md font-semibold text-white/90">{sellLabel}</p>
            <p className="text-lg font-semibold text-white">{sellPrice.toFixed(2)} €</p>
            <input
              type="number"
              value={amount}
              min={0.01}
              step={0.01}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-md px-2 py-1 text-black"
            />
            <button
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2"
              onClick={() => onSell?.(amount)}
            >
              {sellLabel}
            </button>
          </div>

          {/* BUY */}
          <div className="rounded-r-2xl bg-green-600 px-4 py-4 pl-10 text-right flex flex-col gap-2">
            <p className="text-md font-semibold text-white/90">{buyLabel}</p>
            <p className="text-lg font-semibold text-white">{buyPrice.toFixed(2)} €</p>
            <input
              type="number"
              value={amount}
              min={0.01}
              step={0.01}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-md px-2 py-1 text-black text-right"
            />
            <button
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2"
              onClick={() => onBuy?.(amount)}
            >
              {buyLabel}
            </button>
          </div>
        </div>

        {/* CONNECTOR MIT ICON */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative h-16 w-10 rounded-full bg-black/90 flex items-center justify-center">
            <div className="absolute left-1/2 -top-6 h-6 w-[3px] -translate-x-1/2 rounded-full bg-black/90" />
            <div className="absolute left-1/2 -bottom-6 h-6 w-[3px] -translate-x-1/2 rounded-full bg-black/90" />
            <div
              className="h-8 w-8 flex items-center justify-center"
              aria-label={assetIconAriaLabel}
            >
              {assetIcon ?? <div className="h-8 w-8 rounded-lg bg-yellow-400 rotate-12" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}