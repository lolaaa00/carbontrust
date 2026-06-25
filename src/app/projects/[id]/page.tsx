"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { Plus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectOverview } from "@/components/project/project-overview";
import { ProjectStatusBadge } from "@/components/project/project-status-badge";
import { EvidenceList } from "@/components/evidence/evidence-list";
import { ConsensusSummary } from "@/components/consensus/consensus-summary";
import { ConsensusHistory } from "@/components/consensus/consensus-history";
import { TransactionStatus } from "@/components/shared/transaction-status";
import { useWallet } from "@/lib/wallet/hooks";
import { getProject, getProjectEvidence, getProjectAssessment, getAssessmentHistory } from "@/lib/contract/reads";
import { requestReview } from "@/lib/contract/writes";
import { waitForReceipt } from "@/lib/contract/client";
import { TransactionStatus as GenLayerTxStatus } from "genlayer-js/types";
import type { Project } from "@/types/project";
import type { Evidence } from "@/types/evidence";
import type { Assessment } from "@/types/assessment";
import type { TransactionStatus as TxStatusType } from "@/types/contract";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = Number(id);
  const { address, writeClient } = useWallet();
  const [project, setProject] = useState<Project | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewTxStatus, setReviewTxStatus] = useState<TxStatusType>("idle");
  const [reviewTxHash, setReviewTxHash] = useState<string>();
  const [reviewTxError, setReviewTxError] = useState<string>();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, ev, hist] = await Promise.all([
        getProject(projectId),
        getProjectEvidence(projectId),
        getAssessmentHistory(projectId),
      ]);
      setProject(p);
      setEvidence(ev);
      setAssessments(hist);
    } catch {
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const latestAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : null;
  const isOwner = project && address && project.owner.toLowerCase() === address.toLowerCase();
  const canRequestReview =
    project &&
    isOwner &&
    (project.status === "evidence_submitted" || project.status === "assessed") &&
    project.evidence_count >= 1;

  const handleRequestReview = async () => {
    if (!writeClient) return;
    setReviewTxStatus("awaiting_signature");
    try {
      const hash = await requestReview(writeClient, projectId);
      setReviewTxHash(hash);
      setReviewTxStatus("pending");
      await waitForReceipt(writeClient, hash, GenLayerTxStatus.ACCEPTED);
      setReviewTxStatus("success");
      setTimeout(() => loadData(), 2000);
    } catch (err) {
      setReviewTxStatus("failed");
      setReviewTxError(err instanceof Error ? err.message : "Review request failed.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Project Not Found"
          description="This project does not exist or could not be loaded."
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
        title={project.title}
        description={project.assessment_objective}
        breadcrumbs={[
          { label: "Explore", href: "/explore" },
          { label: `Project #${id}` },
        ]}
        action={
          <div className="flex items-center gap-3">
            <ProjectStatusBadge status={project.status} />
            {canRequestReview && (
              <Button onClick={handleRequestReview} disabled={reviewTxStatus !== "idle"}>
                <Play className="mr-2 h-4 w-4" />
                Request AI Review
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/projects/${id}/evidence`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Evidence
              </Link>
            </Button>
          </div>
        }
      />

      {reviewTxStatus !== "idle" && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <TransactionStatus
              status={reviewTxStatus}
              hash={reviewTxHash}
              error={reviewTxError}
              onDismiss={() => {
                setReviewTxStatus("idle");
                setReviewTxHash(undefined);
                setReviewTxError(undefined);
              }}
            />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evidence">Evidence ({evidence.length})</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="history">History ({assessments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ProjectOverview project={project} />
        </TabsContent>

        <TabsContent value="evidence">
          {evidence.length === 0 ? (
            <EmptyState
              title="No Evidence Submitted"
              description="Add evidence to support this project's environmental claims."
              action={
                <Button asChild>
                  <Link href={`/projects/${id}/evidence`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Evidence
                  </Link>
                </Button>
              }
            />
          ) : (
            <EvidenceList evidence={evidence} />
          )}
        </TabsContent>

        <TabsContent value="assessment">
          {latestAssessment ? (
            <ConsensusSummary assessment={latestAssessment} />
          ) : (
            <EmptyState
              title="No Assessment Yet"
              description={
                project.evidence_count === 0
                  ? "Submit evidence before requesting an AI review."
                  : "Request an AI consensus review to generate an environmental assessment."
              }
              action={
                canRequestReview ? (
                  <Button onClick={handleRequestReview}>
                    <Play className="mr-2 h-4 w-4" />
                    Request AI Review
                  </Button>
                ) : undefined
              }
            />
          )}
        </TabsContent>

        <TabsContent value="history">
          {assessments.length === 0 ? (
            <EmptyState
              title="No Assessment History"
              description="Assessment history will appear here after the first AI review."
            />
          ) : (
            <ConsensusHistory assessments={assessments} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
