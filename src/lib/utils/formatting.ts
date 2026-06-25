export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatCarbonTons(value: number): string {
  return `${formatNumber(value)} tCO2e`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTimestamp(isoDate: string): string {
  return new Date(isoDate).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
