"use client";

import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/types/project";

const STATUS_VARIANT: Record<ProjectStatus, "secondary" | "warning" | "default" | "success"> = {
  created: "secondary",
  evidence_submitted: "warning",
  review_requested: "default",
  assessed: "success",
};

function formatStatusLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      {formatStatusLabel(status)}
    </Badge>
  );
}
