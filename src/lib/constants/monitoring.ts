export const VALID_MONITORING_RISK_SIGNALS = [
  "none",
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const RISK_SIGNAL_LABELS: Record<string, string> = {
  none: "No Risk Observed",
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  critical: "Critical Risk",
};
