'use client';

import { formatCurrency } from '@/lib/formatCurrency';

type AccountValueCardProps = {
  value: number;
  changeSumToday: number;
  changePct: number;
  currency?: 'EUR' | 'USD';
};

export default function AccountValueCard({
  value,
  changeSumToday,
  changePct,
  currency = 'USD',
}: AccountValueCardProps) {
  const isPositive = changeSumToday > 0;
  const isNegative = changeSumToday < 0;
  const sign = isPositive ? '+' : isNegative ? '-' : '';
  const colorClass = isPositive
    ? 'text-green-400'
    : isNegative
      ? 'text-red-400'
      : 'text-white/70';

  return (
    <section aria-labelledby="account-value-title">

      {/* ACCOUNT VALUE */}
      <h2
        id="account-value-title"
        className="text-[12px] sm:text-[14px] uppercase tracking-wider text-white/40 mb-2"
      >
        Account Value
      </h2>
      {/* GESAMTGUTHABEN */}
      <p className="tabular-nums mt-1 text-4xl font-medium text-white leading-tight whitespace-nowrap">
        {formatCurrency(value, currency)}
      </p>
      {/* VERÄNDERUNG DES TAGES */}
      <p
        className={`mt-1 text-sm underline underline-offset-4 decoration-white/20 ${colorClass}`}
      >
        {sign}
        {formatCurrency(Math.abs(changeSumToday), currency)} (
        {Number.isFinite(changePct) ? changePct.toFixed(2) : '0.00'}%) Today
      </p>
    </section>
  );
}
