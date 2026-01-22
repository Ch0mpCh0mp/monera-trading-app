import type { ReactNode } from 'react';

type BuySellCardProps = {
  sellLabel?: string;
  buyLabel?: string;
  sellPrice: string;
  buyPrice: string;
  assetIcon?: ReactNode;
  assetIconAriaLabel?: string;
};

export default function BuySellCard({
  sellLabel = 'Sell',
  buyLabel = 'Buy',
  sellPrice,
  buyPrice,
  assetIcon,
  assetIconAriaLabel = 'Asset icon',
}: BuySellCardProps) {
  return (
    <section className="mt-4">
      <div className="relative">
        {/* ZWEI HÄLFTEN */}
        <div className="grid grid-cols-2 overflow-hidden">
          {/* LINKS */}
          <div className="rounded-l-2xl bg-sky-500 px-4 py-4 pr-10">
            <p className="text-md font-semibold text-white/90">{sellLabel}</p>
            <p className="mt-1 text-lg font-semibold text-white">{sellPrice}</p>
          </div>

          {/* RECHTS */}
          <div className="rounded-r-2xl bg-sky-500 px-4 py-4 pl-10 text-right">
            <p className="text-md font-semibold text-white/90">{buyLabel}</p>
            <p className="mt-1 text-lg font-semibold text-white">{buyPrice}</p>
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

        {/* <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative h-16 w-10 rounded-full bg-black/90 flex items-center justify-center">
            
            <div className="absolute left-1/2 -top-6 h-6 w-[3px] -translate-x-1/2 rounded-full bg-black/90" />

            
            <div className="absolute left-1/2 -bottom-6 h-6 w-[3px] -translate-x-1/2 rounded-full bg-black/90" />

            
            <div
              className="h-8 w-8 flex items-center justify-center"
              aria-label={assetIconAriaLabel}
            >
              {assetIcon ?? (
                <div className="h-8 w-8 rounded-lg bg-yellow-400 rotate-12" />
              )}
            </div>
          </div>
        </div> */}
      </div>

      <p className="">pfeilsymbol preis (prozente) in the last month</p>
    </section>
  );
}
