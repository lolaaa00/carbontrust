import { generatePrivateKey, createAccount } from "genlayer-js";

const STORAGE_KEY = "carbontrust.generatedWalletPrivateKey";
const WARNING_ACK_KEY = "carbontrust.generatedWalletWarningAcknowledged";

type Hex = `0x${string}`;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function hasGeneratedAccount(): boolean {
  if (!isBrowser()) return false;
  return !!window.localStorage.getItem(STORAGE_KEY);
}

export function getOrCreateGeneratedPrivateKey(): Hex {
  if (!isBrowser()) {
    throw new Error("Generated wallets are only available in the browser.");
  }

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing as Hex;

  const pk = generatePrivateKey();
  window.localStorage.setItem(STORAGE_KEY, pk);
  return pk;
}

export function getGeneratedPrivateKey(): Hex | null {
  if (!isBrowser()) return null;
  return (window.localStorage.getItem(STORAGE_KEY) as Hex) || null;
}

export function getGeneratedAddress(): Hex | null {
  const pk = getGeneratedPrivateKey();
  if (!pk) return null;
  return createAccount(pk).address as Hex;
}

export function isWarningAcknowledged(): boolean {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(WARNING_ACK_KEY) === "true";
}

export function acknowledgeWarning(): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(WARNING_ACK_KEY, "true");
}

export function exportGeneratedPrivateKey(): Hex | null {
  return getGeneratedPrivateKey();
}

const HEX_KEY_PATTERN = /^0x[0-9a-fA-F]{64}$/;

export function isValidPrivateKey(value: string): value is Hex {
  return HEX_KEY_PATTERN.test(value.trim());
}

/**
 * Overwrites the generated wallet with an imported key. Callers must confirm
 * with the user first — this silently discards any existing generated identity.
 */
export function importGeneratedPrivateKey(privateKey: string): Hex {
  const trimmed = privateKey.trim() as Hex;
  if (!isValidPrivateKey(trimmed)) {
    throw new Error("Invalid private key. Expected a 0x-prefixed 32-byte hex string.");
  }
  if (!isBrowser()) {
    throw new Error("Generated wallets are only available in the browser.");
  }
  window.localStorage.setItem(STORAGE_KEY, trimmed);
  return trimmed;
}

export function clearGeneratedAccount(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
