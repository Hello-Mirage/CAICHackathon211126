"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Building2,
  Box,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Maximize2,
  Compass,
  Zap,
} from "lucide-react";
import { useProcurementStore } from "@/lib/store";

// Dynamically import Three.js canvas to avoid SSR issues
const ConstructionSiteCanvas = dynamic(
  () => import("@/components/3d/ConstructionSiteCanvas"),
  { ssr: false }
);

export default function Site3DPage() {
  const { selectedAsset, setSelectedAsset, setSelectedProject } = useProcurementStore();

  const siteAssets = [
    {
      id: "amara-tower2",
      name: "Vinayak Amara (Tower-2)",
      project: "Vinayak Amara",
      category: "Waterproofing",
      scope: "Ground, 1st & Typical Floors (Toilets, Kitchen, Balconies, FRP)",
      status: "Tender Ready",
      description: "Internal waterproofing works covering toilets, kitchen areas, and balconies. Purvyakruti completed mockup floor. Scheduled Nov 2026 – June 2028.",
      quantities: [
        { item: "Toilet Floor Waterproofing", qty: "1,247.63 SQM", code: "WP.01" },
        { item: "Toilet Wall Turn-up (450mm)", qty: "1,073.83 SQM", code: "WP.02" },
        { item: "Kitchen Floor Waterproofing", qty: "167.45 SQM", code: "WP.04" },
        { item: "Balcony & Terrace Floor", qty: "812.08 SQM", code: "WP.06" },
      ],
      lead: "Arijit Dey (QS & Billing Engineer)",
      bestBid: "Purvyakruti (₹27,31,700)",
    },
    {
      id: "aquina-road",
      name: "Vinayak Aquina (Internal Road)",
      project: "Vinayak Aquina",
      category: "Road Work",
      scope: "Main Gate to Tower-2 Flat-B Side (45MT Fire Authority load specs)",
      status: "BOQ Approved",
      description: "Permanent internal road network featuring 80mm heavy duty interlocking paver blocks, WBM foundation, and sand cushion per Fire Authority FSR norms.",
      quantities: [
        { item: "80mm Heavy Paver Blocks", qty: "1,450.00 SQM", code: "RD.01" },
        { item: "Water Bound Macadam (WBM)", qty: "290.00 CUM", code: "RD.02" },
        { item: "Silver Sand Cushioning", qty: "72.50 CUM", code: "RD.03" },
        { item: "Precast Kerb Stones", qty: "320.00 RM", code: "RD.04" },
      ],
      lead: "Dipon Senapati (QS & Billing Engineer)",
      bestBid: "Matur Enterprise (Rajat Da)",
    },
    {
      id: "amara-tower1",
      name: "Vinayak Amara (Tower-1)",
      project: "Vinayak Amara",
      category: "Structural",
      scope: "Superstructure complete, internal finishes ongoing",
      status: "Civil Finished",
      description: "Primary civil superstructure completed. Procurement closed for core structural concrete and rebars. Current MEP fitouts ongoing.",
      quantities: [
        { item: "R.C.C Structure M30", qty: "4,200.00 CUM", code: "STR.01" },
        { item: "TMT Fe550D Reinforcement", qty: "380.00 MT", code: "STR.02" },
      ],
      lead: "Molay Das (Project Manager)",
      bestBid: "Procurement Closed",
    },
  ];

  const currentActive =
    siteAssets.find((a) => a.id === selectedAsset?.id) || siteAssets[0];

  const handleLaunchCopilot = () => {
    setSelectedProject(currentActive.project);
    setSelectedAsset(currentActive as any);
  };

  return (
    <div
      className="relative flex-1 w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col transition-colors"
      style={{ backgroundColor: "var(--bg-canvas)" }}
    >
      {/* 3D Scene Viewport */}
      <div className="absolute inset-0 z-0">
        <ConstructionSiteCanvas />
      </div>

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-end gap-3 pointer-events-none">
        {/* Right Helper Pill */}
        <div
          className="pointer-events-auto hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl border backdrop-blur-md shadow-lg text-xs"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-muted)",
            color: "var(--text-primary)",
          }}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <strong>3D Digital Twin Active</strong>
          </span>
          <span style={{ color: "var(--text-muted)" }}>• Left Click + Drag: Rotate | Right Click: Pan | Scroll: Zoom</span>
        </div>
      </div>

      {/* Floating Bottom / Right Inspector Drawer */}
      <div
        className="absolute bottom-4 right-4 max-w-sm w-full z-10 p-5 rounded-2xl border backdrop-blur-md shadow-2xl space-y-3.5 transition-all"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: "var(--border-muted)" }}>
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
            style={{
              backgroundColor: "var(--badge-bg)",
              borderColor: "var(--badge-border)",
              color: "var(--badge-text)",
            }}
          >
            {currentActive.status}
          </span>
          <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
            {currentActive.category}
          </span>
        </div>

        <div>
          <h3 className="text-base font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
            {currentActive.name}
          </h3>
          <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {currentActive.description}
          </p>
        </div>

        {/* Quantities Breakdown */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Verified BOQ Specifications:
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {currentActive.quantities.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-1.5 rounded-lg border text-[11px]"
                style={{
                  backgroundColor: "var(--bg-canvas)",
                  borderColor: "var(--border-muted)",
                }}
              >
                <span className="truncate" style={{ color: "var(--text-primary)" }}>{q.item}</span>
                <span className="font-mono font-bold shrink-0 ml-2" style={{ color: "var(--primary-accent)" }}>
                  {q.qty}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t text-[11px]" style={{ borderColor: "var(--border-muted)", color: "var(--text-muted)" }}>
          <p>QS In-Charge: <strong style={{ color: "var(--text-primary)" }}>{currentActive.lead}</strong></p>
          <p className="mt-0.5">Top Bidder: <strong style={{ color: "var(--primary-accent)" }}>{currentActive.bestBid}</strong></p>
        </div>

        {/* Action Button: Jump to Copilot */}
        <Link
          href="/dashboard"
          onClick={handleLaunchCopilot}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "var(--primary-accent)" }}
        >
          <span>Launch Copilot for this Asset</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
