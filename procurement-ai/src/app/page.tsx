"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  FileText,
  Clock,
  TrendingDown,
  Layers,
  Box,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  AlertCircle,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const stepsPreview = [
    {
      step: 1,
      title: "Capture Requirement",
      subtitle: "Ingest WhatsApp / Email / Voice",
      description:
        "Site engineers send informal messages like 'Urgent waterproofing Tower 2 toilets'. The NLP parser turns messy input into structured Farvision ERP line items with quantities, UOMs, and scopes.",
      tag: "Farvision JSON Ingestion",
      sample: {
        raw: "Sir urgent requirement for waterproofing at Amara Tower 2. Ground & 1st floor toilets. Purvyakruti did mockup floor.",
        output: "Vinayak Amara | Category: Waterproofing | 1,247.63 SQM Toilet Floor | High Urgency",
      },
    },
    {
      step: 2,
      title: "Farvision ERP Resolution",
      subtitle: "Map canonical codes & detect duplicates",
      description:
        "Automatically matches items to Vinayak's 76 canonical ERP item codes (WP.01, WP.02, etc.). Flags duplicate descriptions and proposes standardized naming for new procurement items.",
      tag: "Farvision ERP Code Mapper",
      sample: {
        raw: "Toilet floor waterproofing item requested",
        output: "Matched Code: WP.01 (WATERPROOFING AT TOILET FLOOR) • 98% Confidence • Duplicate Risk: None",
      },
    },
    {
      step: 3,
      title: "Tender RFQ Formulation",
      subtitle: "Enforce 6 standard contractual terms",
      description:
        "Drafts professional tender emails with Vinayak's 6 standard terms (PF/ESI mandatory, 5% security deposit retained for 12 mos, free water/power at point) dispatched to verified contractors.",
      tag: "Automated RFQ Dispatch",
      sample: {
        raw: "Seeking quotations for Amara Tower 2",
        output: "4 Target Vendors Selected • 6 Contractual Terms Injected • Blank BOQ Attached",
      },
    },
    {
      step: 4,
      title: "Quotation Normalisation",
      subtitle: "Ingest varied layouts & convert SQFT/SQM",
      description:
        "Extracts data from varied PDF quotes (Bajrang, Purvyakruti, Shyama, SK Construction). Normalizes non-standard units, extracts statutory 18% GST, and breaks out retention terms.",
      tag: "Multi-Format Parser",
      sample: {
        raw: "4 Vendor PDFs (scans, tables, varying rate cards)",
        output: "All rates standardized to SQFT/SQM with 18% GST and 5% security deposit parity.",
      },
    },
    {
      step: 5,
      title: "Comparative Statement",
      subtitle: "Multi-factor weighted ranking matrix",
      description:
        "Generates the comparative statement ranking vendors on 60% commercial price + 25% past performance track record + 15% quality/mobilization score. Identifies L1 bidder and savings.",
      tag: "Audit-Grade CS Matrix",
      sample: {
        raw: "Commercial comparison of 4 bidders",
        output: "L1: Purvyakruti ₹27,31,700 (Score: 94.2/100) • 10.6% Savings (₹3.24L) vs Shyama (₹30.56L)",
      },
    },
    {
      step: 6,
      title: "Executive HOD Approval",
      subtitle: "Audit-ready memo for management signoff",
      description:
        "Prepares the formal Step 08 recommendation note to Management (Rishi Kyal / Anurag Kyal) with clear audit justification, zero mobilization delay, and 1-click Work Order issuance.",
      tag: "HOD Recommendation Memo",
      sample: {
        raw: "Management signoff required under SOP 08",
        output: "Awaiting HOD Sign-off • Immediate Farvision Work Order Generation upon confirmation.",
      },
    },
  ];

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: "var(--bg-canvas)" }}>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b" style={{ borderColor: "var(--border-muted)" }}>
        {/* Subtle background glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: "var(--primary-accent)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-sm"
              style={{
                backgroundColor: "var(--badge-bg)",
                borderColor: "var(--badge-border)",
                color: "var(--badge-text)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vibe Coders Hackathon Edition 3 • Vinayak Group AI Procurement</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
              Transform Messy Site Requests into Approved Work Orders{" "}
              <span style={{ color: "var(--primary-accent)" }}>in Minutes</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg leading-relaxed font-normal" style={{ color: "var(--text-muted)" }}>
              Built specifically for <strong style={{ color: "var(--text-primary)" }}>Vinayak Group</strong>. Automates the full 12-step procurement SOP — from field WhatsApps and voice notes to Farvision ERP code mapping, multi-vendor quotation normalisation, comparative statements, and audit-ready HOD approval memos.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--primary-accent)" }}
              >
                <span>Launch Procurement Copilot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/site-3d"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm border shadow-sm transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
              >
                <Box className="w-4 h-4" />
                <span>Explore 3D View</span>
              </Link>
            </div>

            {/* Live Trust Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 text-left">
              {[
                { label: "SOP Efficiency", val: "12 → 6 Stages", desc: "Automated end-to-end" },
                { label: "Cost Savings", val: "₹3,24,736", desc: "10.6% on Amara Tower-2" },
                { label: "Farvision Codes", val: "76 ERP Codes", desc: "Canonical auto-match" },
                { label: "Turnaround Risk", val: "Zero Delays", desc: "Active mockup vendor priority" },
              ].map((m, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border shadow-sm transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-muted)",
                  }}
                >
                  <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                    {m.label}
                  </p>
                  <p className="text-xl font-extrabold mt-0.5" style={{ color: "var(--text-primary)" }}>
                    {m.val}
                  </p>
                  <p className="text-[10px] mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WORKFLOW PREVIEW SECTION */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: "var(--border-muted)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              The 6-Step Vinayak AI Procurement Pipeline
            </h2>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              Select any stage below to inspect how unstructured construction requirements transform into verified ERP commercial decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Stage Selector */}
            <div className="lg:col-span-5 space-y-2">
              {stepsPreview.map((s, idx) => {
                const isSelected = activeTab === idx;
                return (
                  <button
                    key={s.step}
                    onClick={() => setActiveTab(idx)}
                    className="w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 shadow-sm hover:translate-x-1"
                    style={{
                      backgroundColor: isSelected ? "var(--bg-card)" : "transparent",
                      borderColor: isSelected ? "var(--primary-accent)" : "var(--border-muted)",
                    }}
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                      style={{
                        backgroundColor: isSelected ? "var(--primary-accent)" : "var(--bg-card)",
                        color: isSelected ? "#ffffff" : "var(--text-primary)",
                      }}
                    >
                      {s.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs truncate" style={{ color: "var(--text-primary)" }}>
                          {s.title}
                        </span>
                        {isSelected && <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--primary-accent)" }} />}
                      </div>
                      <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {s.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Preview Card */}
            <div
              className="lg:col-span-7 p-6 rounded-2xl border shadow-lg space-y-5"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-muted)" }}>
                <div>
                  <span
                    className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded font-bold border"
                    style={{
                      backgroundColor: "var(--badge-bg)",
                      borderColor: "var(--badge-border)",
                      color: "var(--badge-text)",
                    }}
                  >
                    Stage {stepsPreview[activeTab].step} • {stepsPreview[activeTab].tag}
                  </span>
                  <h3 className="text-lg font-bold mt-1" style={{ color: "var(--text-primary)" }}>
                    {stepsPreview[activeTab].title}
                  </h3>
                </div>
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all hover:opacity-85"
                  style={{
                    backgroundColor: "var(--primary-accent)",
                    borderColor: "var(--border-subtle)",
                    color: "#ffffff",
                  }}
                >
                  <span>Open in Copilot</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {stepsPreview[activeTab].description}
              </p>

              {/* Sample In/Out Box */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl border text-xs" style={{ backgroundColor: "var(--bg-canvas)", borderColor: "var(--border-muted)" }}>
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Incoming Data Stream
                  </p>
                  <p className="mt-1 font-mono text-xs" style={{ color: "var(--text-primary)" }}>
                    "{stepsPreview[activeTab].sample.raw}"
                  </p>
                </div>

                <div className="p-3 rounded-xl border text-xs" style={{ backgroundColor: "var(--bg-canvas)", borderColor: "var(--border-muted)" }}>
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--primary-accent)" }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI Resolved Result
                  </p>
                  <p className="mt-1 font-mono text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {stepsPreview[activeTab].sample.output}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Compliant with Farvision ERP & Vinayak SOP Step {stepsPreview[activeTab].step * 2}</span>
                <span className="font-mono">Auditable • 0% Hallucination Guard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE REAL ESTATE PROJECTS SHOWCASE */}
      <section className="py-16 border-b" style={{ borderColor: "var(--border-muted)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest font-bold" style={{ color: "var(--primary-accent)" }}>
                Vinayak Group Real-World Deployments
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1" style={{ color: "var(--text-primary)" }}>
                Live Active Site Requirements
              </h2>
            </div>
            <Link
              href="/site-3d"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-primary)",
              }}
            >
              <span>View in 3D Site Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project 1: Vinayak Amara */}
            <div
              className="p-5 rounded-2xl border shadow-sm space-y-3 transition-transform hover:-translate-y-1"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Tender Approved
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>Nov 2026 – Jun 2028</span>
              </div>
              <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                Vinayak Amara (Tower-2)
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Internal Waterproofing for Ground, 1st, and typical floors (toilets, kitchens, balconies, terraces, FRP). Mockup completed by Purvyakruti.
              </p>
              <div className="pt-2 border-t text-[11px] space-y-1" style={{ borderColor: "var(--border-muted)", color: "var(--text-primary)" }}>
                <p>• Scope: <strong>1,247.63 SQM</strong> Toilet & Kitchen areas</p>
                <p>• Selected Vendor: <strong>Purvyakruti (₹27,31,700)</strong></p>
                <p>• Lead Engineer: <strong>Arijit Dey (QS & Billing)</strong></p>
              </div>
            </div>

            {/* Project 2: Vinayak Aquina */}
            <div
              className="p-5 rounded-2xl border shadow-sm space-y-3 transition-transform hover:-translate-y-1"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Ready for RFQ
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>Oct 2026 – Mar 2027</span>
              </div>
              <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                Vinayak Aquina (Internal Road)
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Permanent internal road from Main Gate to Tower-2. 45 MT heavy vehicle load specification as recommended by Fire Authority FSR norms.
              </p>
              <div className="pt-2 border-t text-[11px] space-y-1" style={{ borderColor: "var(--border-muted)", color: "var(--text-primary)" }}>
                <p>• Specification: <strong>80mm Interlocking Paver Blocks</strong></p>
                <p>• Base: <strong>WBM, Silver Sand & 45MT Foundation</strong></p>
                <p>• Recommended: <strong>Matur Enterprise (Rajat Da)</strong></p>
              </div>
            </div>

            {/* Project 3: Vinayak 21 Acres */}
            <div
              className="p-5 rounded-2xl border shadow-sm space-y-3 transition-transform hover:-translate-y-1"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Civil Verified
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>Phase 1 Baseline</span>
              </div>
              <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                Vinayak 21 Acres & Aquina T1
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Primary civil structure and MEP installations. Contractor benchmarking database seeded with historical performance records.
              </p>
              <div className="pt-2 border-t text-[11px] space-y-1" style={{ borderColor: "var(--border-muted)", color: "var(--text-primary)" }}>
                <p>• 66 Active Contractors registered</p>
                <p>• Past quality ratings integrated in matrix</p>
                <p>• Standard statutory tax compliance checked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 mt-auto" style={{ backgroundColor: "var(--bg-canvas)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" style={{ color: "var(--primary-accent)" }} />
            <span>Built by <strong>Team TerminaLABS</strong> for <strong>Vinayak Group</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span>Calcutta AI Club • Vibe Coders Hackathon Edition 3</span>
            <span>Kolkata, 21 Nov 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
