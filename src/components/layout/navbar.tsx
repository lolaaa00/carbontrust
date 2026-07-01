"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { ConnectButton } from "@/components/wallet/connect-button";
import { MobileNav } from "@/components/layout/mobile-nav";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="ct-nav">
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontFamily: "var(--sg)",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--ct-text)",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          <div className="ct-logo-mark">🌱</div>
          CarbonTrust
        </Link>

        {/* Nav links — hidden on mobile */}
        <ul
          className="ct-nav-links"
          style={{
            display: "flex",
            gap: "2rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color:
                    pathname === link.href || pathname?.startsWith(link.href + "/")
                      ? "var(--ct-text)"
                      : "var(--ct-text-2)",
                  textDecoration: "none",
                  transition: "color 180ms",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display: "flex", gap: "0.875rem", alignItems: "center" }}>
          {/* Network indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ct-text-3)",
            }}
          >
            <span className="ct-ndot" />
            GenLayer StudioNet
          </div>

          {/* Wallet connect */}
          <ConnectButton />

          {/* Mobile hamburger */}
          <button
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "var(--ct-text)",
              cursor: "pointer",
              padding: "0.25rem",
            }}
            className="ct-mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <style>{`
        @media (max-width: 680px) {
          .ct-nav-links { display: none !important; }
          .ct-mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
