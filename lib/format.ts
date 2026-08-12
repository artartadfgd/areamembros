export function formatPrice(
  cents: number,
  currency: string = "USD",
  locale: string = "en",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}
