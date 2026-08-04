"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConsensusDetailCard } from "@/components/consensus/consensus-detail-card";
import { getProject, getProjectAssessment } from "@/lib/contract/reads";
import type { Project } from "@/types/project";
import type { Assessment } from "@/types/assessment";

export default function ConsensusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = Number(id);
  const [project, setProject] = useState<Project | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [p, a] = await Promise.all([
          getProject(projectId),
          getProjectAssessment(projectId),
        ]);
        if (cancelled) return;
        setProject(p);
        setAssessment(a);
      } catch {
        if (!cancelled) {
          setProject(null);
          setAssessment(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (Number.isFinite(projectId)) {
      load();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-[500px] animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!project || !assessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Assessment Not Found"
          description="This project has no completed assessment yet, or the project does not exist."
          action={
            <Button asChild variant="outline">
              <Link href="/explore">Browse Projects</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={`Assessment #${assessment.assessment_id} — ${project.title}`}
        breadcrumbs={[
          { label: "Explore", href: "/explore" },
          { label: project.title, href: `/projects/${project.id}` },
          { label: `Assessment #${assessment.assessment_id}` },
        ]}
      />
      <ConsensusDetailCard assessment={assessment} />
    </div>
  );
}
