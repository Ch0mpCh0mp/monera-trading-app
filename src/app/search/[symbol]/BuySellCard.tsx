import { useState } from 'react';
import type { ReactNode } from 'react';


type BuySellCardProps = {
  sellLabel?: string;
  buyLabel?: string;
  sellPrice: number; // Ändere von string zu number für numerische Berechnungen
  buyPrice: number; // Ändere von string zu number für numerische Berechnungen
  assetIcon?: ReactNode;
  assetIconAriaLabel?: string;

  onBuy?: (amount: number) => void;
  onSell?: (amount: number) => void;

  position?: PositionPreview;
  onClosePosition?: () => void;
};

type PositionPreview = {
  amount: number;
  entryPrice: number;
  pnl: number;
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
  const [amount, setAmount] = useState<number>(1);

  // Fallback für undefined Preise (Schutz vor Fehlern)
  const safeSellPrice = sellPrice ?? 0;
  const safeBuyPrice = buyPrice ?? 0;

  return (
    <section className="mt-4">
      <div className="relative">
        {/* ZWEI HÄLFTEN */}
        <div className="grid grid-cols-2 overflow-hidden">
          {/* LINKS – SELL */}
          <div className="rounded-l-2xl bg-green-600 px-4 py-4 pr-10">
            <p className="text-md font-semibold text-white/90">{sellLabel}</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {safeSellPrice.toFixed(2)}
            </p>
          </div>

          {/* RECHTS – BUY */}
          <div className="rounded-r-2xl bg-green-600 px-4 py-4 pl-10 text-right">
            <p className="text-md font-semibold text-white/90">{buyLabel}</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {safeBuyPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* CONNECTOR MIT ICON */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative h-16 w-10 rounded-full bg-black/90 flex items-center justify-center">
            <div className="absolute left-1/2 -top-6 h-6 w-[3px] -translate-x-1/2 bg-black/90" />
            <div className="absolute left-1/2 -bottom-6 h-6 w-[3px] -translate-x-1/2 bg-black/90" />

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

        {/* TRADE BUTTONS */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onSell?.(amount)}
            className="flex-1 py-1 text-sm font-medium bg-green-700 hover:bg-green-800 text-white rounded transition"
          >
            {sellLabel}
          </button>
          <button
            onClick={() => onBuy?.(amount)}
            className="flex-1 py-1 text-sm font-medium bg-green-700 hover:bg-green-800 text-white rounded transition"
          >
            {buyLabel}
          </button>
        </div>

        {/* POSITION PREVIEW */}
        {position && (
          <div className="relative mt-3 p-2 rounded-md bg-white/5 text-xs text-white">
            <button
              onClick={onClosePosition}
              className="absolute top-1 right-1 text-white/70 hover:text-white"
            >
              ×
            </button>

            <p>Position: {position.amount}</p>
            <p>Einstieg: {position.entryPrice.toFixed(2)}</p>
            <p className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
              PnL: {position.pnl.toFixed(2)}
            </p>
          </div>
        )}
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
