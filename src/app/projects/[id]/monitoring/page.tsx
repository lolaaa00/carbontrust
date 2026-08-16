"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { MonitoringForm } from "@/components/monitoring/monitoring-form";
import { TransactionStatus } from "@/components/shared/transaction-status";
import { WalletGuard } from "@/components/wallet/wallet-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useWallet, useTransactionFlow } from "@/lib/wallet/hooks";
import { addMonitoringRecord } from "@/lib/contract/writes";
import type { MonitoringFormData } from "@/lib/utils/validation";

export default function MonitoringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = Number(id);
  const router = useRouter();
  const { writeClient } = useWallet();
  const { status, hash, error, execute, retry, reset } = useTransactionFlow((finalStatus) => {
    if (finalStatus === "accepted" || finalStatus === "finalized") {
      setTimeout(() => router.push(`/projects/${id}`), 2000);
    }
  });

  const handleSubmit = async (data: MonitoringFormData) => {
    if (!writeClient) return;
    await execute(() =>
      addMonitoringRecord(writeClient, projectId, {
        ...data,
        content_hash: data.content_hash || "",
      }),
    );
  };

  return (
    <WalletGuard>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <PageHeader
          title="Submit Monitoring Record"
          description="Add an ongoing monitoring observation for this project."
          breadcrumbs={[
            { label: "Explore", href: "/explore" },
            { label: `Project #${id}`, href: `/projects/${id}` },
            { label: "Submit Monitoring Record" },
          ]}
        />

        {status !== "idle" ? (
          <Card>
            <CardContent className="p-6">
              <TransactionStatus
                status={status}
                hash={hash ?? undefined}
                error={error ?? undefined}
                onRetry={retry}
                onDismiss={reset}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Details</CardTitle>
              <CardDescription>
                Only the project owner can submit monitoring records. Provide a public URL to
                supporting evidence for this observation period.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MonitoringForm onSubmit={handleSubmit} isSubmitting={false} />
            </CardContent>
          </Card>
        )}
      </div>
    </WalletGuard>
  );
}
