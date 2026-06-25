import { FolderOpen } from "lucide-react";
import { ProjectCard } from "./project-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Project } from "@/types/project";

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No projects found"
        description="There are no projects to display yet."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
