"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { EvidenceForm } from "@/components/evidence/evidence-form";
import { TransactionStatus } from "@/components/shared/transaction-status";
import { WalletGuard } from "@/components/wallet/wallet-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useWallet } from "@/lib/wallet/hooks";
import { addEvidence } from "@/lib/contract/writes";
import { waitForReceipt } from "@/lib/contract/client";
import { TransactionStatus as GenLayerTxStatus } from "genlayer-js/types";
import type { EvidenceFormData } from "@/lib/utils/validation";
import type { TransactionStatus as TxStatusType } from "@/types/contract";

export default function EvidencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = Number(id);
  const router = useRouter();
  const { writeClient } = useWallet();
  const [txStatus, setTxStatus] = useState<TxStatusType>("idle");
  const [txHash, setTxHash] = useState<string>();
  const [txError, setTxError] = useState<string>();

  const handleSubmit = async (data: EvidenceFormData) => {
    if (!writeClient) return;
    setTxStatus("awaiting_signature");
    try {
      const hash = await addEvidence(writeClient, projectId, data);
      setTxHash(hash);
      setTxStatus("pending");
      await waitForReceipt(writeClient, hash, GenLayerTxStatus.ACCEPTED);
      setTxStatus("success");
      setTimeout(() => router.push(`/projects/${id}`), 2000);
    } catch (err) {
      setTxStatus("failed");
      setTxError(err instanceof Error ? err.message : "Transaction failed. Please try again.");
    }
  };

  return (
    <WalletGuard>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <PageHeader
          title="Submit Evidence"
          description="Add evidence to support the environmental assessment."
          breadcrumbs={[
            { label: "Explore", href: "/explore" },
            { label: `Project #${id}`, href: `/projects/${id}` },
            { label: "Submit Evidence" },
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
            <CardHeader>
              <CardTitle>Evidence Details</CardTitle>
              <CardDescription>
                Provide a public URL to your evidence along with metadata. The file content
                is never uploaded — only the URL and optional hash are stored on-chain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EvidenceForm
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
