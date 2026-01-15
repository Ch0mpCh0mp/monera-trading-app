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
        <p className="text-sm text-white/70 underline">
          {' '}
          {formatCurrency(changeSumToday, currency)} ({changePct.toFixed(2)}%) Today
        </p>
      </div>
    </>
  );
}
