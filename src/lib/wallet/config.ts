import { createClient, createAccount } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

export function createReadClient() {
  return createClient({ chain: studionet });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createWriteClient(address: string, provider: any) {
  return createClient({
    chain: studionet,
    account: address as `0x${string}`,
    provider,
  });
}

// Generated-wallet path: the account signs locally, no injected provider needed.
export function createGeneratedWriteClient(privateKey: `0x${string}`) {
  return createClient({
    chain: studionet,
    account: createAccount(privateKey),
  });
}
