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
    { href: "/", label: "Overview", icon: Layers },
    { href: "/dashboard", label: "Procurement Copilot", icon: ShieldCheck, badge: "6-Step SOP" },
    { href: "/site-3d", label: "3D Digital Twin", icon: Box, badge: "Isometric" },
  ];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md transition-colors border-b duration-200"
      style={{
        backgroundColor: "var(--bg-canvas)",
        borderColor: "var(--border-muted)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md transition-transform group-hover:scale-105"
            style={{ backgroundColor: "var(--primary-accent)" }}
          >
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight" style={{ color: "var(--text-primary)" }}>
                Vinayak Group
              </span>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border"
                style={{
                  backgroundColor: "var(--badge-bg)",
                  borderColor: "var(--badge-border)",
                  color: "var(--badge-text)",
                }}
              >
                ProcureAI
              </span>
            </div>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              by TerminaLABS • Kolkata
            </p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl border" style={{ borderColor: "var(--border-muted)", backgroundColor: "var(--bg-card-subtle)" }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive ? "shadow-sm" : "hover:opacity-85"
                }`}
                style={{
                  backgroundColor: isActive ? "var(--primary-accent)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--text-primary)",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-white/25 text-white" : "border"
                    }`}
                    style={
                      !isActive
                        ? {
                            backgroundColor: "var(--badge-bg)",
                            borderColor: "var(--badge-border)",
                            color: "var(--badge-text)",
                          }
                        : {}
                    }
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & Quick Launch */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle Light and Dark Mode"
              title={`Switch to ${theme === "dark" ? "Warm Sand Light Mode" : "Slate Deep Dark Mode"}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-sm hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-muted)",
                color: "var(--text-primary)",
              }}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span className="hidden sm:inline text-[11px] font-mono">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-900" />
                  <span className="hidden sm:inline text-[11px] font-mono">Dark Mode</span>
                </>
              )}
            </button>
          )}

          {/* Quick CTA */}
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "var(--primary-accent)" }}
          >
            <span>Launch Copilot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
