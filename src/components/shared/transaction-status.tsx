"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExplorerLink } from "@/components/shared/explorer-link";

type TxStatus = "idle" | "simulating" | "awaiting_signature" | "pending" | "confirming" | "success" | "failed" | "rejected";

const statusConfig: Record<TxStatus, {
  message: string;
  icon?: React.ElementType;
  color: string;
  spinning?: boolean;
  terminal?: boolean;
}> = {
  idle: { message: "", color: "" },
  simulating: {
    message: "Preparing transaction...",
    icon: Loader2,
    color: "text-muted-foreground",
    spinning: true,
  },
  awaiting_signature: {
    message: "Please confirm in your wallet...",
    icon: Loader2,
    color: "text-amber-600 dark:text-amber-400",
    spinning: true,
  },
  pending: {
    message: "Transaction submitted. Waiting for confirmation...",
    icon: Loader2,
    color: "text-blue-600 dark:text-blue-400",
    spinning: true,
  },
  confirming: {
    message: "Confirming transaction...",
    icon: Loader2,
    color: "text-blue-600 dark:text-blue-400",
    spinning: true,
  },
  success: {
    message: "Transaction confirmed!",
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    terminal: true,
  },
  failed: {
    message: "Transaction failed.",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    terminal: true,
  },
  rejected: {
    message: "Transaction cancelled.",
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    terminal: true,
  },
};

interface TransactionStatusProps {
  status: TxStatus;
  hash?: string;
  error?: string;
  onDismiss?: () => void;
}

export function TransactionStatus({ status, hash, error, onDismiss }: TransactionStatusProps) {
  const [dismissed, setDismissed] = useState(false);

  if (status === "idle" || dismissed) return null;

  const config = statusConfig[status];
  const Icon = config.icon;
  const message = status === "failed" && error ? error : config.message;

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
        {config.terminal && (
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
