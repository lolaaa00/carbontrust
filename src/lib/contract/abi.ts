// GenLayer Intelligent Contracts don't use traditional ABIs.
// Contract methods are called by name via genlayer-js SDK.
// This file documents the contract interface for reference.

export const CONTRACT_METHODS = {
  write: {
    create_project: [
      "title",
      "project_type",
      "location",
      "project_owner_name",
      "assessment_objective",
      "claimed_carbon_impact",
      "claimed_biodiversity_impact",
      "monitoring_period",
      "evidence_summary",
    ],
    add_evidence: [
      "project_id",
      "evidence_type",
      "title",
      "url",
      "description",
      "content_hash",
      "source_name",
      "date_produced",
    ],
    request_review: ["project_id"],
  },
  read: {
    get_project: ["project_id"],
    get_project_evidence: ["project_id"],
    get_project_assessment: ["project_id"],
    get_assessment_history: ["project_id"],
    get_project_count: [],
    get_projects_by_owner: ["owner_address"],
  },
} as const;
