"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectForm } from "@/components/project/project-form";
import { TransactionStatus } from "@/components/shared/transaction-status";
import { WalletGuard } from "@/components/wallet/wallet-guard";
import { Card, CardContent } from "@/components/ui/card";
import { useWallet } from "@/lib/wallet/hooks";
import { createProject } from "@/lib/contract/writes";
import { waitForReceipt } from "@/lib/contract/client";
import { TransactionStatus as GenLayerTxStatus } from "genlayer-js/types";
import type { ProjectFormData } from "@/lib/utils/validation";
import type { TransactionStatus as TxStatusType } from "@/types/contract";

export default function NewProjectPage() {
  const router = useRouter();
  const { writeClient } = useWallet();
  const [txStatus, setTxStatus] = useState<TxStatusType>("idle");
  const [txHash, setTxHash] = useState<string>();
  const [txError, setTxError] = useState<string>();

  const handleSubmit = async (data: ProjectFormData) => {
    if (!writeClient) return;
    setTxStatus("awaiting_signature");
    try {
      const hash = await createProject(writeClient, data);
      setTxHash(hash);
      setTxStatus("pending");
      await waitForReceipt(writeClient, hash, GenLayerTxStatus.ACCEPTED);
      setTxStatus("success");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setTxStatus("failed");
      setTxError(err instanceof Error ? err.message : "Transaction failed. Please try again.");
    }
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

        {txStatus !== "idle" ? (
          <Card>
            <CardContent className="p-6">
              <TransactionStatus
                status={txStatus}
                hash={txHash}
                error={txError}
                onDismiss={() => {
                  setTxStatus("idle");
                  setTxHash(undefined);
                  setTxError(undefined);
                }}
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
