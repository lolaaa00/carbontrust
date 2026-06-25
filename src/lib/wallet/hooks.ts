"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { TransactionStatus } from "genlayer-js/types";
import { useWallet } from "@/components/wallet/wallet-provider";
import { callRead, callWrite, waitForReceipt } from "@/lib/contract/client";

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

type WriteStatus = "idle" | "awaiting_signature" | "pending" | "success" | "failed";

interface UseContractWriteResult {
  execute: (functionName: string, args: unknown[]) => Promise<string>;
  status: WriteStatus;
  hash: string | null;
  error: Error | null;
  reset: () => void;
}

export function useContractWrite(): UseContractWriteResult {
  const { writeClient } = useWallet();
  const [status, setStatus] = useState<WriteStatus>("idle");
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setHash(null);
    setError(null);
  }, []);

  const execute = useCallback(
    async (functionName: string, args: unknown[]): Promise<string> => {
      if (!writeClient) {
        throw new Error("Wallet not connected");
      }

      reset();
      setStatus("awaiting_signature");

      try {
        const txHash = await callWrite(writeClient, functionName, args);
        setHash(txHash);
        setStatus("pending");

        await waitForReceipt(writeClient, txHash, TransactionStatus.ACCEPTED);

        setStatus("success");
        return txHash;
      } catch (err) {
        const thrownError = err instanceof Error ? err : new Error(String(err));
        setError(thrownError);
        setStatus("failed");
        throw thrownError;
      }
    },
    [writeClient, reset],
  );

  return { execute, status, hash, error, reset };
}
