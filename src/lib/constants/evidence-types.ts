export const VALID_EVIDENCE_TYPES = [
  "satellite_imagery",
  "drone_imagery",
  "environmental_report",
  "iot_sensor_data",
  "government_permit",
  "land_use_record",
  "biodiversity_survey",
  "community_observation",
  "carbon_methodology",
  "third_party_audit",
] as const;

export const EVIDENCE_TYPE_LABELS: Record<string, string> = {
  satellite_imagery: "Satellite Imagery",
  drone_imagery: "Drone Imagery",
  environmental_report: "Environmental Report",
  iot_sensor_data: "IoT Sensor Data",
  government_permit: "Government Permit",
  land_use_record: "Land Use Record",
  biodiversity_survey: "Biodiversity Survey",
  community_observation: "Community Observation",
  carbon_methodology: "Carbon Methodology",
  third_party_audit: "Third-Party Audit",
};

export const EVIDENCE_TYPE_COLORS: Record<string, string> = {
  satellite_imagery: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  drone_imagery: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  environmental_report: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  iot_sensor_data: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  government_permit: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  land_use_record: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  biodiversity_survey: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  community_observation: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  carbon_methodology: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
  third_party_audit: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
};
