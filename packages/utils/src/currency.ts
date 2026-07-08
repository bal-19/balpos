const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Input string desimal (dari API, hasil serialize Prisma Decimal) → "Rp 15.000". */
export function formatCurrencyIDR(value: string | number): string {
  const amount = typeof value === "string" ? Number(value) : value;
  return idrFormatter.format(Number.isFinite(amount) ? amount : 0);
}
