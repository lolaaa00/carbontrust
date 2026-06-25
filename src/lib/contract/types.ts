export type TransactionStatus =
  | "idle"
  | "simulating"
  | "awaiting_signature"
  | "pending"
  | "confirming"
  | "success"
  | "failed"
  | "rejected";
