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
    <p
      className={`mt-3 text-sm font-medium ${
        isPositive ? 'text-green-500' : 'text-red-500'
      }`}
    >
      {isPositive ? '↗' : '↘'}{' '}
      {Math.abs(value).toLocaleString('de-DE', {
        minimumFractionDigits: 2,
      })}{' '}
      (
      {Math.abs(percent).toLocaleString('de-DE', {
        minimumFractionDigits: 2,
      })}
      %) {periodLabel}
    </p>
  );
}
