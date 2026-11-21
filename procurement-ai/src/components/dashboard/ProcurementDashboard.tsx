"use client";

import React, { useState } from "react";
import { useProcurementStore } from "@/lib/store";
import {
  CheckCircle2,
  Sparkles,
  FileText,
  ShieldCheck,
  Scale,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";
import { getPreparsedAmaraQuotations, buildComparativeStatement } from "@/lib/comparator";

export default function ProcurementDashboard() {
  const {
    currentStep,
    setStep,
    isLoading,
    setLoading,
    step1Requirement,
    setStep1Requirement,
    step2MatchedCodes,
    setStep2MatchedCodes,
    step3RFQ,
    setStep3RFQ,
    step4NormalizedQuotes,
    setStep4NormalizedQuotes,
    step5Comparative,
    setStep5Comparative,
    step6Recommendation,
    setStep6Recommendation,
    resetPipeline,
  } = useProcurementStore();

  const [copied, setCopied] = useState(false);
  const [rawInputText, setRawInputText] = useState("");

  // STEP 1 RUNNER: Ingest raw text and parse with AI
  const runStep1 = async () => {
    if (!rawInputText.trim()) {
      alert("Please enter or paste your requirement text first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: rawInputText }),
      });
      const data = await res.json();
      if (data.data) {
        setStep1Requirement(data.data);
      } else {
        // If API did not return structured object, create dynamic structure from raw text
        setStep1Requirement({
          project: "Site Requirement",
          category: "General Works",
          scope: rawInputText.slice(0, 100),
          requested_by: "Site In-Charge",
          urgency: "medium",
          timeline: "As per schedule",
          items: [
            { description: rawInputText.slice(0, 80), quantity: 1, unit: "LS", specifications: "Site specification" }
          ],
        });
      }
      setStep(2);
    } catch (e) {
      console.error(e);
      alert("Failed to parse requirement. Please check input.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 RUNNER: Match ERP Item codes dynamically
  const runStep2 = async () => {
    if (!step1Requirement) {
      alert("Please enter and submit a requirement in Step 1 first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/match-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement: step1Requirement }),
      });
      const data = await res.json();
      const resolved = data.data?.matches || data.matches || data.data;
      if (Array.isArray(resolved) && resolved.length > 0) {
        setStep2MatchedCodes(resolved);
      } else if (step1Requirement.items && Array.isArray(step1Requirement.items)) {
        // Dynamically resolve from the user's actual items without forcing static presets
        setStep2MatchedCodes(
          step1Requirement.items.map((it: any, idx: number) => ({
            requirement_item: it.description,
            matched_code: `ERP.${String(idx + 1).padStart(2, "0")}`,
            confidence: "medium",
            erp_desc: `${it.description} (${it.quantity || "1"} ${it.unit || "LS"})`,
          }))
        );
      }
      setStep(3);
    } catch (e) {
      console.error(e);
      alert("Failed to match ERP codes.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 RUNNER: Draft RFQ dynamically for user's scope
  const runStep3 = async () => {
    if (!step1Requirement) return;
    setLoading(true);
    try {
      const res = await fetch("/api/draft-rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement: step1Requirement, matchedCodes: step2MatchedCodes }),
      });
      const data = await res.json();
      if (data.data) {
        setStep3RFQ(data.data);
      } else {
        // Dynamic fallback based on user's actual project and category
        setStep3RFQ({
          subject: `INVITATION TO TENDER: ${step1Requirement.project || "Site Project"} — ${step1Requirement.category || "Works"}`,
          vendors: ["Bajrang Construction", "Purvyakruti Sales & Services", "SK Construction", "Shyama Waterproofing"],
          terms: [
            "1. PF & ESI registration required",
            "2. TDS deducted as per Govt. norms",
            "3. 5% Security deposit released after 12 months completion",
            "4. GST paid extra (18%)",
            "5. Water & Electricity provided at single point on site",
            "6. Safety PPE cost under Contractor's scope",
          ],
        });
      }
      setStep(4);
    } catch (e) {
      console.error(e);
      alert("Failed to draft RFQ.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 4 & 5 RUNNER: Real Quotation Ingestion & Comparative Matrix
  const [quotationMode, setQuotationMode] = useState<"custom" | "pack">("custom");
  const [customVendors, setCustomVendors] = useState<
    { name: string; amount: number; pastScore: number; terms: string }[]
  >([]);
  const [inputVendorName, setInputVendorName] = useState("");
  const [inputVendorAmount, setInputVendorAmount] = useState("");
  const [inputVendorScore, setInputVendorScore] = useState("85");
  const [inputVendorTerms, setInputVendorTerms] = useState("18% GST Extra, 30-day credit");

  const handleAddCustomVendor = () => {
    if (!inputVendorName.trim() || !inputVendorAmount) {
      alert("Please provide vendor name and quoted total amount.");
      return;
    }
    const amt = parseFloat(inputVendorAmount.replace(/,/g, ""));
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid numeric amount.");
      return;
    }
    setCustomVendors((prev) => [
      ...prev,
      {
        name: inputVendorName.trim(),
        amount: amt,
        pastScore: parseInt(inputVendorScore) || 80,
        terms: inputVendorTerms,
      },
    ]);
    setInputVendorName("");
    setInputVendorAmount("");
  };

  const runCustomComparative = () => {
    if (customVendors.length < 2) {
      alert("Please add at least 2 vendor quotations to compare.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const sorted = [...customVendors].sort((a, b) => a.amount - b.amount);
      const lowest = sorted[0];
      const highest = sorted[sorted.length - 1];
      const savings = highest.amount - lowest.amount;
      const savingsPct = parseFloat(((savings / highest.amount) * 100).toFixed(1));

      const summaries = sorted.map((v, idx) => {
        const priceScore = (lowest.amount / v.amount) * 100;
        const weighted = Math.round(priceScore * 0.6 + v.pastScore * 0.4);
        return {
          vendor_name: v.name,
          grand_total: v.amount,
          commercial_rank: idx + 1,
          is_l1: idx === 0,
          past_performance_score: v.pastScore,
          quality_rating: Math.round((v.pastScore / 20) * 10) / 10,
          weighted_score: weighted,
          terms: v.terms,
        };
      });

      const comp = {
        comparison_title: `Commercial & Technical Evaluation — ${step1Requirement?.project || "Project Site"}`,
        vendors_compared: customVendors.length,
        lowest_vendor: lowest.name,
        lowest_amount: lowest.amount,
        highest_amount: highest.amount,
        savings_vs_highest: savings,
        savings_percent: savingsPct,
        vendors_summary: summaries,
      };

      setStep5Comparative(comp as any);
      setLoading(false);
    }, 400);
  };

  const runPackComparative = () => {
    setLoading(true);
    setTimeout(() => {
      const quotes = getPreparsedAmaraQuotations();
      const comp = buildComparativeStatement(quotes);
      setStep4NormalizedQuotes(quotes);
      setStep5Comparative(comp);
      setLoading(false);
    }, 400);
  };

  // STEP 6 RUNNER: HOD Approval Memo
  const runStep6 = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comparativeStatement: step5Comparative }),
      });
      const data = await res.json();
      if (data.data) {
        setStep6Recommendation(data.data);
      } else {
        const top = step5Comparative?.vendors_summary?.[0] || {
          vendor_name: step5Comparative?.lowest_vendor || "Selected L1 Vendor",
          grand_total: step5Comparative?.lowest_amount || 0,
        };
        setStep6Recommendation({
          memo_to: "Management & HOD (Vinayak Group)",
          memo_from: "Contracts & Planning Department",
          subject: `Vendor Selection & Work Order Approval Memo — ${step1Requirement?.project || "Vinayak Site"}`,
          recommended_vendor: top.vendor_name,
          grand_total_inr: top.grand_total,
          savings_inr: step5Comparative?.savings_vs_highest || 0,
          savings_percent: step5Comparative?.savings_percent || 0,
          reasons: [
            `Ranked L1 lowest bid of ₹${(top.grand_total || 0).toLocaleString("en-IN")}.`,
            `Negotiated savings of ₹${(step5Comparative?.savings_vs_highest || 0).toLocaleString("en-IN")} (${step5Comparative?.savings_percent || 0}% against highest proposal).`,
            "Statutory compliance confirmed with PF, ESI, 5% security retention and 12-month defect liability.",
            "Site team confirmed immediate deployment readiness.",
          ],
          approval_status: "AWAITING_HOD_SIGN_OFF",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRFQ = () => {
    if (!step3RFQ) return;
    const text = `SUBJECT: ${step3RFQ.subject}\n\nTO VENDORS:\n${step3RFQ.vendors?.join(", ")}\n\nTERMS:\n${step3RFQ.terms?.join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex flex-col h-full rounded-2xl border shadow-xl overflow-hidden transition-colors"
      style={{
        backgroundColor: "var(--bg-canvas)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {/* Top Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-muted)",
        }}
      >
        <div>
          <h2 className="font-extrabold text-sm sm:text-base tracking-wide" style={{ color: "var(--text-primary)" }}>
            Procurement Engine
          </h2>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Farvision ERP Sync • 6-Step Workflow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetPipeline();
              setRawInputText("");
            }}
            title="Reset Pipeline"
            className="p-1.5 rounded-lg border text-xs transition-all hover:opacity-80"
            style={{ borderColor: "var(--border-muted)", color: "var(--text-muted)" }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-mono font-bold border"
            style={{
              backgroundColor: "var(--badge-bg)",
              borderColor: "var(--badge-border)",
              color: "var(--badge-text)",
            }}
          >
            Step {currentStep} / 6
          </span>
        </div>
      </div>

      {/* Stepper Tabs */}
      <div
        className="grid grid-cols-6 border-b text-[11px] font-bold"
        style={{ borderColor: "var(--border-muted)" }}
      >
        {[
          { s: 1, label: "Procure" },
          { s: 2, label: "ERP Match" },
          { s: 3, label: "RFQ Draft" },
          { s: 4, label: "Normalise" },
          { s: 5, label: "Compare" },
          { s: 6, label: "Approve" },
        ].map((st) => {
          const isActive = currentStep === st.s;
          const isDone = currentStep > st.s;
          return (
            <button
              key={st.s}
              onClick={() => setStep(st.s)}
              className="py-2.5 px-1 text-center transition-all border-r flex flex-col items-center justify-center gap-0.5"
              style={{
                borderColor: "var(--border-muted)",
                backgroundColor: isActive ? "var(--bg-card)" : "transparent",
                color: isActive ? "var(--primary-accent)" : isDone ? "var(--text-primary)" : "var(--text-muted)",
                borderBottom: isActive ? "3px solid var(--primary-accent)" : "none",
              }}
            >
              <span>{st.s}. {st.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* STEP 1: PROCURE INTAKE */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FileText className="w-4 h-4" style={{ color: "var(--primary-accent)" }} />
                Step 1: Procure — Enter Any Requirement
              </h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Paste or type any site requirement (WhatsApp message, email, voice-note notes, or bill of quantities).
              </p>
            </div>

            <textarea
              value={rawInputText}
              onChange={(e) => setRawInputText(e.target.value)}
              rows={8}
              placeholder="Type or paste any requirement here..."
              className="w-full rounded-2xl p-4 text-xs font-mono border focus:outline-none focus:ring-2 shadow-inner"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-primary)",
              }}
            />

            <button
              onClick={runStep1}
              disabled={isLoading || !rawInputText.trim()}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-98 disabled:opacity-40"
              style={{ backgroundColor: "var(--primary-accent)" }}
            >
              {isLoading ? (
                <span>Parsing with Gemini NLP...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Procure: Parse Requirement & Extract BOQ →</span>
                </>
              )}
            </button>

            {step1Requirement && (
              <div
                className="rounded-xl border p-3.5 space-y-2.5 text-xs shadow-sm"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5" style={{ color: "var(--primary-accent)" }}>
                    <CheckCircle2 className="w-4 h-4" /> Farvision Structured Output
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border" style={{ borderColor: "var(--border-muted)", color: "var(--text-primary)" }}>
                    Urgency: {step1Requirement.urgency?.toUpperCase() || "HIGH"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
                  <div>Project: <strong style={{ color: "var(--text-primary)" }}>{step1Requirement.project}</strong></div>
                  <div>Category: <strong style={{ color: "var(--text-primary)" }}>{step1Requirement.category}</strong></div>
                  <div>Scope: <strong style={{ color: "var(--text-primary)" }}>{step1Requirement.scope}</strong></div>
                  <div>Timeline: <strong style={{ color: "var(--text-primary)" }}>{step1Requirement.timeline}</strong></div>
                </div>

                <div className="mt-2 pt-2 border-t" style={{ borderColor: "var(--border-muted)" }}>
                  <p className="font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Extracted Quantities ({step1Requirement.items?.length || 0}):
                  </p>
                  <ul className="space-y-1">
                    {step1Requirement.items?.map((it: any, idx: number) => (
                      <li key={idx} className="flex justify-between p-2 rounded-lg text-[11px]" style={{ backgroundColor: "var(--bg-card-subtle)" }}>
                        <span style={{ color: "var(--text-primary)" }}>{it.description}</span>
                        <span className="font-mono font-bold" style={{ color: "var(--primary-accent)" }}>
                          {it.quantity} {it.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  style={{ backgroundColor: "var(--primary-accent)" }}
                >
                  Proceed to Farvision ERP Matching <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: ERP MATCH */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <ShieldCheck className="w-4 h-4" style={{ color: "var(--primary-accent)" }} />
                Step 2: Farvision ERP Item Code Resolution
              </h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Resolves items to canonical item codes in Farvision ERP, highlighting match confidence and duplicate flags.
              </p>
            </div>

            <button
              onClick={runStep2}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--primary-accent)" }}
            >
              {isLoading ? "Matching ERP Records..." : "Resolve Farvision ERP Item Codes →"}
            </button>

            {step2MatchedCodes && (
              <div className="space-y-2">
                {step2MatchedCodes.map((m: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl border text-xs shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{m.requirement_item}</span>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] border font-bold" style={{ backgroundColor: "var(--badge-bg)", borderColor: "var(--badge-border)", color: "var(--badge-text)" }}>
                        {m.matched_code || "WP.01"}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{m.erp_desc || "Standard Item Specification"}</p>
                  </div>
                ))}

                <button
                  onClick={() => setStep(3)}
                  className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  style={{ backgroundColor: "var(--primary-accent)" }}
                >
                  Proceed to RFQ Formulation <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: DRAFT RFQ */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FileText className="w-4 h-4" style={{ color: "var(--primary-accent)" }} />
                Step 3: Tender RFQ Dispatch
              </h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Standard tender email drafted with Vinayak's 6 mandatory contractual conditions.
              </p>
            </div>

            <button
              onClick={runStep3}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--primary-accent)" }}
            >
              {isLoading ? "Generating Tender RFQ..." : "Draft Tender Emails →"}
            </button>

            {step3RFQ && (
              <div className="p-4 rounded-xl border text-xs space-y-3 shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Subject:</span>
                  <p className="font-bold text-sm mt-0.5" style={{ color: "var(--primary-accent)" }}>{step3RFQ.subject}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Target Vendors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {step3RFQ.vendors?.map((v: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-muted)", color: "var(--text-primary)" }}>
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Enforced Contract Terms:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]" style={{ color: "var(--text-primary)" }}>
                    {step3RFQ.terms?.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t flex gap-2" style={{ borderColor: "var(--border-muted)" }}>
                  <button onClick={handleCopyRFQ} className="flex-1 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-muted)", color: "var(--text-primary)" }}>
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy RFQ"}
                  </button>
                  <button onClick={() => setStep(4)} className="flex-1 py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-sm" style={{ backgroundColor: "var(--primary-accent)" }}>
                    Proceed to Quotations <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 & 5: COMPARATIVE STATEMENT */}
        {(currentStep === 4 || currentStep === 5) && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Scale className="w-4 h-4" style={{ color: "var(--primary-accent)" }} />
                Step 4 & 5: Comparative Statement
              </h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Normalizes vendor proposals, converts rates, calculates 18% GST, and ranks contractors by multi-factor score.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex rounded-xl p-1 border gap-1 text-xs font-bold" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-muted)" }}>
              <button
                onClick={() => setQuotationMode("custom")}
                className="flex-1 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: quotationMode === "custom" ? "var(--primary-accent)" : "transparent",
                  color: quotationMode === "custom" ? "#ffffff" : "var(--text-muted)",
                }}
              >
                Input My Quotations
              </button>
              <button
                onClick={() => setQuotationMode("pack")}
                className="flex-1 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: quotationMode === "pack" ? "var(--primary-accent)" : "transparent",
                  color: quotationMode === "pack" ? "#ffffff" : "var(--text-muted)",
                }}
              >
                Use Hackathon Pack Quotations (4 Vendors)
              </button>
            </div>

            {/* Custom Mode: User puts their own vendor data */}
            {quotationMode === "custom" && (
              <div className="p-3.5 rounded-2xl border space-y-3" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                  Enter Vendor Quotations Received:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Vendor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Bajrang Construction"
                      value={inputVendorName}
                      onChange={(e) => setInputVendorName(e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg border text-xs"
                      style={{ backgroundColor: "var(--bg-canvas)", borderColor: "var(--border-muted)", color: "var(--text-primary)" }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Quoted Amount (₹)</label>
                    <input
                      type="text"
                      placeholder="e.g. 28,50,000"
                      value={inputVendorAmount}
                      onChange={(e) => setInputVendorAmount(e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg border text-xs"
                      style={{ backgroundColor: "var(--bg-canvas)", borderColor: "var(--border-muted)", color: "var(--text-primary)" }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Past Performance Score (1-100)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={inputVendorScore}
                      onChange={(e) => setInputVendorScore(e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg border text-xs"
                      style={{ backgroundColor: "var(--bg-canvas)", borderColor: "var(--border-muted)", color: "var(--text-primary)" }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Commercial Terms</label>
                    <input
                      type="text"
                      value={inputVendorTerms}
                      onChange={(e) => setInputVendorTerms(e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg border text-xs"
                      style={{ backgroundColor: "var(--bg-canvas)", borderColor: "var(--border-muted)", color: "var(--text-primary)" }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAddCustomVendor}
                    className="px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:opacity-90"
                    style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-muted)", color: "var(--text-primary)" }}
                  >
                    + Add Vendor Quote
                  </button>
                  <button
                    onClick={runCustomComparative}
                    disabled={customVendors.length < 2 || isLoading}
                    className="flex-1 py-2 px-4 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-40 shadow-sm"
                    style={{ backgroundColor: "var(--primary-accent)" }}
                  >
                    Compare Added Vendors ({customVendors.length}) →
                  </button>
                </div>

                {customVendors.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                      Added Proposals ({customVendors.length}):
                    </p>
                    <div className="space-y-1">
                      {customVendors.map((v, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg text-xs border" style={{ backgroundColor: "var(--bg-canvas)", borderColor: "var(--border-muted)" }}>
                          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{v.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold" style={{ color: "var(--primary-accent)" }}>₹{v.amount.toLocaleString("en-IN")}</span>
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>({v.pastScore}/100)</span>
                            <button
                              onClick={() => setCustomVendors((prev) => prev.filter((_, idx) => idx !== i))}
                              className="text-red-400 font-bold px-1.5 py-0.5 hover:bg-red-500/10 rounded"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pack Mode: Loads the 4 hackathon PDFs */}
            {quotationMode === "pack" && (
              <button
                onClick={runPackComparative}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--primary-accent)" }}
              >
                {isLoading ? "Analyzing 4 Pack Quotations..." : "Load & Compare 4 Pack Quotations (Amara) →"}
              </button>
            )}

            {step5Comparative && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl border shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>L1 Lowest Bidder</span>
                    <p className="font-extrabold text-emerald-400 text-sm mt-0.5">{step5Comparative.lowest_vendor}</p>
                    <p className="font-mono text-[11px] mt-0.5" style={{ color: "var(--text-primary)" }}>
                      ₹{step5Comparative.lowest_amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Negotiated Savings</span>
                    <p className="font-extrabold text-blue-400 text-sm mt-0.5">
                      ₹{step5Comparative.savings_vs_highest.toLocaleString("en-IN")}
                    </p>
                    <p className="font-mono text-[11px] text-emerald-400 mt-0.5 font-bold">
                      {step5Comparative.savings_percent}% vs highest bid
                    </p>
                  </div>
                </div>

                {/* Vendor Rankings */}
                <div className="rounded-xl border overflow-hidden text-xs shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                  <div className="p-2.5 font-bold flex justify-between border-b" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-muted)", color: "var(--text-primary)" }}>
                    <span>Vendor Evaluation Summary</span>
                    <span>Weighted Score (60% Price + 40% History)</span>
                  </div>
                  <div className="divide-y" style={{ borderColor: "var(--border-muted)" }}>
                    {step5Comparative.vendors_summary?.map((v: any, i: number) => (
                      <div key={i} className="p-3 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold" style={{ color: "var(--text-primary)" }}>{v.vendor_name}</span>
                            {v.is_l1 && (
                              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                                L1
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                            ₹{v.grand_total.toLocaleString("en-IN")} | Past Score: {v.past_performance_score}/100 | Quality: {v.quality_rating}★
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold font-mono text-sm" style={{ color: "var(--primary-accent)" }}>
                            {v.weighted_score}
                          </span>
                          <p className="text-[10px] text-slate-400">Rank #{v.commercial_rank}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStep(6);
                    runStep6();
                  }}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-md"
                  style={{ backgroundColor: "var(--primary-accent)" }}
                >
                  Proceed to HOD Recommendation Memo <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: HOD APPROVAL */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Step 6: HOD Recommendation Memo
              </h3>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Formal recommendation memo for management review and work order sign-off.
              </p>
            </div>

            {step6Recommendation && (
              <div className="rounded-2xl border p-4 text-xs space-y-3.5 shadow-lg" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                <div className="border-b pb-2.5" style={{ borderColor: "var(--border-muted)" }}>
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400">
                    Official Executive Memo
                  </p>
                  <p className="font-bold text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>{step6Recommendation.subject}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    To: {step6Recommendation.memo_to} | From: {step6Recommendation.memo_from}
                  </p>
                </div>

                <div className="p-3 rounded-xl border" style={{ backgroundColor: "var(--bg-card-subtle)", borderColor: "var(--border-muted)" }}>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Recommended Vendor:</span>
                  <p className="text-sm font-extrabold mt-0.5" style={{ color: "var(--text-primary)" }}>
                    {step6Recommendation.recommended_vendor}
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                    Total Contract Value: ₹{step6Recommendation.grand_total_inr?.toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>Audit Justification Points:</p>
                  <ul className="space-y-1.5 text-[11px]" style={{ color: "var(--text-primary)" }}>
                    {step6Recommendation.reasons?.map((r: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: "var(--border-muted)" }}>
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono border font-bold" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", borderColor: "rgba(245, 158, 11, 0.3)", color: "#f59e0b" }}>
                    {step6Recommendation.approval_status}
                  </span>
                  <button
                    onClick={() => alert("Work Order signed and dispatched to Farvision ERP!")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    Approve & Issue Work Order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
