export interface Evidence {
  evidence_id: number;
  submitter: string;
  evidence_type: EvidenceType;
  title: string;
  url: string;
  description: string;
  content_hash: string;
  source_name: string;
  date_produced: string;
  timestamp: string;
}

export type EvidenceType =
  | "satellite_imagery"
  | "drone_imagery"
  | "environmental_report"
  | "iot_sensor_data"
  | "government_permit"
  | "land_use_record"
  | "biodiversity_survey"
  | "community_observation"
  | "carbon_methodology"
  | "third_party_audit";
