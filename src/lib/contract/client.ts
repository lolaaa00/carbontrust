import { createReadClient } from "@/lib/wallet/config";
import { CONTRACT_ADDRESS } from "@/lib/contract/address";

let cachedClient: ReturnType<typeof createReadClient> | null = null;

function getClient() {
  if (!cachedClient) {
    cachedClient = createReadClient();
  }
  return cachedClient;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function callRead(functionName: string, args: unknown[] = []): Promise<unknown> {
  const client = getClient();
  return (client as any).readContract({ address: CONTRACT_ADDRESS, functionName, args });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function callWrite(client: any, functionName: string, args: unknown[]): Promise<string> {
  return client.writeContract({ address: CONTRACT_ADDRESS, functionName, args, value: BigInt(0) });
}

// Consensus writes on StudioNet routinely take minutes (one nondet round with
// several evidence fetches). Poll generously rather than relying on SDK defaults.
const POLL_INTERVAL_MS = 5000;
const POLL_RETRIES = 90; // ~7.5 minutes ceiling

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function waitForReceipt(client: any, hash: string, status: string): Promise<unknown> {
  return client.waitForTransactionReceipt({
    hash,
    status,
    interval: POLL_INTERVAL_MS,
    retries: POLL_RETRIES,
  });
}

export const TERMINAL_TX_STATUSES = new Set([
  "ACCEPTED",
  "FINALIZED",
  "UNDETERMINED",
  "CANCELED",
  "VALIDATORS_TIMEOUT",
  "LEADER_TIMEOUT",
]);

/**
 * Polls the real GenLayer consensus lifecycle (PROPOSING -> COMMITTING ->
 * REVEALING -> ACCEPTED/UNDETERMINED/...) so the UI can show actual stages
 * instead of a generic spinner. Resolves with the last known status name.
 */
export async function pollTransactionStatus(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any,
  hash: string,
  onStatus: (statusName: string) => void,
  { interval = POLL_INTERVAL_MS, retries = POLL_RETRIES } = {},
): Promise<string> {
  let lastStatus = "PENDING";

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const tx = await client.getTransaction({ hash });
      const statusName: string | undefined = tx?.statusName ?? tx?.status;
      if (statusName && statusName !== lastStatus) {
        lastStatus = statusName;
        onStatus(statusName);
      }
      if (statusName && TERMINAL_TX_STATUSES.has(statusName)) {
        return statusName;
      }
    } catch {
      // Transient read failure while polling — keep trying until retries run out.
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(
    `Timed out waiting for consensus after ${Math.round((retries * interval) / 1000)}s. ` +
      "The transaction may still finalize — check the explorer link.",
  );
}
