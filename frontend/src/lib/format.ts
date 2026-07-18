/**
 * Currency helpers. API prices arrive as decimal strings ("129.99");
 * all arithmetic is done in integer cents to avoid floating-point drift.
 */

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function toCents(price: string | number): number {
  return Math.round(Number(price) * 100);
}

export function centsToPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatPrice(price: string | number): string {
  return currencyFormatter.format(Number(price));
}

export function formatCents(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
