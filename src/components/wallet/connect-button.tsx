"use client";

import { useState } from "react";
import { Wallet, LogOut, ChevronDown, KeyRound, Download, Upload, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/components/wallet/wallet-provider";
import { truncateAddress } from "@/lib/wallet/utils";
import { CopyButton } from "@/components/shared/copy-button";

export function ConnectButton() {
  const {
    address,
    isConnected,
    isConnecting,
    mode,
    hasInjectedWallet,
    needsWarningAck,
    connect,
    connectGenerated,
    acknowledgeGeneratedWarning,
    exportPrivateKey,
    importPrivateKey,
    disconnect,
  } = useWallet();
  const [showMenu, setShowMenu] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importValue, setImportValue] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  if (needsWarningAck) {
    return (
      <div className="relative z-50 w-full max-w-sm rounded-md border bg-popover p-4 text-sm shadow-md">
        <div className="mb-2 flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Before you continue without a wallet
        </div>
        <p className="mb-3 text-muted-foreground">
          A wallet will be generated and its private key stored in this browser&apos;s
          local storage. It is <strong>not custody-grade</strong>: clearing your site
          data or switching browsers destroys it permanently. You can export a backup
          at any time from the wallet menu.
        </p>
        <Button size="sm" className="w-full" onClick={acknowledgeGeneratedWarning}>
          I understand, continue
        </Button>
      </div>
    );
  }

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
          {mode === "generated" && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              Browser wallet
            </span>
          )}
          <ChevronDown className="h-3 w-3" />
        </Button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => {
                setShowMenu(false);
                setShowExport(false);
                setShowImport(false);
              }}
            />
            <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-md border bg-popover p-1 shadow-md">
              <div className="px-3 py-2 text-xs text-muted-foreground">
                {mode === "generated"
                  ? "Browser-generated wallet. Not custody-grade — export a backup."
                  : "Connected via injected wallet."}
              </div>

              {mode === "generated" && !showExport && !showImport && (
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => setShowExport(true)}
                >
                  <Download className="h-4 w-4" />
                  Export private key
                </button>
              )}

              {mode === "generated" && showExport && (
                <div className="space-y-2 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 truncate rounded bg-muted px-2 py-1 text-[11px]">
                      {exportPrivateKey()}
                    </code>
                    <CopyButton value={exportPrivateKey() || ""} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Anyone with this key controls your wallet. Never share it.
                  </p>
                </div>
              )}

              {mode === "generated" && !showImport && !showExport && (
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => setShowImport(true)}
                >
                  <Upload className="h-4 w-4" />
                  Import a different key
                </button>
              )}

              {mode === "generated" && showImport && (
                <div className="space-y-2 px-3 py-2">
                  <Input
                    placeholder="0x..."
                    value={importValue}
                    onChange={(e) => {
                      setImportValue(e.target.value);
                      setImportError(null);
                    }}
                    className="text-xs"
                  />
                  {importError && <p className="text-[11px] text-destructive">{importError}</p>}
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      try {
                        importPrivateKey(importValue);
                        setImportValue("");
                        setShowImport(false);
                        setShowMenu(false);
                      } catch (err) {
                        setImportError(err instanceof Error ? err.message : "Invalid key.");
                      }
                    }}
                  >
                    Switch to this wallet
                  </Button>
                </div>
              )}

              {mode === "generated" && hasInjectedWallet && (
                <button
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => {
                    setShowMenu(false);
                    connect();
                  }}
                >
                  <Wallet className="h-4 w-4" />
                  Upgrade to injected wallet
                </button>
              )}

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
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setShowMenu(!showMenu)}
        disabled={isConnecting}
      >
        <Wallet className="h-4 w-4" />
        <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
      </Button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-md border bg-popover p-1 shadow-md">
            {hasInjectedWallet && (
              <button
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
                onClick={() => {
                  setShowMenu(false);
                  connect();
                }}
              >
                <Wallet className="h-4 w-4" />
                Use browser extension wallet
              </button>
            )}
            <button
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
              onClick={() => {
                setShowMenu(false);
                connectGenerated();
              }}
            >
              <KeyRound className="h-4 w-4" />
              Continue without a wallet
            </button>
          </div>
        </>
      )}
    </div>
  );
}
