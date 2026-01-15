'use client';

type AccountValueCardProps = {
  value: number;
  changeSumToday: number;
  changePct: number;
  currency?: 'EUR' | 'USD';
};

function formatCurrency(amount: number, currency: 'USD' | 'EUR'): string {
  const locale = currency === 'EUR' ? 'de-DE' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export default function AccountValueCard({ value, changeSumToday, changePct, currency = 'USD' }: AccountValueCardProps) {
  const isPositive = changeSumToday > 0;
  const isNegative = changeSumToday < 0;
  const sign = isPositive ? '+' : '';
  const colorClass = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-white/70';

  return (
      <section aria-labelledby="account-value-title">
        <p id="account-value-title" className="text-[12px] sm:text-[14px] uppercase tracking-wider text-white/40 mb-2">Account Value</p>
        <p className="mt-1 text-4xl font-semibold text-white leading-tight whitespace-nowrap">{formatCurrency(value, currency)}</p>
        <p className={`mt-1 text-sm underline underline-offset-4 decoration-white/20 ${colorClass}`}>{sign}{formatCurrency(changeSumToday, currency)} ({changePct.toFixed(2)}%) Today</p>
      </section>
  );
}
