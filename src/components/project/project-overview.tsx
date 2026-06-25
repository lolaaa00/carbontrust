"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProjectStatusBadge } from "./project-status-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { PROJECT_TYPE_LABELS } from "@/lib/constants/project-types";
import { formatDate } from "@/lib/utils/formatting";
import { truncateAddress } from "@/lib/wallet/utils";
import type { Project } from "@/types/project";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function ProjectOverview({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <ProjectStatusBadge status={project.status} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Project Type">
            {PROJECT_TYPE_LABELS[project.project_type] || project.project_type}
          </Field>
          <Field label="Location">{project.location}</Field>
          <Field label="Project Owner">{project.project_owner_name}</Field>
          <Field label="Owner Address">
            <span className="inline-flex items-center gap-1 font-mono text-xs">
              {truncateAddress(project.owner)}
              <CopyButton value={project.owner} />
            </span>
          </Field>
          <Field label="Monitoring Period">{project.monitoring_period}</Field>
          <Field label="Created">{project.created_at ? formatDate(project.created_at) : "N/A"}</Field>
          <Field label="Evidence Count">{project.evidence_count}</Field>
          <Field label="Assessments">{project.assessment_count}</Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Carbon &amp; Biodiversity Claims</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Assessment Objective">{project.assessment_objective}</Field>
          <Separator />
          <Field label="Claimed Carbon Impact">{project.claimed_carbon_impact}</Field>
          <Separator />
          <Field label="Claimed Biodiversity Impact">{project.claimed_biodiversity_impact}</Field>
          <Separator />
          <Field label="Evidence Summary">{project.evidence_summary}</Field>
        </CardContent>
      </Card>
    </div>
  );
}
