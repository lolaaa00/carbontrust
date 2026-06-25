"use client";

import { useState } from "react";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/wallet/wallet-provider";
import { truncateAddress } from "@/lib/wallet/utils";

export function ConnectButton() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();
  const [showMenu, setShowMenu] = useState(false);

  if (isConnected && address) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Wallet className="h-4 w-4" />
          <span>{truncateAddress(address)}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-popover p-1 shadow-md">
              <button
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-muted"
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="default"
      size="sm"
      className="gap-2"
      onClick={connect}
      disabled={isConnecting}
    >
      <Wallet className="h-4 w-4" />
      <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
    </Button>
  );
}
