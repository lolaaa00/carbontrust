import Link from "next/link";
import { CopyButton } from "@/components/shared/copy-button";

const footerLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/docs", label: "Documentation" },
] as const;

export function Footer() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              Carbon<span className="text-primary">Trust</span> Protocol
            </p>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} CarbonTrust. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <nav className="flex gap-6" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contract + Powered by */}
          <div className="space-y-1 text-right">
            {contractAddress && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground md:justify-end">
                <span className="font-mono">
                  {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                </span>
                <CopyButton value={contractAddress} />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-medium">GenLayer</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
