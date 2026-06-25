"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConsensusSummary } from "@/components/consensus/consensus-summary";
import { ConsensusHistory } from "@/components/consensus/consensus-history";
import { ExplorerLink } from "@/components/shared/explorer-link";
import { getProject, getAssessmentHistory } from "@/lib/contract/reads";
import type { Project } from "@/types/project";
import type { Assessment } from "@/types/assessment";

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = Number(id);
  const [project, setProject] = useState<Project | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, hist] = await Promise.all([
          getProject(projectId),
          getAssessmentHistory(projectId),
        ]);
        setProject(p);
        setAssessments(hist);
      } catch {
        setProject(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  const latestAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : null;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-[500px] animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!project || !latestAssessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="No Assessment Available"
          description="This project has not been assessed yet, or could not be found."
          action={
            <Button asChild variant="outline">
              <Link href={`/projects/${id}`}>View Project</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={project.title}
        description={`${project.project_type.replace(/_/g, " ")} project in ${project.location}`}
        breadcrumbs={[
          { label: "Explore", href: "/explore" },
          { label: `Project #${id}`, href: `/projects/${id}` },
          { label: "Assessment" },
        ]}
      />

      <ConsensusSummary assessment={latestAssessment} />

      {assessments.length > 1 && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">Assessment History</h3>
          <ConsensusHistory assessments={assessments} />
        </div>
      )}

      <Separator className="my-8" />

      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Verified on GenLayer</span>
            <Badge variant="secondary">StudioNet</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {contractAddress && (
              <ExplorerLink hash={contractAddress} type="contract" label="View Contract" />
            )}
            <Link
              href={`/projects/${id}`}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Full Project Details
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
