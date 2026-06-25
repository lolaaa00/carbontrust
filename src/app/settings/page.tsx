"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { CopyButton } from "@/components/shared/copy-button";
import { ExplorerLink } from "@/components/shared/explorer-link";
import { WalletGuard } from "@/components/wallet/wallet-guard";
import { useWallet } from "@/lib/wallet/hooks";
import { GENLAYER_CHAIN } from "@/lib/wallet/chains";

export default function SettingsPage() {
  const { address, isConnected } = useWallet();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

  return (
    <WalletGuard>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <PageHeader
          title="Settings"
          description="Manage your wallet connection and view network details."
        />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet</CardTitle>
              <CardDescription>Your connected wallet information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={isConnected ? "success" : "secondary"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Address</span>
                {address ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{address}</span>
                    <CopyButton value={address} />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Not connected</span>
                )}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network</span>
                <Badge variant="outline">{GENLAYER_CHAIN.name}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Configuration</CardTitle>
              <CardDescription>GenLayer StudioNet connection details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Chain ID</span>
                <span className="font-mono text-sm">{GENLAYER_CHAIN.id}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">RPC URL</span>
                <span className="max-w-[200px] truncate font-mono text-sm">{GENLAYER_CHAIN.rpcUrl}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Currency</span>
                <span className="text-sm font-medium">{GENLAYER_CHAIN.currency.symbol}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contract</CardTitle>
              <CardDescription>Deployed CarbonTrust Protocol contract.</CardDescription>
            </CardHeader>
            <CardContent>
              {contractAddress ? (
                <div className="flex items-center justify-between">
                  <span className="max-w-[250px] truncate font-mono text-sm">{contractAddress}</span>
                  <div className="flex items-center gap-2">
                    <CopyButton value={contractAddress} />
                    <ExplorerLink hash={contractAddress} type="contract" label="View" />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No contract deployed yet. Set NEXT_PUBLIC_CONTRACT_ADDRESS in your environment.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </WalletGuard>
  );
}
