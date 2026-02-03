'use client';

import type { ReactNode } from 'react';

type BuySellCardProps = {
  sellLabel?: string;
  buyLabel?: string;
  sellPrice: number;
  buyPrice: number;
  assetIcon?: ReactNode;
  assetIconAriaLabel?: string;

  // 🔹 Interaktive Buttons
  onBuy?: () => void;
  onSell?: () => void;
  position?: {
    amount: number;
    entryPrice: number;
    pnl: number;
    currentPrice: number;
  };
  onClosePosition?: () => void;
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
  position,
  onClosePosition,
}: BuySellCardProps) {
  return (
    <section className="mt-4">
      <div className="relative">
        {/* ZWEI HÄLFTEN */}
        <div className="grid grid-cols-2 overflow-hidden">
          {/* LINKS – SELL */}
          <div className="rounded-l-2xl bg-green-600 px-4 py-4 pr-10">
            <button
              onClick={onSell}
              className="text-md font-semibold text-white/90 w-full text-left"
            >
              {sellLabel}
            </button>
            <p className="mt-1 text-lg font-semibold text-white">€{sellPrice.toFixed(2)}</p>
          </div>

          {/* RECHTS – BUY */}
          <div className="rounded-r-2xl bg-green-600 px-4 py-4 pl-10 text-right">
            <button
              onClick={onBuy}
              className="text-md font-semibold text-white/90 w-full text-right"
            >
              {buyLabel}
            </button>
            <p className="mt-1 text-lg font-semibold text-white">€{buyPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* CONNECTOR MIT ICON */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative h-16 w-10 rounded-full bg-black/90 flex items-center justify-center">
            {/* STAB OBEN */}
            <div className="absolute left-1/2 -top-6 h-6 w-[3px] -translate-x-1/2 rounded-full bg-black/90" />
            {/* STAB UNTEN */}
            <div className="absolute left-1/2 -bottom-6 h-6 w-[3px] -translate-x-1/2 rounded-full bg-black/90" />

            {/* ASSET ICON */}
            <div
              className="h-8 w-8 flex items-center justify-center"
              aria-label={assetIconAriaLabel}
            >
              {assetIcon ?? (
                <div className="h-8 w-8 rounded-lg bg-yellow-400 rotate-12" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* POSITION ANZEIGE */}
      {position && (
        <div className="mt-2 bg-white/10 rounded-xl p-3 text-white text-sm">
          <p>Menge: {position.amount}</p>
          <p>Entry: €{position.entryPrice.toFixed(2)}</p>
          <p>
            PnL: <span className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
              {position.pnl >= 0 ? '+' : ''}€{position.pnl.toFixed(2)}
            </span>
          </p>
          <p>Aktuell: €{position.currentPrice.toFixed(2)}</p>
          {onClosePosition && (
            <button
              onClick={onClosePosition}
              className="mt-2 w-full rounded-full bg-red-500/80 hover:bg-red-500 text-white py-1 text-sm"
            >
              Position schließen
            </button>
          )}
        </div>
      )}
    </section>
  );
}
