"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConsensusDetailCard } from "@/components/consensus/consensus-detail-card";
import type { Assessment } from "@/types/assessment";

export default function ConsensusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-[500px] animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Assessment Not Found"
          description="This assessment does not exist or could not be loaded."
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
        title={`Assessment #${assessment.assessment_id}`}
        breadcrumbs={[
          { label: "Explore", href: "/explore" },
          { label: `Assessment #${id}` },
        ]}
      />
      <ConsensusDetailCard assessment={assessment} />
    </div>
  );
}
