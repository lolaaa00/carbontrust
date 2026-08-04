"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createAccount } from "genlayer-js";
import { createReadClient, createWriteClient, createGeneratedWriteClient } from "@/lib/wallet/config";
import { GENLAYER_CHAIN } from "@/lib/wallet/chains";
import {
  hasGeneratedAccount,
  getOrCreateGeneratedPrivateKey,
  getGeneratedPrivateKey,
  isWarningAcknowledged,
  acknowledgeWarning,
  importGeneratedPrivateKey,
} from "@/lib/wallet/generated-account";

type GenLayerClient = ReturnType<typeof createReadClient>;
type GenLayerWriteClient = ReturnType<typeof createWriteClient>;

export type WalletMode = "none" | "injected" | "generated";

interface WalletContextValue {
  address: `0x${string}` | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  mode: WalletMode;
  hasInjectedWallet: boolean;
  needsWarningAck: boolean;
  readClient: GenLayerClient;
  writeClient: GenLayerWriteClient | null;
  connect: () => Promise<void>;
  connectGenerated: () => void;
  acknowledgeGeneratedWarning: () => void;
  exportPrivateKey: () => string | null;
  importPrivateKey: (key: string) => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

let readClientSingleton: GenLayerClient | null = null;

function getReadClient(): GenLayerClient {
  if (!readClientSingleton) {
    readClientSingleton = createReadClient();
  }
  return readClientSingleton;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [writeClient, setWriteClient] = useState<GenLayerWriteClient | null>(null);
  const [mode, setMode] = useState<WalletMode>("none");
  const [needsWarningAck, setNeedsWarningAck] = useState(false);
  const [readClient] = useState<GenLayerClient>(() => getReadClient());

  const hasEthereum = typeof window !== "undefined" && !!window.ethereum;

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setWriteClient(null);
    setMode("none");
  }, []);

  const loadGeneratedAccount = useCallback((privateKey: `0x${string}`) => {
    const account = createAccount(privateKey);
    setAddress(account.address as `0x${string}`);
    setChainId(GENLAYER_CHAIN.id);
    setWriteClient(createGeneratedWriteClient(privateKey));
    setMode("generated");
  }, []);

  const connectGenerated = useCallback(() => {
    if (!isWarningAcknowledged()) {
      setNeedsWarningAck(true);
      return;
    }
    const pk = getOrCreateGeneratedPrivateKey();
    loadGeneratedAccount(pk);
  }, [loadGeneratedAccount]);

  const acknowledgeGeneratedWarning = useCallback(() => {
    acknowledgeWarning();
    setNeedsWarningAck(false);
    const pk = getOrCreateGeneratedPrivateKey();
    loadGeneratedAccount(pk);
  }, [loadGeneratedAccount]);

  const exportPrivateKey = useCallback((): string | null => {
    return getGeneratedPrivateKey();
  }, []);

  const importPrivateKey = useCallback(
    (key: string) => {
      const pk = importGeneratedPrivateKey(key);
      loadGeneratedAccount(pk);
    },
    [loadGeneratedAccount],
  );

  // Never silently regenerate: only resume a generated session that was
  // already created and acknowledged in this browser.
  useEffect(() => {
    if (hasEthereum) return;
    if (mode !== "none") return;
    if (hasGeneratedAccount() && isWarningAcknowledged()) {
      const pk = getGeneratedPrivateKey();
      if (pk) loadGeneratedAccount(pk);
    }
  }, [hasEthereum, mode, loadGeneratedAccount]);

  const connect = useCallback(async () => {
    if (!hasEthereum) {
      throw new Error("No injected wallet detected. Please install a Web3 wallet extension.");
    }

    setIsConnecting(true);
    try {
      const accounts = (await window.ethereum!.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from wallet.");
      }

      const addr = accounts[0] as `0x${string}`;
      const client = createWriteClient(addr, window.ethereum!);

      // Switch wallet to GenLayer StudioNet
      const targetChainIdHex = `0x${GENLAYER_CHAIN.id.toString(16)}`;
      try {
        await window.ethereum!.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainIdHex }],
        });
      } catch {
        await window.ethereum!.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: targetChainIdHex,
              chainName: GENLAYER_CHAIN.name,
              nativeCurrency: GENLAYER_CHAIN.currency,
              rpcUrls: [GENLAYER_CHAIN.rpcUrl],
              blockExplorerUrls: [GENLAYER_CHAIN.explorerUrl],
            },
          ],
        });
      }

      const currentChainId = (await window.ethereum!.request({
        method: "eth_chainId",
      })) as string;

      setAddress(addr);
      setChainId(parseInt(currentChainId, 16));
      setWriteClient(client);
      setMode("injected");
    } finally {
      setIsConnecting(false);
    }
  }, [hasEthereum]);

  // Listen for account and chain changes
  useEffect(() => {
    if (!hasEthereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (!accounts || accounts.length === 0) {
        disconnect();
      } else {
        const newAddr = accounts[0] as `0x${string}`;
        setAddress(newAddr);
        const client = createWriteClient(newAddr, window.ethereum!);
        setWriteClient(client);
        setMode("injected");
      }
    };

    const handleChainChanged = (...args: unknown[]) => {
      const newChainId = args[0] as string;
      setChainId(parseInt(newChainId, 16));
    };

    window.ethereum!.on("accountsChanged", handleAccountsChanged);
    window.ethereum!.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum!.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum!.removeListener("chainChanged", handleChainChanged);
    };
  }, [hasEthereum, disconnect]);

  // Check for existing connection on mount
  useEffect(() => {
    if (!hasEthereum) return;

    (async () => {
      try {
        const accounts = (await window.ethereum!.request({
          method: "eth_accounts",
        })) as string[];

        if (accounts && accounts.length > 0) {
          const addr = accounts[0] as `0x${string}`;
          const currentChainId = (await window.ethereum!.request({
            method: "eth_chainId",
          })) as string;

          setAddress(addr);
          setChainId(parseInt(currentChainId, 16));
          setWriteClient(createWriteClient(addr, window.ethereum!));
          setMode("injected");
        }
      } catch {
        // Silently fail - user hasn't connected yet
      }
    })();
  }, [hasEthereum]);

  const value: WalletContextValue = {
    address,
    chainId,
    isConnected: !!address,
    isConnecting,
    mode,
    hasInjectedWallet: hasEthereum,
    needsWarningAck,
    readClient,
    writeClient,
    connect,
    connectGenerated,
    acknowledgeGeneratedWarning,
    exportPrivateKey,
    importPrivateKey,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
