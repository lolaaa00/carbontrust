import Link from "next/link";
import { MapPin, FileText, BarChart3, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectStatusBadge } from "./project-status-badge";
import { PROJECT_TYPE_LABELS } from "@/lib/constants/project-types";
import { formatDate } from "@/lib/utils/formatting";
import type { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
            <ProjectStatusBadge status={project.status} />
          </div>
          <Badge variant="outline" className="w-fit text-xs">
            {PROJECT_TYPE_LABELS[project.project_type] || project.project_type}
          </Badge>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground gap-4">
          <span className="inline-flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {project.evidence_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <BarChart3 className="h-3.5 w-3.5" />
            {project.assessment_count}
          </span>
          <span className="ml-auto inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {project.created_at ? formatDate(project.created_at) : `#${project.id}`}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
