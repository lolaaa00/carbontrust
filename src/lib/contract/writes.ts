import { callWrite } from "@/lib/contract/client";
import type { ProjectFormData, EvidenceFormData } from "@/lib/utils/validation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createProject(client: any, data: ProjectFormData): Promise<string> {
  return callWrite(client, "create_project", [
    data.title,
    data.project_type,
    data.location,
    data.project_owner_name,
    data.assessment_objective,
    data.claimed_carbon_impact,
    data.claimed_biodiversity_impact,
    data.monitoring_period,
    data.evidence_summary,
  ]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addEvidence(client: any, projectId: number, data: EvidenceFormData): Promise<string> {
  return callWrite(client, "add_evidence", [
    projectId,
    data.evidence_type,
    data.title,
    data.url,
    data.description,
    data.content_hash || "",
    data.source_name,
    data.date_produced,
  ]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addMonitoringRecord(
  client: any,
  projectId: number,
  data: {
    period_label: string;
    observation_summary: string;
    evidence_url: string;
    content_hash: string;
    risk_signal: string;
  }
): Promise<string> {
  return callWrite(client, "add_monitoring_record", [
    projectId,
    data.period_label,
    data.observation_summary,
    data.evidence_url,
    data.content_hash || "",
    data.risk_signal,
  ]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function requestReview(client: any, projectId: number): Promise<string> {
  return callWrite(client, "request_review", [projectId]);
}
