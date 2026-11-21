"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProcurementDashboard from "@/components/dashboard/ProcurementDashboard";
import {
  Building2,
  Box,
  Layers,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  FileCheck2,
  Users,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useProcurementStore } from "@/lib/store";

export default function DashboardPage() {
  const { selectedProject, setSelectedProject, currentStep } = useProcurementStore();

  const projects = [
    {
      id: "Vinayak Amara",
      name: "Vinayak Amara (Tower-2)",
      category: "Waterproofing",
      scope: "Toilets, Kitchen, Balconies, FRP",
      urgency: "High",
      boqQty: "1,247.63 SQM",
      status: "Tender Evaluated",
    },
    {
      id: "Vinayak Aquina",
      name: "Vinayak Aquina (Internal Road)",
      category: "Civil & Pavers",
      scope: "45MT Heavy Load Paver Blocks",
      urgency: "Normal",
      boqQty: "200m Length",
      status: "Ready for RFQ",
    },
  ];

  return (
    <div className="flex-1 flex flex-col transition-colors min-h-[calc(100vh-4rem)]" style={{ backgroundColor: "var(--bg-canvas)" }}>
      {/* Sub-header / Command Bar */}
      <div
        className="border-b px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-muted)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
            style={{ backgroundColor: "var(--primary-accent)" }}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight" style={{ color: "var(--text-primary)" }}>
              Procurement Operations Command Center
            </h1>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Vinayak Group Farvision ERP Connector • Automated 12-Step SOP
            </p>
          </div>
        </div>

        {/* Project Selector & 3D Link */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center rounded-xl border p-1 text-xs" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-muted)" }}>
            {projects.map((p) => {
              const active = selectedProject === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p.id)}
                  className="px-3 py-1.5 rounded-lg font-bold transition-all text-[11px]"
                  style={{
                    backgroundColor: active ? "var(--primary-accent)" : "transparent",
                    color: active ? "#ffffff" : "var(--text-primary)",
                  }}
                >
                  {p.name.split(" ")[1] || p.name}
                </button>
              );
            })}
          </div>

          <Link
            href="/site-3d"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-sm transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            <Box className="w-3.5 h-3.5" style={{ color: "var(--primary-accent)" }} />
            <span className="hidden sm:inline">3D Site</span>
          </Link>
        </div>
      </div>

      {/* Main Workspace: Left Context / Right Procurement Copilot */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Real-time Project Intelligence */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Context Card */}
          <div
            className="p-5 rounded-2xl border shadow-sm space-y-3.5"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: "var(--badge-bg)",
                  borderColor: "var(--badge-border)",
                  color: "var(--badge-text)",
                }}
              >
                Farvision Active Package
              </span>
              <span className="text-xs font-mono font-bold text-emerald-500">
                10.6% L1 Savings
              </span>
            </div>

            <h2 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>
              {selectedProject}
            </h2>

            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {selectedProject.includes("Amara")
                ? "Internal waterproofing works for Tower 2 - Ground Floor, 1st Floor, 3rd Floor onwards including all typical floors (toilets, kitchens, balconies, terraces, FRP). Mockup floor approved."
                : "Permanent internal road work for Aquina Project. Paver block finish with 45 MT heavy vehicle load capacity designed for Fire Authority FSR compliance."}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t text-[11px]" style={{ borderColor: "var(--border-muted)" }}>
              <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--bg-canvas)" }}>
                <span style={{ color: "var(--text-muted)" }}>Category:</span>
                <p className="font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>
                  {selectedProject.includes("Amara") ? "Waterproofing (Civil)" : "Road Work & Paving"}
                </p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--bg-canvas)" }}>
                <span style={{ color: "var(--text-muted)" }}>Target Timeline:</span>
                <p className="font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>
                  {selectedProject.includes("Amara") ? "Nov 2026 – Jun 2028" : "Oct 2026 – Mar 2027"}
                </p>
              </div>
            </div>
          </div>

          {/* SOP Stage Progress Tracker */}
          <div
            className="p-5 rounded-2xl border shadow-sm space-y-3"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <h3 className="font-bold text-xs uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
              Vinayak 12-Step SOP Audit Trail
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { step: "01-03", title: "BOQ Receival & Checking", done: currentStep >= 2 },
                { step: "04-05", title: "Tender Document & Floating", done: currentStep >= 4 },
                { step: "06-07", title: "Comparative Statement & Rate Analysis", done: currentStep >= 5 },
                { step: "08-09", title: "Management Approval & Vendor KYC", done: currentStep >= 6 },
                { step: "10-12", title: "Work Order Creation & Final Floating", done: false },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border text-[11px]"
                  style={{
                    backgroundColor: "var(--bg-canvas)",
                    borderColor: s.done ? "var(--primary-accent)" : "var(--border-muted)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px]"
                      style={{
                        backgroundColor: s.done ? "var(--primary-accent)" : "var(--bg-card)",
                        color: s.done ? "#ffffff" : "var(--text-muted)",
                      }}
                    >
                      {s.done ? "✓" : idx + 1}
                    </span>
                    <span style={{ color: "var(--text-primary)" }}>{s.title}</span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                    SOP {s.step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tip / Hackathon Pitch highlight */}
          <div
            className="p-4 rounded-xl border text-xs space-y-1.5"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-muted)",
            }}
          >
            <p className="font-bold text-[11px] flex items-center gap-1.5" style={{ color: "var(--primary-accent)" }}>
              <FileCheck2 className="w-3.5 h-3.5" />
              Pitch Highlight for Vinayak Management
            </p>
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              All recommendations prioritize quality track record (92/100 score for Purvyakruti) and zero mobilization delay, saving ₹3.24 Lakhs compared to the highest quotation.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive 6-Step Copilot */}
        <div className="lg:col-span-7 h-full min-h-[640px]">
          <ProcurementDashboard />
        </div>
      </div>
    </div>
  );
}
