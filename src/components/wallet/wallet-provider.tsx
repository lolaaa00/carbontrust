"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createReadClient, createWriteClient } from "@/lib/wallet/config";
import { GENLAYER_CHAIN } from "@/lib/wallet/chains";

type GenLayerClient = ReturnType<typeof createReadClient>;
type GenLayerWriteClient = ReturnType<typeof createWriteClient>;

interface WalletContextValue {
  address: `0x${string}` | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  readClient: GenLayerClient;
  writeClient: GenLayerWriteClient | null;
  connect: () => Promise<void>;
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
  const [readClient] = useState<GenLayerClient>(() => getReadClient());

  const hasEthereum = typeof window !== "undefined" && !!window.ethereum;

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setWriteClient(null);
  }, []);

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
    readClient,
    writeClient,
    connect,
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
