"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectForm } from "@/components/project/project-form";
import { TransactionStatus } from "@/components/shared/transaction-status";
import { WalletGuard } from "@/components/wallet/wallet-guard";
import { Card, CardContent } from "@/components/ui/card";
import { useWallet, useTransactionFlow } from "@/lib/wallet/hooks";
import { createProject } from "@/lib/contract/writes";
import type { ProjectFormData } from "@/lib/utils/validation";

export default function NewProjectPage() {
  const router = useRouter();
  const { writeClient } = useWallet();
  const { status, hash, error, execute, retry, reset } = useTransactionFlow((finalStatus) => {
    if (finalStatus === "accepted" || finalStatus === "finalized") {
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  });

  const handleSubmit = async (data: ProjectFormData) => {
    if (!writeClient) return;
    await execute(() => createProject(writeClient, data));
  };

  return (
    <WalletGuard>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <PageHeader
          title="Create Assessment Case"
          description="Submit a new environmental project for AI consensus assessment."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "New Project" },
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
            <CardContent className="p-6">
              <ProjectForm
                onSubmit={handleSubmit}
                isSubmitting={false}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </WalletGuard>
  );
}
