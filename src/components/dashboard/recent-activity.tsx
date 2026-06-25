import Link from "next/link";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/project/project-status-badge";
import { formatDate } from "@/lib/utils/formatting";
import type { Project } from "@/types/project";

export function RecentActivity({ projects }: { projects: Project[] }) {
  const recent = projects.slice(0, 5);

  if (recent.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {recent.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="flex items-center justify-between gap-3 border-b px-6 py-3 last:border-0 hover:bg-muted/50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{project.title}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {project.created_at ? formatDate(project.created_at) : `Project #${project.id}`}
              </p>
            </div>
            <ProjectStatusBadge status={project.status} />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
