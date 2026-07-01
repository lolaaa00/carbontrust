"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";
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

  useEffect(() => { onClose(); }, [pathname, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        pointerEvents: open ? "auto" : "none",
      }}
      className="md:hidden"
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(7,45,51,0.7)",
          backdropFilter: "blur(6px)",
          opacity: open ? 1 : 0,
          transition: "opacity 300ms",
        }}
      />

      {/* Panel */}
      <nav
        style={{
          position: "absolute",
          insetBlock: 0,
          right: 0,
          width: "75%",
          maxWidth: "320px",
          background: "var(--deep-2)",
          borderLeft: "1px solid rgba(58,117,100,0.2)",
          padding: "1.5rem",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms ease-in-out",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "var(--sg)",
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: "var(--ct-text)",
            }}
          >
            CarbonTrust
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--ct-text-2)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              style={{
                fontFamily: "var(--sg)",
                fontSize: "1rem",
                fontWeight: 500,
                padding: "0.625rem 0.75rem",
                borderRadius: "6px",
                textDecoration: "none",
                color:
                  pathname === link.href || pathname?.startsWith(link.href + "/")
                    ? "var(--ct-text)"
                    : "var(--ct-text-2)",
                background:
                  pathname === link.href || pathname?.startsWith(link.href + "/")
                    ? "rgba(58,117,100,0.12)"
                    : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Wallet */}
        <div style={{ borderTop: "1px solid rgba(58,117,100,0.15)", paddingTop: "1rem" }}>
          <ConnectButton />
        </div>
      </nav>
    </div>
  );
}
