export function formatCurrency(value: number | undefined | null): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatRating(value: number | undefined | null): string {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return n.toFixed(1);
}