export function getConfidenceLabel(score: number): string {
  if (score >= 90) return "Very High";
  if (score >= 75) return "High";
  if (score >= 50) return "Moderate";
  if (score >= 25) return "Low";
  return "Very Low";
}

export function getConfidenceColor(score: number): string {
  if (score >= 90) return "text-green-600 dark:text-green-400";
  if (score >= 75) return "text-teal-600 dark:text-teal-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  if (score >= 25) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

export function getConfidenceBarColor(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 75) return "bg-teal-500";
  if (score >= 50) return "bg-amber-500";
  if (score >= 25) return "bg-orange-500";
  return "bg-red-500";
}

export const VERDICT_LABELS: Record<string, string> = {
  high_confidence: "High Confidence",
  moderate_confidence: "Moderate Confidence",
  low_confidence: "Low Confidence",
  insufficient_evidence: "Insufficient Evidence",
  high_fraud_risk: "High Fraud Risk",
};

export const VERDICT_COLORS: Record<string, string> = {
  high_confidence: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  moderate_confidence: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  low_confidence: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  insufficient_evidence: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  high_fraud_risk: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export const SOURCE_ALIGNMENT_COLORS: Record<string, string> = {
  supports: "text-green-600 dark:text-green-400",
  contradicts: "text-red-600 dark:text-red-400",
  mixed: "text-amber-600 dark:text-amber-400",
  unclear: "text-gray-500",
};
