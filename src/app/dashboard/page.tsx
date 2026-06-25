"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { ProjectStatusGrid } from "@/components/dashboard/project-status-grid";
import { WalletGuard } from "@/components/wallet/wallet-guard";
import { useWallet } from "@/lib/wallet/hooks";
import { getProjectsByOwner, getProject } from "@/lib/contract/reads";
import type { Project } from "@/types/project";

export default function DashboardPage() {
  const { address, isConnected } = useWallet();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    if (!isConnected || !address) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const projectIds = await getProjectsByOwner(address);
      const loaded: Project[] = [];
      for (const id of projectIds) {
        const project = await getProject(id);
        if (project) loaded.push(project);
      }
      setProjects(loaded);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const assessed = projects.filter((p) => p.status === "assessed").length;
  const pendingReview = projects.filter((p) => p.status === "review_requested").length;
  const totalEvidence = projects.reduce((sum, p) => sum + p.evidence_count, 0);

  return (
    <WalletGuard>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Dashboard"
          description="Your environmental assessment projects."
          action={
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          }
        />

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : (
          <>
            <StatsOverview
              totalProjects={projects.length}
              assessed={assessed}
              pendingReview={pendingReview}
              totalEvidence={totalEvidence}
            />
            <div className="mt-8">
              <ProjectStatusGrid projects={projects} />
            </div>
          </>
        )}
      </div>
    </WalletGuard>
  );
}
