export function formatCurrency(amount: number, currency: 'USD' | 'EUR'): string {
  const locale = currency === 'EUR' ? 'de-DE' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
