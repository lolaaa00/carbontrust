"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExplorerLink } from "@/components/shared/explorer-link";
import { isRetryableStatus, isTerminalStatus, type TransactionStatus as TxStatus } from "@/types/contract";

const statusConfig: Record<TxStatus, {
  message: string;
  icon?: React.ElementType;
  color: string;
  spinning?: boolean;
}> = {
  idle: { message: "", color: "" },
  awaiting_signature: {
    message: "Please confirm in your wallet...",
    icon: Loader2,
    color: "text-amber-600 dark:text-amber-400",
    spinning: true,
  },
  pending: {
    message: "Transaction submitted. Waiting for the network to pick it up...",
    icon: Loader2,
    color: "text-blue-600 dark:text-blue-400",
    spinning: true,
  },
  proposing: {
    message: "Leader is proposing a result...",
    icon: Loader2,
    color: "text-blue-600 dark:text-blue-400",
    spinning: true,
  },
  committing: {
    message: "Validators are committing votes...",
    icon: Loader2,
    color: "text-blue-600 dark:text-blue-400",
    spinning: true,
  },
  revealing: {
    message: "Validators are revealing votes...",
    icon: Loader2,
    color: "text-blue-600 dark:text-blue-400",
    spinning: true,
  },
  appeal_committing: {
    message: "Appeal round: validators are committing votes...",
    icon: Loader2,
    color: "text-purple-600 dark:text-purple-400",
    spinning: true,
  },
  appeal_revealing: {
    message: "Appeal round: validators are revealing votes...",
    icon: Loader2,
    color: "text-purple-600 dark:text-purple-400",
    spinning: true,
  },
  ready_to_finalize: {
    message: "Consensus reached. Waiting to finalize...",
    icon: Loader2,
    color: "text-blue-600 dark:text-blue-400",
    spinning: true,
  },
  accepted: {
    message: "Accepted by consensus. This can still change during the appeal window.",
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
  },
  finalized: {
    message: "Finalized. The appeal window has closed.",
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
  },
  undetermined: {
    message: "Validators could not agree. Nothing was written — this is safe to retry.",
    icon: RefreshCw,
    color: "text-amber-600 dark:text-amber-400",
  },
  validators_timeout: {
    message: "Validators timed out. Nothing was written — this is safe to retry.",
    icon: RefreshCw,
    color: "text-amber-600 dark:text-amber-400",
  },
  leader_timeout: {
    message: "The leader timed out. Nothing was written — this is safe to retry.",
    icon: RefreshCw,
    color: "text-amber-600 dark:text-amber-400",
  },
  canceled: {
    message: "Transaction canceled.",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
  },
  failed: {
    message: "Transaction failed.",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
  },
  rejected: {
    message: "Transaction cancelled.",
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
  },
};

interface TransactionStatusProps {
  status: TxStatus;
  hash?: string;
  error?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function TransactionStatus({ status, hash, error, onDismiss, onRetry }: TransactionStatusProps) {
  const [dismissed, setDismissed] = useState(false);

  if (status === "idle" || dismissed) return null;

  const config = statusConfig[status];
  const Icon = config.icon;
  const message = (status === "failed" || status === "canceled") && error ? error : config.message;
  const terminal = isTerminalStatus(status);
  const retryable = isRetryableStatus(status);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <Card className={cn("border", config.color)}>
      <CardContent className="flex items-center gap-3 p-4">
        {Icon && (
          <Icon
            className={cn("h-5 w-5 shrink-0", config.color, config.spinning && "animate-spin")}
          />
        )}
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium", config.color)}>{message}</p>
          {hash && (
            <div className="mt-1">
              <ExplorerLink hash={hash} type="tx" label="View on explorer" />
            </div>
          )}
        </div>
        {retryable && onRetry && (
          <Button variant="outline" size="sm" className="shrink-0" onClick={onRetry}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Retry
          </Button>
        )}
        {terminal && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
