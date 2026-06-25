export interface SourceFinding {
  evidence_id: number;
  fetch_status: "fetched" | "failed";
  source_alignment: "supports" | "contradicts" | "mixed" | "unclear";
  credibility: "high" | "moderate" | "low" | "unknown";
  key_observation: string;
}

export interface Assessment {
  assessment_id: number;
  project_id?: number;
  verdict: "high_confidence" | "moderate_confidence" | "low_confidence" | "insufficient_evidence" | "high_fraud_risk";
  carbon_estimate_low: number;
  carbon_estimate_high: number;
  carbon_estimate_likely: number;
  confidence_score: number;
  additionality: "likely" | "unlikely" | "uncertain";
  environmental_risk: "low" | "medium" | "high" | "critical";
  evidence_quality: "high" | "moderate" | "low" | "insufficient";
  fraud_risk: "low" | "medium" | "high";
  permanence_confidence: number;
  biodiversity_impact: "positive" | "neutral" | "negative" | "uncertain";
  biodiversity_confidence: number;
  source_findings: SourceFinding[];
  missing_evidence: string[];
  recommended_action: string;
  reasoning: string;
  reviewed_evidence_count?: number;
  fetched_evidence_limit?: number;
  monitoring_record_count?: number;
  timestamp?: string;
}
