'use client';

import { useState, ReactNode } from 'react';

type BuySellCardProps = {
  sellLabel?: string;
  buyLabel?: string;
  sellPrice: number;
  buyPrice: number;
  assetIcon?: ReactNode;
  assetIconAriaLabel?: string;
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
      <div className="flex flex-col gap-2 w-full">
        {/* Anzeige Preis */}
        <div className="flex justify-between items-center mb-1">
          <div className="text-center flex-1">
            <p className="text-white/70 text-xs">{sellLabel}</p>
            <p className="text-white font-semibold text-sm">{sellPrice.toFixed(2)} €</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-white/70 text-xs">{buyLabel}</p>
            <p className="text-white font-semibold text-sm">{buyPrice.toFixed(2)} €</p>
          </div>
        </div>

        {/* Input */}
        <input
          type="number"
          value={amount}
          min={0.01}
          step={0.01}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full text-center rounded-md px-2 py-1 mb-2 text-sm"
        />

        {/* Buttons */}
        <div className="flex gap-2 w-full">
          <button
            className="flex-1 py-1 text-sm font-medium bg-[#1e3a8a] hover:bg-[#1b3580] text-white rounded transition-colors"
            onClick={() => onSell?.(amount)}
          >
            {sellLabel}
          </button>
          <button
            className="flex-1 py-1 text-sm font-medium bg-[#1e3a8a] hover:bg-[#1b3580] text-white rounded transition-colors"
            onClick={() => onBuy?.(amount)}
          >
            {buyLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
