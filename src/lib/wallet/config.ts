import { createClient } from "genlayer-js";
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
