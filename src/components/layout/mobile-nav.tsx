"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/wallet/connect-button";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-label="Close menu"
      />

      {/* Panel */}
      <nav
        className={cn(
          "absolute inset-y-0 right-0 w-3/4 max-w-sm border-l bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between mb-8">
          <span className="text-lg font-bold tracking-tight">
            Carbon<span className="text-primary">Trust</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "rounded-md px-3 py-2 text-base font-medium transition-colors",
                pathname === link.href || pathname?.startsWith(link.href + "/")
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t">
          <ConnectButton />
        </div>
      </nav>
    </div>
  );
}
