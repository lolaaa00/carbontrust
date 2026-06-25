import { GENLAYER_CHAIN } from "@/lib/wallet/chains";

export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getExplorerUrl(type: "tx" | "address" | "contract", hash: string): string {
  return `${GENLAYER_CHAIN.explorerUrl}/${type}/${hash}`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
