"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { callRead, pollTransactionStatus } from "@/lib/contract/client";
import { fromGenLayerStatus, type TransactionStatus as TxStatus } from "@/types/contract";

export { useWallet } from "@/components/wallet/wallet-provider";

interface UseContractReadResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useContractRead<T = unknown>(
  functionName: string,
  args: unknown[] = [],
): UseContractReadResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const argsRef = useRef(args);
  argsRef.current = args;

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await callRead(functionName, argsRef.current);
      setData(result as T);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [functionName]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

interface UseTransactionFlowResult {
  status: TxStatus;
  hash: string | null;
  error: string | null;
  /** Submits a write. `run` should call the contract and resolve with the tx hash. */
  execute: (run: () => Promise<string>) => Promise<void>;
  /** Re-submits the last `run`. Only meaningful once status is retryable (e.g. UNDETERMINED). */
  retry: () => void;
  reset: () => void;
}

/**
 * Drives a single write through the real GenLayer consensus lifecycle
 * (PROPOSING -> COMMITTING -> REVEALING -> ACCEPTED/UNDETERMINED/...), not a
 * generic spinner. UNDETERMINED / *_TIMEOUT resolve to a retryable status
 * rather than "failed" — nothing was written in those cases.
 */
export function useTransactionFlow(onSettled?: (status: TxStatus) => void): UseTransactionFlowResult {
  const { writeClient } = useWallet();
  const [status, setStatus] = useState<TxStatus>("idle");
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastRunRef = useRef<(() => Promise<string>) | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setHash(null);
    setError(null);
  }, []);

  const execute = useCallback(
    async (run: () => Promise<string>) => {
      if (!writeClient) {
        setError("Wallet not connected.");
        setStatus("failed");
        return;
      }

      lastRunRef.current = run;
      setError(null);
      setHash(null);
      setStatus("awaiting_signature");

      try {
        const txHash = await run();
        setHash(txHash);
        setStatus("pending");

        const finalGenLayerStatus = await pollTransactionStatus(writeClient, txHash, (statusName) => {
          setStatus(fromGenLayerStatus(statusName));
        });

        const finalStatus = fromGenLayerStatus(finalGenLayerStatus);
        setStatus(finalStatus);
        onSettled?.(finalStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Transaction failed. Please try again.");
        setStatus("failed");
        onSettled?.("failed");
      }
    },
    [writeClient, onSettled],
  );

  const retry = useCallback(() => {
    if (lastRunRef.current) {
      execute(lastRunRef.current);
    }
  }, [execute]);

  return { status, hash, error, execute, retry, reset };
}
