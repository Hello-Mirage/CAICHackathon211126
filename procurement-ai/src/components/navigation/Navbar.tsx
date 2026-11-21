"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Layers, Box, Sun, Moon, ArrowRight, ShieldCheck } from "lucide-react";
import { useProcurementStore } from "@/lib/store";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, setTheme } = useProcurementStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("vinayak_theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    } else {
      setTheme("dark");
    }
  }, [setTheme]);

  const navLinks = [
    { href: "/dashboard", label: "Procure" },
    { href: "/site-3d", label: "3D digital twin" },
  ];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md transition-colors border-b duration-200"
      style={{
        backgroundColor: "var(--bg)",
        borderColor: "var(--line)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Brand */}
        <Link href="/" className="flex items-baseline gap-2.5 group">
          <b className="text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--head)", color: "var(--text)" }}>
            Vinayak Group
          </b>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            Procurement · TerminaLABS
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive ? "var(--raise)" : "transparent",
                  color: isActive ? "var(--text)" : "var(--muted)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & Quick Launch */}
        <div className="flex items-center gap-2.5">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="btn-ghost text-xs"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          )}

          <Link
            href="/dashboard"
            className="btn-solid text-xs hidden sm:inline-block"
          >
            Open Copilot
          </Link>
        </div>
      </div>
    </header>
  );
}
