// Mirrors the real GenLayer consensus lifecycle (see genlayer-js's TransactionStatus)
// plus two pre-chain states for the wallet-signature step. Intentionally does not
// collapse everything into a generic "pending" — PROPOSING/COMMITTING/REVEALING are
// shown as distinct stages, and UNDETERMINED is a retryable outcome, not a failure.
export type TransactionStatus =
  | "idle"
  | "awaiting_signature"
  | "rejected"
  | "pending"
  | "proposing"
  | "committing"
  | "revealing"
  | "appeal_committing"
  | "appeal_revealing"
  | "ready_to_finalize"
  | "accepted"
  | "finalized"
  | "undetermined"
  | "validators_timeout"
  | "leader_timeout"
  | "canceled"
  | "failed";

export interface TransactionState {
  status: TransactionStatus;
  hash?: string;
  error?: string;
}

const RETRYABLE_STATUSES: TransactionStatus[] = [
  "undetermined",
  "validators_timeout",
  "leader_timeout",
];

export function isRetryableStatus(status: TransactionStatus): boolean {
  return RETRYABLE_STATUSES.includes(status);
}

export function isTerminalStatus(status: TransactionStatus): boolean {
  return (
    status === "accepted" ||
    status === "finalized" ||
    status === "failed" ||
    status === "rejected" ||
    status === "canceled" ||
    isRetryableStatus(status)
  );
}

const GENLAYER_STATUS_MAP: Record<string, TransactionStatus> = {
  UNINITIALIZED: "pending",
  PENDING: "pending",
  PROPOSING: "proposing",
  COMMITTING: "committing",
  REVEALING: "revealing",
  APPEAL_COMMITTING: "appeal_committing",
  APPEAL_REVEALING: "appeal_revealing",
  READY_TO_FINALIZE: "ready_to_finalize",
  ACCEPTED: "accepted",
  FINALIZED: "finalized",
  UNDETERMINED: "undetermined",
  CANCELED: "canceled",
  VALIDATORS_TIMEOUT: "validators_timeout",
  LEADER_TIMEOUT: "leader_timeout",
};

export function fromGenLayerStatus(statusName: string): TransactionStatus {
  return GENLAYER_STATUS_MAP[statusName] ?? "pending";
}
