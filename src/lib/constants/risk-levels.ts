export const RISK_COLORS: Record<string, string> = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  critical: "bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-100",
};

export const QUALITY_COLORS: Record<string, string> = {
  high: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  moderate: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  low: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  insufficient: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export const ADDITIONALITY_COLORS: Record<string, string> = {
  likely: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  unlikely: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  uncertain: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

export const BIODIVERSITY_COLORS: Record<string, string> = {
  positive: "text-green-600 dark:text-green-400",
  neutral: "text-gray-500",
  negative: "text-red-600 dark:text-red-400",
  uncertain: "text-amber-600 dark:text-amber-400",
};
