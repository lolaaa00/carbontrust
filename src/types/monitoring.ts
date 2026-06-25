export interface MonitoringRecord {
  record_id: number;
  submitter: string;
  period_label: string;
  observation_summary: string;
  evidence_url: string;
  content_hash: string;
  risk_signal: "none" | "low" | "medium" | "high" | "critical";
}
