"use client";

import { type ReactNode } from "react";
import { Wallet, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/wallet/connect-button";
import { useWallet } from "@/components/wallet/wallet-provider";
import { GENLAYER_CHAIN } from "@/lib/wallet/chains";

interface WalletGuardProps {
  children: ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
  const { isConnected, chainId, connect } = useWallet();

  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">Connect Your Wallet</h2>
            <p className="text-sm text-muted-foreground">
              Connect your wallet to access this feature and interact with the CarbonTrust Protocol.
            </p>
            <ConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (chainId !== null && chainId !== GENLAYER_CHAIN.id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold">Wrong Network</h2>
            <p className="text-sm text-muted-foreground">
              Please switch to {GENLAYER_CHAIN.name} (Chain ID: {GENLAYER_CHAIN.id}) to continue.
            </p>
            <Button onClick={connect}>
              Switch to {GENLAYER_CHAIN.name}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
