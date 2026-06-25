import { createReadClient } from "@/lib/wallet/config";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function waitForReceipt(client: any, hash: string, status: string): Promise<unknown> {
  return client.waitForTransactionReceipt({ hash, status });
}
