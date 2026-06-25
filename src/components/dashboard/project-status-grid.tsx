import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project/project-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Project } from "@/types/project";

export function ProjectStatusGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create your first carbon credit project to get started."
        action={
          <Link href="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </Link>
        }
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
