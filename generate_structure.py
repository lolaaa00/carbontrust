"""
CarbonTrust Protocol - Project Structure Generator
Generates the complete folder structure and starter files.
Run: python generate_structure.py
"""

from pathlib import Path

BASE = Path(__file__).parent

def write_file(rel_path: str, content: str):
    path = BASE / rel_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"  Created: {rel_path}")

def create_gitkeep(rel_path: str):
    path = BASE / rel_path
    path.mkdir(parents=True, exist_ok=True)
    (path / ".gitkeep").write_text("", encoding="utf-8")

# ─── Package & Config Files ───

write_file("package.json", r"""
{
  "name": "carbontrust",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "@rainbow-me/rainbowkit": "^2.2.5",
    "@tanstack/react-query": "^5.74.4",
    "wagmi": "^2.15.4",
    "viem": "^2.28.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.2.0",
    "lucide-react": "^0.487.0",
    "react-hook-form": "^7.56.0",
    "@hookform/resolvers": "^5.0.1",
    "zod": "^3.24.4",
    "recharts": "^2.15.3",
    "next-themes": "^0.4.6",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-dialog": "^1.1.10",
    "@radix-ui/react-select": "^2.2.2",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@radix-ui/react-separator": "^1.1.4",
    "@radix-ui/react-progress": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.10",
    "@radix-ui/react-label": "^2.1.4"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "@types/node": "^22.15.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/postcss": "^4.1.0",
    "eslint": "^9.25.0",
    "eslint-config-next": "^15.3.0",
    "@tailwindcss/typography": "^0.5.16"
  }
}
""")

write_file("tsconfig.json", r"""
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
""")

write_file("next.config.ts", r"""
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
""")

write_file("tailwind.config.ts", r"""
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFBEB",
        },
        success: {
          DEFAULT: "#16A34A",
          foreground: "#F0FDF4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
""")

write_file("postcss.config.mjs", r"""
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
""")

write_file("components.json", r"""
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/lib/wallet"
  },
  "iconLibrary": "lucide"
}
""")

# ─── Environment Files ───

write_file(".env.example", r"""
# CarbonTrust Protocol Environment Variables

# GenLayer StudioNet Configuration
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio-rpc.genlayer.com
NEXT_PUBLIC_GENLAYER_CHAIN_ID=61_999
NEXT_PUBLIC_GENLAYER_EXPLORER_URL=https://studio-explorer.genlayer.com

# Deployed Contract Address (set after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=

# WalletConnect Project ID (get from cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
""")

write_file(".env.local", r"""
# CarbonTrust Protocol - Local Development

NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio-rpc.genlayer.com
NEXT_PUBLIC_GENLAYER_CHAIN_ID=61_999
NEXT_PUBLIC_GENLAYER_EXPLORER_URL=https://studio-explorer.genlayer.com
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
""")

# ─── .gitignore ───

write_file(".gitignore", r"""
# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# python
__pycache__/
*.pyc
""")

# ─── App: Root Layout & Pages ───

write_file("src/app/globals.css", r"""
@import "tailwindcss";

@theme {
  --color-background: hsl(0 0% 98%);
  --color-foreground: hsl(222.2 84% 4.9%);
  --color-card: hsl(0 0% 100%);
  --color-card-foreground: hsl(222.2 84% 4.9%);
  --color-popover: hsl(0 0% 100%);
  --color-popover-foreground: hsl(222.2 84% 4.9%);
  --color-primary: hsl(175 77% 26%);
  --color-primary-foreground: hsl(166 76% 97%);
  --color-secondary: hsl(210 40% 96.1%);
  --color-secondary-foreground: hsl(222.2 47.4% 11.2%);
  --color-muted: hsl(210 40% 96.1%);
  --color-muted-foreground: hsl(215.4 16.3% 46.9%);
  --color-accent: hsl(174 60% 51%);
  --color-accent-foreground: hsl(222.2 47.4% 11.2%);
  --color-destructive: hsl(0 84.2% 60.2%);
  --color-destructive-foreground: hsl(210 40% 98%);
  --color-border: hsl(214.3 31.8% 91.4%);
  --color-input: hsl(214.3 31.8% 91.4%);
  --color-ring: hsl(175 77% 26%);
  --radius: 0.75rem;
}

.dark {
  --color-background: hsl(222.2 84% 4.9%);
  --color-foreground: hsl(210 40% 98%);
  --color-card: hsl(222.2 84% 6.9%);
  --color-card-foreground: hsl(210 40% 98%);
  --color-popover: hsl(222.2 84% 6.9%);
  --color-popover-foreground: hsl(210 40% 98%);
  --color-primary: hsl(174 60% 51%);
  --color-primary-foreground: hsl(222.2 84% 4.9%);
  --color-secondary: hsl(217.2 32.6% 17.5%);
  --color-secondary-foreground: hsl(210 40% 98%);
  --color-muted: hsl(217.2 32.6% 17.5%);
  --color-muted-foreground: hsl(215 20.2% 65.1%);
  --color-accent: hsl(175 77% 26%);
  --color-accent-foreground: hsl(210 40% 98%);
  --color-destructive: hsl(0 62.8% 30.6%);
  --color-destructive-foreground: hsl(210 40% 98%);
  --color-border: hsl(217.2 32.6% 17.5%);
  --color-input: hsl(217.2 32.6% 17.5%);
  --color-ring: hsl(174 60% 51%);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
""")

write_file("src/app/layout.tsx", r"""
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "CarbonTrust - Decentralized Environmental Intelligence",
    template: "%s | CarbonTrust",
  },
  description:
    "Decentralized Environmental Intelligence & Carbon Impact Consensus Network powered by GenLayer.",
  keywords: [
    "carbon credits",
    "environmental intelligence",
    "GenLayer",
    "blockchain",
    "consensus",
    "ESG",
    "climate",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
""")

write_file("src/app/providers.tsx", r"""
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
""")

write_file("src/app/page.tsx", r"""
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Carbon<span className="text-primary">Trust</span>
      </h1>
      <p className="mt-6 max-w-2xl text-center text-lg text-muted-foreground">
        Decentralized Environmental Intelligence &amp; Carbon Impact Consensus Network.
        Transform uncertain environmental evidence into transparent, confidence-scored
        impact assessments using GenLayer AI consensus.
      </p>
      <div className="mt-10 flex gap-4">
        <a
          href="/dashboard"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 transition"
        >
          Launch App
        </a>
        <a
          href="/explore"
          className="rounded-lg border border-border px-6 py-3 text-sm font-semibold hover:bg-muted transition"
        >
          Explore Projects
        </a>
      </div>
    </div>
  );
}
""")

write_file("src/app/loading.tsx", r"""
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
""")

write_file("src/app/not-found.tsx", r"""
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
""")

write_file("src/app/error.tsx", r"""
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
      >
        Try Again
      </button>
    </div>
  );
}
""")

# ─── App: Route Pages ───

write_file("src/app/dashboard/page.tsx", r"""
export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Your environmental assessment projects.</p>
    </div>
  );
}
""")

write_file("src/app/dashboard/loading.tsx", r"""
export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}
""")

write_file("src/app/projects/new/page.tsx", r"""
export default function NewProjectPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold">Create Assessment Case</h1>
      <p className="mt-2 text-muted-foreground">
        Submit a new environmental project for AI consensus assessment.
      </p>
    </div>
  );
}
""")

write_file("src/app/projects/[id]/page.tsx", r"""
export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Project Detail</h1>
    </div>
  );
}
""")

write_file("src/app/projects/[id]/loading.tsx", r"""
export default function ProjectLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-96 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
""")

write_file("src/app/projects/[id]/evidence/page.tsx", r"""
export default function EvidencePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold">Submit Evidence</h1>
      <p className="mt-2 text-muted-foreground">
        Add evidence to support the environmental assessment.
      </p>
    </div>
  );
}
""")

write_file("src/app/projects/[id]/assessment/page.tsx", r"""
export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Environmental Assessment</h1>
      <p className="mt-2 text-muted-foreground">
        AI consensus assessment results for this project.
      </p>
    </div>
  );
}
""")

write_file("src/app/explore/page.tsx", r"""
export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Explore Projects</h1>
      <p className="mt-2 text-muted-foreground">
        Browse all environmental assessment projects.
      </p>
    </div>
  );
}
""")

write_file("src/app/explore/loading.tsx", r"""
export default function ExploreLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}
""")

write_file("src/app/consensus/[id]/page.tsx", r"""
export default function ConsensusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Consensus Detail</h1>
    </div>
  );
}
""")

write_file("src/app/settings/page.tsx", r"""
export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-muted-foreground">Manage your wallet and preferences.</p>
    </div>
  );
}
""")

# ─── Components: Layout ───

write_file("src/components/layout/navbar.tsx", r"""
"use client";

import Link from "next/link";
import { ConnectButton } from "@/components/wallet/connect-button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Carbon<span className="text-primary">Trust</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition">
            Explore
          </Link>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition">
            Dashboard
          </Link>
        </nav>
        <ConnectButton />
      </div>
    </header>
  );
}
""")

write_file("src/components/layout/footer.tsx", r"""
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-sm text-muted-foreground md:flex-row md:justify-between">
        <p>&copy; {new Date().getFullYear()} CarbonTrust Protocol. Powered by GenLayer.</p>
        <nav className="flex gap-6">
          <Link href="/explore" className="hover:text-foreground transition">Explore</Link>
          <Link href="/dashboard" className="hover:text-foreground transition">Dashboard</Link>
        </nav>
      </div>
    </footer>
  );
}
""")

write_file("src/components/layout/sidebar.tsx", r"""
"use client";

export function Sidebar() {
  return null;
}
""")

write_file("src/components/layout/mobile-nav.tsx", r"""
"use client";

export function MobileNav() {
  return null;
}
""")

# ─── Components: Wallet ───

write_file("src/components/wallet/connect-button.tsx", r"""
"use client";

export function ConnectButton() {
  return (
    <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
      Connect Wallet
    </button>
  );
}
""")

write_file("src/components/wallet/wallet-provider.tsx", r"""
"use client";

import { ReactNode } from "react";

export function WalletProvider({ children }: { children: ReactNode }) {
  // Will be replaced with wagmi + RainbowKit providers in Phase 10
  return <>{children}</>;
}
""")

write_file("src/components/wallet/wallet-guard.tsx", r"""
"use client";

import { ReactNode } from "react";

export function WalletGuard({ children }: { children: ReactNode }) {
  // Will enforce wallet connection in Phase 10
  return <>{children}</>;
}
""")

# ─── Components: Project ───

write_file("src/components/project/project-card.tsx", r"""
"use client";

export function ProjectCard() {
  return <div className="rounded-lg border bg-card p-6">Project Card</div>;
}
""")

write_file("src/components/project/project-form.tsx", r"""
"use client";

export function ProjectForm() {
  return <div>Project Form</div>;
}
""")

write_file("src/components/project/project-status-badge.tsx", r"""
export function ProjectStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
      {status}
    </span>
  );
}
""")

write_file("src/components/project/project-overview.tsx", r"""
"use client";

export function ProjectOverview() {
  return <div>Project Overview</div>;
}
""")

write_file("src/components/project/project-list.tsx", r"""
"use client";

export function ProjectList() {
  return <div>Project List</div>;
}
""")

# ─── Components: Evidence ───

write_file("src/components/evidence/evidence-form.tsx", r"""
"use client";

export function EvidenceForm() {
  return <div>Evidence Form</div>;
}
""")

write_file("src/components/evidence/evidence-card.tsx", r"""
"use client";

export function EvidenceCard() {
  return <div className="rounded-lg border bg-card p-4">Evidence Card</div>;
}
""")

write_file("src/components/evidence/evidence-list.tsx", r"""
"use client";

export function EvidenceList() {
  return <div>Evidence List</div>;
}
""")

write_file("src/components/evidence/evidence-type-badge.tsx", r"""
export function EvidenceTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
      {type.replace(/_/g, " ")}
    </span>
  );
}
""")

write_file("src/components/evidence/hash-generator.tsx", r"""
"use client";

export function HashGenerator() {
  return <div>Hash Generator</div>;
}
""")

# ─── Components: Consensus ───

write_file("src/components/consensus/consensus-summary.tsx", r"""
"use client";

export function ConsensusSummary() {
  return <div>Consensus Summary</div>;
}
""")

write_file("src/components/consensus/confidence-gauge.tsx", r"""
"use client";

export function ConfidenceGauge({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-medium">{score}%</span>
    </div>
  );
}
""")

write_file("src/components/consensus/risk-indicator.tsx", r"""
export function RiskIndicator({ level, label }: { level: string; label: string }) {
  const colors: Record<string, string> = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    critical: "bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-100",
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[level] || colors.medium}`}>
        {level}
      </span>
    </div>
  );
}
""")

write_file("src/components/consensus/carbon-range-display.tsx", r"""
"use client";

export function CarbonRangeDisplay({
  low,
  high,
  likely,
}: {
  low: number;
  high: number;
  likely: number;
}) {
  const pct = high > low ? ((likely - low) / (high - low)) * 100 : 50;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{low.toLocaleString()} tCO2e</span>
        <span>{high.toLocaleString()} tCO2e</span>
      </div>
      <div className="relative h-3 rounded-full bg-muted">
        <div className="absolute h-3 rounded-full bg-primary/30" style={{ width: "100%" }} />
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background"
          style={{ left: `${pct}%` }}
        />
      </div>
      <p className="text-center text-sm font-semibold">
        Most Likely: {likely.toLocaleString()} tCO2e
      </p>
    </div>
  );
}
""")

write_file("src/components/consensus/biodiversity-score.tsx", r"""
export function BiodiversityScore({
  impact,
  confidence,
}: {
  impact: string;
  confidence: number;
}) {
  const colors: Record<string, string> = {
    positive: "text-green-600 dark:text-green-400",
    neutral: "text-gray-500",
    negative: "text-red-600 dark:text-red-400",
    uncertain: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="space-y-1">
      <span className="text-xs text-muted-foreground">Biodiversity Impact</span>
      <p className={`text-sm font-semibold capitalize ${colors[impact] || ""}`}>{impact}</p>
      <p className="text-xs text-muted-foreground">Confidence: {confidence}%</p>
    </div>
  );
}
""")

write_file("src/components/consensus/consensus-history.tsx", r"""
"use client";

export function ConsensusHistory() {
  return <div>Consensus History</div>;
}
""")

write_file("src/components/consensus/consensus-detail-card.tsx", r"""
"use client";

export function ConsensusDetailCard() {
  return <div>Consensus Detail Card</div>;
}
""")

# ─── Components: Dashboard ───

write_file("src/components/dashboard/stats-overview.tsx", r"""
"use client";

export function StatsOverview() {
  return <div>Stats Overview</div>;
}
""")

write_file("src/components/dashboard/recent-activity.tsx", r"""
"use client";

export function RecentActivity() {
  return <div>Recent Activity</div>;
}
""")

write_file("src/components/dashboard/project-status-grid.tsx", r"""
"use client";

export function ProjectStatusGrid() {
  return <div>Project Status Grid</div>;
}
""")

# ─── Components: Shared ───

write_file("src/components/shared/page-header.tsx", r"""
export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
    </div>
  );
}
""")

write_file("src/components/shared/empty-state.tsx", r"""
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
""")

write_file("src/components/shared/loading-skeleton.tsx", r"""
export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className || "h-4 w-full"}`} />;
}
""")

write_file("src/components/shared/error-boundary.tsx", r"""
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <p className="p-4 text-destructive">Something went wrong.</p>;
    }
    return this.props.children;
  }
}
""")

write_file("src/components/shared/transaction-status.tsx", r"""
"use client";

type TxStatus = "idle" | "simulating" | "awaiting_signature" | "pending" | "confirming" | "success" | "failed" | "rejected";

export function TransactionStatus({
  status,
  hash,
  error,
}: {
  status: TxStatus;
  hash?: string;
  error?: string;
}) {
  if (status === "idle") return null;

  const messages: Record<TxStatus, string> = {
    idle: "",
    simulating: "Preparing transaction...",
    awaiting_signature: "Please confirm in your wallet...",
    pending: "Transaction submitted. Waiting for confirmation...",
    confirming: "Confirming transaction...",
    success: "Transaction confirmed!",
    failed: error || "Transaction failed.",
    rejected: "Transaction cancelled.",
  };

  const colors: Record<string, string> = {
    success: "text-green-600 dark:text-green-400",
    failed: "text-red-600 dark:text-red-400",
    rejected: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div className={`text-sm ${colors[status] || "text-muted-foreground"}`}>
      <p>{messages[status]}</p>
      {hash && (
        <p className="mt-1 font-mono text-xs">
          Tx: {hash.slice(0, 10)}...{hash.slice(-8)}
        </p>
      )}
    </div>
  );
}
""")

write_file("src/components/shared/explorer-link.tsx", r"""
import { ExternalLink } from "lucide-react";

export function ExplorerLink({
  hash,
  type = "tx",
  label,
}: {
  hash: string;
  type?: "tx" | "address" | "contract";
  label?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_GENLAYER_EXPLORER_URL || "";
  const url = `${baseUrl}/${type}/${hash}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
    >
      {label || `${hash.slice(0, 8)}...${hash.slice(-6)}`}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
""")

write_file("src/components/shared/copy-button.tsx", r"""
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center rounded p-1 text-muted-foreground hover:text-foreground transition"
      title="Copy to clipboard"
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
""")

# ─── Lib: Wallet ───

write_file("src/lib/wallet/chains.ts", r"""
// GenLayer StudioNet chain definition
// Values will be finalized after deployment (Phase 14)

export const genlayerStudioNet = {
  id: Number(process.env.NEXT_PUBLIC_GENLAYER_CHAIN_ID) || 61999,
  name: "GenLayer StudioNet",
  nativeCurrency: {
    name: "GEN",
    symbol: "GEN",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || "https://studio-rpc.genlayer.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "GenLayer Explorer",
      url: process.env.NEXT_PUBLIC_GENLAYER_EXPLORER_URL || "https://studio-explorer.genlayer.com",
    },
  },
  testnet: true,
} as const;
""")

write_file("src/lib/wallet/config.ts", r"""
// wagmi configuration - will be fully wired in Phase 10
export const walletConfig = {
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
};
""")

write_file("src/lib/wallet/provider.tsx", r"""
// Re-export from component for convenience
export { WalletProvider } from "@/components/wallet/wallet-provider";
""")

write_file("src/lib/wallet/hooks.ts", r"""
// Wallet hooks - will be implemented in Phase 10
export function useWalletGuard() {
  return { isConnected: false, isCorrectNetwork: false };
}

export function useContractTransaction() {
  return { status: "idle" as const, hash: undefined, error: undefined, execute: async () => {} };
}
""")

write_file("src/lib/wallet/utils.ts", r"""
export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getExplorerUrl(type: "tx" | "address" | "contract", hash: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_GENLAYER_EXPLORER_URL || "";
  return `${baseUrl}/${type}/${hash}`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
""")

# ─── Lib: Contract ───

write_file("src/lib/contract/abi.ts", r"""
// Contract ABI - will be generated from deployed contract in Phase 15
export const CARBON_TRUST_ABI = [] as const;
""")

write_file("src/lib/contract/address.ts", r"""
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
""")

write_file("src/lib/contract/reads.ts", r"""
// Contract read functions - will be implemented in Phase 10
export async function getProject(projectId: number) {
  return null;
}

export async function getProjectEvidence(projectId: number) {
  return [];
}

export async function getProjectAssessment(projectId: number) {
  return null;
}

export async function getAssessmentHistory(projectId: number) {
  return [];
}

export async function getProjectCount() {
  return 0;
}

export async function getProjectsByOwner(ownerAddress: string) {
  return [];
}
""")

write_file("src/lib/contract/writes.ts", r"""
// Contract write functions - will be implemented in Phase 10
export async function createProject(params: Record<string, string>) {
  return null;
}

export async function addEvidence(params: Record<string, string>) {
  return null;
}

export async function requestReview(projectId: number) {
  return null;
}
""")

write_file("src/lib/contract/types.ts", r"""
export type TransactionStatus =
  | "idle"
  | "simulating"
  | "awaiting_signature"
  | "pending"
  | "confirming"
  | "success"
  | "failed"
  | "rejected";
""")

# ─── Lib: Utils ───

write_file("src/lib/utils/formatting.ts", r"""
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatCarbonTons(value: number): string {
  return `${formatNumber(value)} tCO2e`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTimestamp(isoDate: string): string {
  return new Date(isoDate).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
""")

write_file("src/lib/utils/validation.ts", r"""
import { z } from "zod";
import { VALID_PROJECT_TYPES } from "@/lib/constants/project-types";
import { VALID_EVIDENCE_TYPES } from "@/lib/constants/evidence-types";

export const projectFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  project_type: z.enum(VALID_PROJECT_TYPES as [string, ...string[]]),
  location: z.string().min(2).max(1000),
  project_owner_name: z.string().min(2).max(200),
  assessment_objective: z.string().min(10).max(1000),
  claimed_carbon_impact: z.string().min(5).max(1000),
  claimed_biodiversity_impact: z.string().min(5).max(1000),
  monitoring_period: z.string().min(2).max(200),
  evidence_summary: z.string().min(10).max(1000),
});

export const evidenceFormSchema = z.object({
  evidence_type: z.enum(VALID_EVIDENCE_TYPES as [string, ...string[]]),
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  url: z.string().url("Must be a valid URL").refine((u) => u.startsWith("https://"), {
    message: "URL must use HTTPS",
  }),
  description: z.string().min(10).max(1000),
  content_hash: z
    .string()
    .regex(/^([a-fA-F0-9]{64}|Qm[a-zA-Z0-9]{44}|bafy[a-zA-Z0-9]+)?$/, "Invalid hash format")
    .optional()
    .or(z.literal("")),
  source_name: z.string().min(2).max(200),
  date_produced: z.string().date("Must be a valid date").refine(
    (d) => new Date(d) <= new Date(),
    { message: "Date cannot be in the future" }
  ),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
export type EvidenceFormData = z.infer<typeof evidenceFormSchema>;
""")

write_file("src/lib/utils/hash.ts", r"""
export async function generateSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
""")

# ─── Lib: Constants ───

write_file("src/lib/constants/project-types.ts", r"""
export const VALID_PROJECT_TYPES = [
  "reforestation",
  "conservation",
  "renewable_energy",
  "blue_carbon",
  "soil_carbon",
  "avoided_deforestation",
  "methane_reduction",
  "sustainable_agriculture",
  "wetland_restoration",
  "urban_greening",
  "other",
] as const;

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  reforestation: "Reforestation",
  conservation: "Conservation",
  renewable_energy: "Renewable Energy",
  blue_carbon: "Blue Carbon (Mangroves, Seagrass)",
  soil_carbon: "Soil Carbon Sequestration",
  avoided_deforestation: "Avoided Deforestation (REDD+)",
  methane_reduction: "Methane Reduction",
  sustainable_agriculture: "Sustainable Agriculture",
  wetland_restoration: "Wetland Restoration",
  urban_greening: "Urban Greening",
  other: "Other",
};
""")

write_file("src/lib/constants/evidence-types.ts", r"""
export const VALID_EVIDENCE_TYPES = [
  "satellite_imagery",
  "drone_imagery",
  "environmental_report",
  "iot_sensor_data",
  "government_permit",
  "land_use_record",
  "biodiversity_survey",
  "community_observation",
  "carbon_methodology",
  "third_party_audit",
] as const;

export const EVIDENCE_TYPE_LABELS: Record<string, string> = {
  satellite_imagery: "Satellite Imagery",
  drone_imagery: "Drone Imagery",
  environmental_report: "Environmental Report",
  iot_sensor_data: "IoT Sensor Data",
  government_permit: "Government Permit",
  land_use_record: "Land Use Record",
  biodiversity_survey: "Biodiversity Survey",
  community_observation: "Community Observation",
  carbon_methodology: "Carbon Methodology",
  third_party_audit: "Third-Party Audit",
};

export const EVIDENCE_TYPE_COLORS: Record<string, string> = {
  satellite_imagery: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  drone_imagery: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  environmental_report: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  iot_sensor_data: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  government_permit: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  land_use_record: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  biodiversity_survey: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  community_observation: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  carbon_methodology: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
  third_party_audit: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
};
""")

write_file("src/lib/constants/risk-levels.ts", r"""
export const RISK_COLORS: Record<string, string> = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  critical: "bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-100",
};

export const QUALITY_COLORS: Record<string, string> = {
  high: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  moderate: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  low: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  insufficient: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export const ADDITIONALITY_COLORS: Record<string, string> = {
  likely: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  unlikely: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  uncertain: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

export const BIODIVERSITY_COLORS: Record<string, string> = {
  positive: "text-green-600 dark:text-green-400",
  neutral: "text-gray-500",
  negative: "text-red-600 dark:text-red-400",
  uncertain: "text-amber-600 dark:text-amber-400",
};
""")

write_file("src/lib/constants/scoring.ts", r"""
export function getConfidenceLabel(score: number): string {
  if (score >= 90) return "Very High";
  if (score >= 75) return "High";
  if (score >= 50) return "Moderate";
  if (score >= 25) return "Low";
  return "Very Low";
}

export function getConfidenceColor(score: number): string {
  if (score >= 90) return "text-green-600 dark:text-green-400";
  if (score >= 75) return "text-teal-600 dark:text-teal-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  if (score >= 25) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

export function getConfidenceBarColor(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 75) return "bg-teal-500";
  if (score >= 50) return "bg-amber-500";
  if (score >= 25) return "bg-orange-500";
  return "bg-red-500";
}
""")

# ─── Types ───

write_file("src/types/project.ts", r"""
export interface Project {
  id: number;
  owner: string;
  title: string;
  project_type: string;
  location: string;
  project_owner_name: string;
  assessment_objective: string;
  claimed_carbon_impact: string;
  claimed_biodiversity_impact: string;
  monitoring_period: string;
  evidence_summary: string;
  status: ProjectStatus;
  evidence_count: number;
  assessment_count: number;
  created_at: string;
}

export type ProjectStatus = "created" | "evidence_submitted" | "review_requested" | "assessed";
""")

write_file("src/types/evidence.ts", r"""
export interface Evidence {
  evidence_id: number;
  submitter: string;
  evidence_type: EvidenceType;
  title: string;
  url: string;
  description: string;
  content_hash: string;
  source_name: string;
  date_produced: string;
  timestamp: string;
}

export type EvidenceType =
  | "satellite_imagery"
  | "drone_imagery"
  | "environmental_report"
  | "iot_sensor_data"
  | "government_permit"
  | "land_use_record"
  | "biodiversity_survey"
  | "community_observation"
  | "carbon_methodology"
  | "third_party_audit";
""")

write_file("src/types/assessment.ts", r"""
export interface Assessment {
  assessment_id: number;
  carbon_estimate_low: number;
  carbon_estimate_high: number;
  carbon_estimate_likely: number;
  confidence_score: number;
  additionality: "likely" | "unlikely" | "uncertain";
  environmental_risk: "low" | "medium" | "high" | "critical";
  evidence_quality: "high" | "moderate" | "low" | "insufficient";
  fraud_risk: "low" | "medium" | "high";
  permanence_confidence: number;
  biodiversity_impact: "positive" | "neutral" | "negative" | "uncertain";
  biodiversity_confidence: number;
  recommended_action: string;
  reasoning: string;
  timestamp: string;
}
""")

write_file("src/types/contract.ts", r"""
export type TransactionStatus =
  | "idle"
  | "simulating"
  | "awaiting_signature"
  | "pending"
  | "confirming"
  | "success"
  | "failed"
  | "rejected";

export interface TransactionState {
  status: TransactionStatus;
  hash?: string;
  error?: string;
}
""")

# ─── Contract ───

write_file("contracts/carbon_trust_protocol.py", r"""
# CarbonTrust Protocol - GenLayer Intelligent Contract
# This file will be fully implemented in Phase 11
# Placeholder structure only

# from genlayer.py import gl

class CarbonTrustProtocol:
    pass
""")

# ─── Tests ───

write_file("tests/contract/test_carbon_trust.py", r"""
# CarbonTrust Protocol - Contract Tests
# Will be implemented in Phase 12
""")

create_gitkeep("tests/frontend")

# ─── Docs ───

write_file("docs/ARCHITECTURE.md", r"""
# CarbonTrust Protocol - Architecture

## Overview
CarbonTrust is a decentralized environmental intelligence platform powered by GenLayer
Intelligent Contracts and AI consensus.

## Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Wallet**: wagmi v2, RainbowKit, viem
- **Contract**: GenLayer Intelligent Contract (Python)
- **Deployment**: Vercel (frontend), StudioNet (contract)

## Architecture
- No backend server
- No centralized database
- Contract is the canonical source of truth
- Frontend reads/writes contract state via wallet
""")

write_file("docs/DEPLOYMENT.md", r"""
# CarbonTrust Protocol - Deployment Guide

## Frontend (Vercel)
1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy

## Contract (StudioNet)
1. Open GenLayer Studio
2. Load `contracts/carbon_trust_protocol.py`
3. Deploy to StudioNet
4. Copy deployed address
5. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in Vercel env vars

## Environment Variables
See `.env.example` for all required variables.
""")

write_file("docs/CONTRACT.md", r"""
# CarbonTrust Protocol - Contract Reference

## Methods

### Write Methods
- `create_project(...)` - Create a new assessment case
- `add_evidence(...)` - Submit evidence to a project
- `request_review(project_id)` - Trigger AI consensus review

### Read Methods
- `get_project(project_id)` - Get project details
- `get_project_evidence(project_id)` - Get all evidence for a project
- `get_project_assessment(project_id)` - Get latest assessment
- `get_assessment_history(project_id)` - Get all assessments
- `get_project_count()` - Get total project count
- `get_projects_by_owner(owner)` - Get projects by owner address
""")

# ─── Public ───

create_gitkeep("public/images")

# ─── README ───

write_file("README.md", r"""
# CarbonTrust Protocol

Decentralized Environmental Intelligence & Carbon Impact Consensus Network.

## Overview
CarbonTrust transforms uncertain environmental evidence into transparent,
confidence-scored environmental impact assessments using GenLayer AI consensus.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Setup
Copy `.env.example` to `.env.local` and fill in the values.

## Stack
- Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- wagmi v2 + RainbowKit + viem
- GenLayer Intelligent Contract (Python)
- Vercel (frontend) + StudioNet (contract)

## License
MIT
""")

print("\n✅ CarbonTrust Protocol structure generated successfully!")
print(f"   Root: {BASE}")
print("   Next: run 'npm install' to install dependencies")
