export interface Project {
  id: number;
  owner: string;
  title: string;
  project_type: string;
  location: string;
  project_owner_name: string;
  assessment_objective: string;
  claimed_carbon_impact: string;
  claimed_biodiversity_impact: string;
  monitoring_period: string;
  evidence_summary: string;
  status: ProjectStatus;
  evidence_count: number;
  assessment_count: number;
  monitoring_record_count: number;
  latest_assessment_id: number;
  created_sequence: number;
  created_at?: string;
}

export type ProjectStatus = "created" | "evidence_submitted" | "review_requested" | "assessed";
