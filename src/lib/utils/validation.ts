import { z } from "zod";
import { VALID_PROJECT_TYPES } from "@/lib/constants/project-types";
import { VALID_EVIDENCE_TYPES } from "@/lib/constants/evidence-types";

export const projectFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  project_type: z.enum(VALID_PROJECT_TYPES as unknown as [string, ...string[]]),
  location: z.string().min(2).max(1000),
  project_owner_name: z.string().min(2).max(200),
  assessment_objective: z.string().min(10).max(1000),
  claimed_carbon_impact: z.string().min(5).max(1000),
  claimed_biodiversity_impact: z.string().min(5).max(1000),
  monitoring_period: z.string().min(2).max(200),
  evidence_summary: z.string().min(10).max(1000),
});

export const evidenceFormSchema = z.object({
  evidence_type: z.enum(VALID_EVIDENCE_TYPES as unknown as [string, ...string[]]),
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  url: z.string().url("Must be a valid URL").refine((u) => u.startsWith("https://"), {
    message: "URL must use HTTPS",
  }),
  description: z.string().min(10).max(1000),
  content_hash: z
    .string()
    .regex(/^([a-fA-F0-9]{64}|Qm[a-zA-Z0-9]{44}|bafy[a-zA-Z0-9]+)?$/, "Invalid hash format")
    .optional()
    .or(z.literal("")),
  source_name: z.string().min(2).max(200),
  date_produced: z.string().date("Must be a valid date").refine(
    (d) => new Date(d) <= new Date(),
    { message: "Date cannot be in the future" }
  ),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
export type EvidenceFormData = z.infer<typeof evidenceFormSchema>;
