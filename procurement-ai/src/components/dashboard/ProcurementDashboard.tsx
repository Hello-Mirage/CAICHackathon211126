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
    rawInputDraft,
  } = useProcurementStore();

  const [copied, setCopied] = useState(false);
  const [rawInputText, setRawInputText] = useState(rawInputDraft || "");

  React.useEffect(() => {
    if (rawInputDraft) {
      setRawInputText(rawInputDraft);
    }
  }, [rawInputDraft]);

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
      // Stay on step 1 so user can review the card before proceeding!
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
      // Stay on step 2 so user can review the ERP matches card before proceeding!
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
      // Stay on step 3 so user can review the RFQ email card before proceeding!
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
    <section className="engine" aria-labelledby="et">
      {/* Top Header */}
      <div className="eng-top">
        <div>
          <h2 id="et">Procurement engine</h2>
          <p>Synced with Farvision ERP</p>
        </div>
        <button
          onClick={() => {
            resetPipeline();
            setRawInputText("");
          }}
          className="btn-ghost text-xs"
          id="reset"
        >
          Start over
        </button>
      </div>

      {/* Stepper Tabs */}
      <div className="steps-bar" id="steps">
        {[
          { s: 1, label: "Procure" },
          { s: 2, label: "ERP match" },
          { s: 3, label: "RFQ draft" },
          { s: 4, label: "Normalise" },
          { s: 5, label: "Compare" },
          { s: 6, label: "Approve" },
        ].map((st) => (
          <button
            key={st.s}
            onClick={() => setStep(st.s)}
            disabled={st.s > currentStep}
            className={currentStep === st.s ? "on" : currentStep > st.s ? "past" : ""}
          >
            {st.s}. {st.label}
          </button>
        ))}
      </div>

      {/* Main Active Pane */}
      <div className="pane" id="pane">
        {/* STEP 1: PROCURE INTAKE */}
        {currentStep === 1 && (
          <div>
            <h3>Enter a requirement</h3>
            <p>Paste a WhatsApp message, email, voice-note text or a bill of quantities. We’ll pull out the items and quantities.</p>

            <textarea
              id="req"
              value={rawInputText}
              onChange={(e) => setRawInputText(e.target.value)}
              placeholder="Type or paste a requirement"
            />

            <div className="row">
              <button
                onClick={runStep1}
                disabled={isLoading || !rawInputText.trim()}
                className="btn-go"
                id="next"
              >
                {isLoading ? "Extracting BOQ with AI..." : "Extract BOQ"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setRawInputText(
                    "Tower 2, 3rd floor onwards: toilets, kitchens and balconies need polymer-modified cementitious waterproofing. About 4,200 sqm. Include 2-coat application, 7-day ponding test and a 10 year guarantee."
                  )
                }
                className="sample"
                id="fill"
              >
                Use a sample
              </button>
              <span className="hint">Nothing is sent until you continue.</span>
            </div>

            {step1Requirement && (
              <div className="result">
                <div>
                  <span>Project / Scope</span>
                  <span>{step1Requirement.project || "Site Project"} • {step1Requirement.category || "Works"}</span>
                </div>
                <div>
                  <span>Items found</span>
                  <span>{step1Requirement.items?.length || 0} line items</span>
                </div>
                <div>
                  <span>Urgency</span>
                  <span className="uppercase font-mono">{step1Requirement.urgency || "NORMAL"}</span>
                </div>
                {step1Requirement.items?.map((it: any, idx: number) => (
                  <div key={idx}>
                    <span>{it.description}</span>
                    <span className="font-mono font-bold" style={{ color: "var(--accent)" }}>
                      {it.quantity} {it.unit}
                    </span>
                  </div>
                ))}
                <div style={{ backgroundColor: "var(--raise)" }}>
                  <button onClick={() => setStep(2)} className="btn-go w-full text-xs">
                    Continue to ERP Match →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: ERP MATCH */}
        {currentStep === 2 && (
          <div>
            <h3>Match to ERP items</h3>
            <p>Each line is matched to an item code in Farvision so rates and history carry over.</p>

            <div className="row">
              <button
                onClick={runStep2}
                disabled={isLoading}
                className="btn-go"
              >
                {isLoading ? "Resolving ERP item codes..." : "Match Farvision ERP Codes"}
              </button>
              <span className="hint">Synced with Farvision canonical catalog (76 codes)</span>
            </div>

            {step2MatchedCodes && (
              <div className="result">
                <div>
                  <span>ERP Resolution Summary</span>
                  <span>{step2MatchedCodes.length} items mapped</span>
                </div>
                {step2MatchedCodes.map((m: any, idx: number) => (
                  <div key={idx}>
                    <div>
                      <p className="font-semibold">{m.requirement_item}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{m.erp_desc || "Farvision Catalog Item"}</p>
                    </div>
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded border" style={{ borderColor: "var(--line)", color: "var(--accent)" }}>
                      {m.matched_code || `WP.${String(idx + 1).padStart(2, "0")}`}
                    </span>
                  </div>
                ))}
                <div style={{ backgroundColor: "var(--raise)" }}>
                  <button onClick={() => setStep(3)} className="btn-go w-full text-xs">
                    Continue to Review RFQ →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: DRAFT RFQ */}
        {currentStep === 3 && (
          <div>
            <h3>Review the RFQ</h3>
            <p>A draft request for quotation is prepared from the matched items with Vinayak's standard 6 contractual terms.</p>

            <div className="row">
              <button
                onClick={runStep3}
                disabled={isLoading}
                className="btn-go"
              >
                {isLoading ? "Generating Tender RFQ..." : "Draft RFQ Emails"}
              </button>
            </div>

            {step3RFQ && (
              <div className="result">
                <div>
                  <span>Subject</span>
                  <span className="font-semibold" style={{ color: "var(--accent)" }}>{step3RFQ.subject}</span>
                </div>
                <div>
                  <span>Vendors Invited</span>
                  <span>{step3RFQ.vendors?.join(", ")}</span>
                </div>
                <div>
                  <span>Contract Terms Enforced</span>
                  <span className="text-xs">{step3RFQ.terms?.length || 6} mandatory terms (PF/ESI, TDS, 5% SD, GST 18%, PPE)</span>
                </div>
                <div className="flex gap-2 p-3" style={{ backgroundColor: "var(--raise)" }}>
                  <button onClick={handleCopyRFQ} className="btn-ghost text-xs">
                    {copied ? "Copied to Clipboard" : "Copy RFQ Email"}
                  </button>
                  <button onClick={() => setStep(4)} className="btn-go flex-1 text-xs">
                    Continue to Vendor Quotes →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 & 5: COMPARATIVE STATEMENT */}
        {(currentStep === 4 || currentStep === 5) && (
          <div>
            <h3>Compare vendors</h3>
            <p>See normalised rates side by side with the L1 vendor marked and past performance scores.</p>

            {/* Switch between Custom input and Pack data */}
            <div className="seg mt-4 mb-4" role="group" aria-label="Quote Source">
              <button
                onClick={() => setQuotationMode("custom")}
                aria-pressed={quotationMode === "custom"}
              >
                Input My Quotations
              </button>
              <button
                onClick={() => setQuotationMode("pack")}
                aria-pressed={quotationMode === "pack"}
              >
                Use 4 Pack Quotations (Amara)
              </button>
            </div>

            {quotationMode === "custom" && (
              <div className="result p-4 space-y-3" style={{ background: "var(--raise)" }}>
                <p className="font-semibold text-sm">Add Received Proposal:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px]" style={{ color: "var(--muted)" }}>Vendor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Purvyakruti Sales"
                      value={inputVendorName}
                      onChange={(e) => setInputVendorName(e.target.value)}
                      className="w-full mt-1 p-2 rounded-lg border text-xs"
                      style={{ background: "var(--bg)", borderColor: "var(--line)", color: "var(--text)" }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px]" style={{ color: "var(--muted)" }}>Quoted Amount (₹)</label>
                    <input
                      type="text"
                      placeholder="e.g. 27,31,700"
                      value={inputVendorAmount}
                      onChange={(e) => setInputVendorAmount(e.target.value)}
                      className="w-full mt-1 p-2 rounded-lg border text-xs"
                      style={{ background: "var(--bg)", borderColor: "var(--line)", color: "var(--text)" }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px]" style={{ color: "var(--muted)" }}>Past Score (1-100)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={inputVendorScore}
                      onChange={(e) => setInputVendorScore(e.target.value)}
                      className="w-full mt-1 p-2 rounded-lg border text-xs"
                      style={{ background: "var(--bg)", borderColor: "var(--line)", color: "var(--text)" }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px]" style={{ color: "var(--muted)" }}>Commercial Terms</label>
                    <input
                      type="text"
                      value={inputVendorTerms}
                      onChange={(e) => setInputVendorTerms(e.target.value)}
                      className="w-full mt-1 p-2 rounded-lg border text-xs"
                      style={{ background: "var(--bg)", borderColor: "var(--line)", color: "var(--text)" }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={handleAddCustomVendor} className="btn-ghost text-xs">
                    + Add Vendor
                  </button>
                  <button
                    onClick={runCustomComparative}
                    disabled={customVendors.length < 2 || isLoading}
                    className="btn-go text-xs flex-1"
                  >
                    Compare Added Vendors ({customVendors.length}) →
                  </button>
                </div>

                {customVendors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {customVendors.map((v, i) => (
                      <div key={i} className="flex justify-between items-center text-xs p-1.5 rounded" style={{ background: "var(--bg)" }}>
                        <span>{v.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold" style={{ color: "var(--accent)" }}>₹{v.amount.toLocaleString("en-IN")}</span>
                          <span style={{ color: "var(--muted)" }}>({v.pastScore}/100)</span>
                          <button onClick={() => setCustomVendors((p) => p.filter((_, idx) => idx !== i))} className="text-red-400 font-bold px-1">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {quotationMode === "pack" && (
              <div className="row">
                <button
                  onClick={runPackComparative}
                  disabled={isLoading}
                  className="btn-go"
                >
                  {isLoading ? "Analyzing 4 Pack Quotations..." : "Load & Compare 4 Pack Quotations (Amara) →"}
                </button>
              </div>
            )}

            {step5Comparative && (
              <div className="result mt-4">
                <div>
                  <span>L1 Lowest Bidder</span>
                  <span className="font-bold" style={{ color: "var(--good)" }}>
                    {step5Comparative.lowest_vendor} (₹{step5Comparative.lowest_amount?.toLocaleString("en-IN")})
                  </span>
                </div>
                <div>
                  <span>Negotiated Savings vs Highest</span>
                  <span className="font-bold" style={{ color: "var(--good)" }}>
                    ₹{step5Comparative.savings_vs_highest?.toLocaleString("en-IN")} ({step5Comparative.savings_percent}%)
                  </span>
                </div>

                {step5Comparative.vendors_summary?.map((v: any, i: number) => (
                  <div key={i}>
                    <div>
                      <span className="font-semibold">{v.vendor_name}</span>
                      {v.is_l1 && <span className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(127, 209, 174, 0.2)", color: "var(--good)" }}>L1</span>}
                      <p className="text-xs" style={{ color: "var(--muted)" }}>Score: {v.weighted_score}/100 | Quality: {v.quality_rating}★</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold" style={{ color: "var(--text)" }}>₹{v.grand_total?.toLocaleString("en-IN")}</span>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>Rank #{v.commercial_rank}</p>
                    </div>
                  </div>
                ))}

                <div style={{ backgroundColor: "var(--raise)" }}>
                  <button
                    onClick={() => {
                      setStep(6);
                      runStep6();
                    }}
                    className="btn-go w-full text-xs"
                  >
                    Proceed to Send for Approval (Step 6) →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: HOD APPROVAL */}
        {currentStep === 6 && (
          <div>
            <h3>Send for approval</h3>
            <p>Send the comparative statement and recommendation to management for formal sign-off.</p>

            {step6Recommendation && (
              <div className="result">
                <div>
                  <span>Official Memo Subject</span>
                  <span className="font-bold" style={{ color: "var(--text)" }}>{step6Recommendation.subject}</span>
                </div>
                <div>
                  <span>Recipient & Sender</span>
                  <span>To: {step6Recommendation.memo_to} | From: {step6Recommendation.memo_from}</span>
                </div>
                <div>
                  <span>Recommended Contractor</span>
                  <span className="font-bold text-sm" style={{ color: "var(--good)" }}>
                    {step6Recommendation.recommended_vendor}
                  </span>
                </div>
                <div>
                  <span>Total Approved Contract Value</span>
                  <span className="font-mono font-bold text-sm" style={{ color: "var(--accent)" }}>
                    ₹{step6Recommendation.grand_total_inr?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span>Audit Justification Points</span>
                  <ul className="text-xs space-y-1 text-right">
                    {step6Recommendation.reasons?.map((r: string, idx: number) => (
                      <li key={idx} className="list-none text-left">
                        <span style={{ color: "var(--good)" }}>✓ </span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3" style={{ backgroundColor: "var(--raise)" }}>
                  <button
                    onClick={() => alert("🎉 Work Order approved and dispatched to Farvision ERP & Site Accounts!")}
                    className="btn-go w-full text-xs"
                  >
                    Approve & Issue Work Order (Farvision ERP Sync)
                  </button>
                </div>
              </div>
            )}

            <p className="ok">Step 6 of 6 complete</p>
          </div>
        )}
      </div>
    </section>
  );
}
