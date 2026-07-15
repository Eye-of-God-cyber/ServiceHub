/**
 * Reusable utility for formatting monetary values consistently across the application.
 */
export function formatCurrency(amount: number | string, currency = 'USD', locale = 'en-US'): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return 'Invalid Amount';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(numericAmount);
}
