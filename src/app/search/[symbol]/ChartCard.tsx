import { Settings } from 'lucide-react';

type ChartCardProps = {
  currentPriceLabel?: string;
  activeRange?: '1D' | '1W' | '1M' | '3M' | '1Y' | 'MAX';
};

export default function ChartCard({
  currentPriceLabel = '4.442,64',
  activeRange = '1M',
}: ChartCardProps) {
  const ranges: ChartCardProps['activeRange'][] = [
    '1D',
    '1W',
    '1M',
    '3M',
    '1Y',
    'MAX',
  ];

  return (
    <section className="mt-6">
      <div className="relative rounded-2xl bg-black/20">
        {/* Chart area */}
        <div className="relative h-64 w-full overflow-hidden rounded-2xl">
          {/* fake chart placeholder */}
          <div className="absolute inset-0 opacity-40">
            <div className="h-full w-full bg-gradient-to-b from-white/5 to-transparent" />
          </div>

          {/* horizontal price line */}
          <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-sky-500/70" />

          {/* price label on the right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <div className="rounded-l-md bg-sky-500 px-2 py-1 text-xs font-semibold text-white">
              {currentPriceLabel}
            </div>
          </div>

          {/* y-axis labels (placeholder) */}
          <div className="absolute right-2 top-3 flex flex-col gap-5 text-[10px] text-white/40">
            <span>4.550,00</span>
            <span>4.500,00</span>
            <span>4.450,00</span>
            <span>4.400,00</span>
            <span>4.350,00</span>
            <span>4.300,00</span>
          </div>
        </div>

        {/* time ranges */}
        <div className="mt-3 flex items-center justify-center gap-3">
          {ranges.map((r) => {
            const isActive = r === activeRange;
            return (
              <button
                key={r}
                type="button"
                className={`text-xs font-semibold ${
                  isActive
                    ? 'rounded-full bg-white/10 px-3 py-2 text-white'
                    : 'px-2 py-2 text-white/60'
                }`}
              >
                {r}
              </button>
            );
          })}

          <button
            type="button"
            className="ml-1 p-2 text-white/60"
            aria-label="Chart settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
