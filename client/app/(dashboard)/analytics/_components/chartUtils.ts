export function formatCompactCurrency(value: number) {
  if (value >= 100_000) return `Rs. ${(value / 100_000).toFixed(1)}L`;
  if (value >= 1_000) return `Rs. ${(value / 1_000).toFixed(0)}K`;
  return `Rs. ${value}`;
}

export function formatMonthLabel(value: string) {
  const normalized = value.length === 7 ? `${value}-01` : value;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "2-digit",
  }).format(date);
}

export function toChartNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value ?? 0);
}

export function toChartLabel(value: unknown) {
  return typeof value === "string" ? value : String(value ?? "");
}
