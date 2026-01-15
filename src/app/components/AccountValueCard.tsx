'use client';

type AccountValueCardProps = {
  value: number;
  changeSumToday: number;
  changePct: number;
  currency?: 'EUR' | 'USD';
};

function formatCurrency(amount: number, currency: 'USD' | 'EUR'): string {
    const locale = currency === 'EUR' ? 'de-DE' : 'en-US';
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    });
    return formatter.format(amount);
}

export default function AccountValueCard({ value, changeSumToday, changePct, currency = 'USD' }: AccountValueCardProps) {
    const isPositive = changeSumToday > 0;
    const sign = isPositive ? '+' : '';
    const colorClass = changeSumToday > 0 ? 'text-green-400' : changeSumToday < 0 ? 'text-red-400' : 'text-white/70';

  return (
    <>
    {/* KONTO WERT */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-white/50 mb-2">
          {'Account Value'}
        </p>
        <p className="text-4xl font-semibold text-white">
          {' '}
          {formatCurrency(value, currency)} 
        </p>
        <p className={`text-sm underline ${colorClass}`}>
          {' '}
          {sign}{formatCurrency(changeSumToday, currency)} ({changePct.toFixed(2)}%) Today
        </p>
      </div>
    </>
  );
}
