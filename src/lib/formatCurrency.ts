// lib/formatCurrency.ts

export function formatCurrency(
  amount: number,
  currency: 'USD' | 'EUR' = 'EUR'
): string {
  const locale = currency === 'EUR' ? 'de-DE' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
