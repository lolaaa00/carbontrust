"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { WalletProvider } from "@/components/wallet/wallet-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <WalletProvider>{children}</WalletProvider>
    </ThemeProvider>
  );
}
