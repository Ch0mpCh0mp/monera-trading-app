import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

type PerformanceRowProps = {
  value: number;
  percent: number;
  periodLabel?: string;
};

export default function PerformanceRow({
  value,
  percent,
  periodLabel = 'in the last month',
}: PerformanceRowProps) {
  const isPositive = value >= 0;

  return (
    <div
      className={`mt-3 flex items-center justify-center gap-1 text-sm font-medium ${
        isPositive ? 'text-green-500' : 'text-red-500'
      }`}
    >
      {isPositive ? (
        <ArrowUpRight className="w-4 h-4" />
      ) : (
        <ArrowDownRight className="w-4 h-4" />
      )}

      <span>
        {Math.abs(value).toLocaleString('de-DE', {
          minimumFractionDigits: 2,
        })}{' '}
        (
        {Math.abs(percent).toLocaleString('de-DE', {
          minimumFractionDigits: 2,
        })}
        %) {periodLabel}
      </span>
    </div>
  );
}
