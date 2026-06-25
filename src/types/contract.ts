export type TransactionStatus =
  | "idle"
  | "simulating"
  | "awaiting_signature"
  | "pending"
  | "confirming"
  | "success"
  | "failed"
  | "rejected";

export interface TransactionState {
  status: TransactionStatus;
  hash?: string;
  error?: string;
}
