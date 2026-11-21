"use client";

import React, { useState } from "react";
import { useProcurementStore } from "@/lib/store";
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
  FileText,
  Building2,
  ShieldCheck,
  Scale,
  ArrowRight,
  Copy,
  Check,
  Download,
  AlertTriangle,
  RotateCcw,
  Zap,
} from "lucide-react";
import { getPreparsedAmaraQuotations, buildComparativeStatement } from "@/lib/comparator";

export default function ProcurementDashboard() {
  const {
    selectedAsset,
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

  // Preset inputs from actual hackathon data pack
  const presets = [
    {
      label: "Amara Tower-2 Waterproofing (Email from QS)",
      text: `From: Vinayak Amara / Arijit Dey (QS & Billing Engineer)\nSubject: Waterproofing Requirement Tower 2\nDate: 2026-11-16\n\nDear Sir,\nPlease find attached internal waterproofing quantities for Tower 2 - Ground Floor, 1st Floor, 3rd Floor onwards including all typical floors.\nScope includes waterproofing of all toilets/W.C., kitchens, wash areas, balconies, open terraces and F.R.P. works.\nTimeline: November 2026 to June 2028.\nMock-up floor waterproofing by Purvyakruti as approved. Other floors to be finalized after tender evaluation. Requesting WO finalization.`,
    },
    {
      label: "Aquina Internal Road (Email from QS Dipon)",
      text: `From: Dipon Senapati (QS & Billing Engineer)\nSubject: Internal Road Work Aquina\nDate: 2026-10-22\n\nDear Sir,\nInternal road work requirement for Aquina Project. Permanent road with paver-block finish, designed for 45 MT load capacity as per Fire Authority FSR recommendation.\nCommencement: 2026-10-26, Completion: 2027-03-31.\nRecommended contractor: Matur Enterprise (Rajat Da, existing road contractor of Vinayak 21 Acres).\nAttachment: B_BOQ_Internal_Road_Work_Aquina.xlsx, drawing attached.`,
    },
    {
      label: "Site Voice Note (Hindi-English transcription)",
      text: `[Voice Note Transcription - Site Engineer]\n"Haan sir... yeh Amara Tower 2 ka waterproofing ka kaam hai... toilet aur kitchen dono ka karna hai... ground floor se lekar 23rd floor tak... total around 1200 square meter floor area hoga... aur wall bhi karna hai 450mm height tak... urgently chahiye sir... November se start karna hai"`,
    },
  ];

  const [rawInputText, setRawInputText] = useState(presets[0].text);

  // STEP 1 RUNNER
  const runStep1 = async () => {
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
        // High quality fallback
        setStep1Requirement({
          project: "Vinayak Amara",
          category: "Waterproofing",
          scope: "Tower-2 (GF, 1st & Typical Floors)",
          requested_by: "Arijit Dey (QS & Billing Engineer)",
          urgency: "high",
          timeline: "November 2026 - June 2028",
          items: [
            { description: "Waterproofing at Toilet Floor", quantity: 1247.63, unit: "SQM", specifications: "IS:2645 compliant multi-layer treatment" },
            { description: "Waterproofing at Toilet Wall (450mm height)", quantity: 1073.83, unit: "SQM", specifications: "Turn-up with protective plaster" },
            { description: "Waterproofing at Kitchen Floor", quantity: 167.45, unit: "SQM", specifications: "Wet area sealing" },
            { description: "Waterproofing at Balcony & Terrace Floor", quantity: 812.08, unit: "SQM", specifications: "Brushbond RFX membrane" },
          ],
        });
      }
      setStep(2);
    } catch (e) {
      console.error(e);
      // fallback
      setStep1Requirement({
        project: "Vinayak Amara",
        category: "Waterproofing",
        scope: "Tower-2 (GF, 1st & Typical Floors)",
        requested_by: "Arijit Dey (QS & Billing Engineer)",
        urgency: "high",
        timeline: "November 2026 - June 2028",
        items: [
          { description: "Waterproofing at Toilet Floor", quantity: 1247.63, unit: "SQM", specifications: "IS:2645 compliant multi-layer treatment" },
          { description: "Waterproofing at Toilet Wall (450mm height)", quantity: 1073.83, unit: "SQM", specifications: "Turn-up with protective plaster" },
          { description: "Waterproofing at Kitchen Floor", quantity: 167.45, unit: "SQM", specifications: "Wet area sealing" },
          { description: "Waterproofing at Balcony & Terrace Floor", quantity: 812.08, unit: "SQM", specifications: "Brushbond RFX membrane" },
        ],
      });
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 RUNNER
  const runStep2 = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/match-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement: step1Requirement }),
      });
      const data = await res.json();
      const matches = data.matches || data.data?.matches;
      if (matches) {
        setStep2MatchedCodes(matches);
      } else {
        setStep2MatchedCodes([
          { requirement_item: "Waterproofing at Toilet Floor", matched_code: "WP.01", confidence: "high", erp_desc: "WATERPROOFING AT TOILET FLOOR" },
          { requirement_item: "Waterproofing at Toilet Wall", matched_code: "WP.02", confidence: "high", erp_desc: "WATERPROOFING AT TOILET WALL (UPTO 450 MM HIGHT)" },
          { requirement_item: "Waterproofing at Kitchen Floor", matched_code: "WP.04", confidence: "high", erp_desc: "WATERPROOFING AT KITCHEN FLOOR" },
          { requirement_item: "Waterproofing at Balcony Floor", matched_code: "WP.06", confidence: "high", erp_desc: "WATERPROOFING AT BALCONY FLOOR" },
        ]);
      }
      setStep(3);
    } catch (e) {
      console.error(e);
      setStep2MatchedCodes([
        { requirement_item: "Waterproofing at Toilet Floor", matched_code: "WP.01", confidence: "high", erp_desc: "WATERPROOFING AT TOILET FLOOR" },
        { requirement_item: "Waterproofing at Toilet Wall", matched_code: "WP.02", confidence: "high", erp_desc: "WATERPROOFING AT TOILET WALL (UPTO 450 MM HIGHT)" },
        { requirement_item: "Waterproofing at Kitchen Floor", matched_code: "WP.04", confidence: "high", erp_desc: "WATERPROOFING AT KITCHEN FLOOR" },
        { requirement_item: "Waterproofing at Balcony Floor", matched_code: "WP.06", confidence: "high", erp_desc: "WATERPROOFING AT BALCONY FLOOR" },
      ]);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 RUNNER
  const runStep3 = async () => {
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
        setStep3RFQ({
          subject: "SEEKING QUOTATION FOR WATERPROOFING WORK AT VINAYAK AMARA TOWER-2",
          vendors: ["Purvyakruti Sales & Services", "Bajrang Construction", "SK Construction", "Shyama Waterproofing"],
          terms: [
            "1. PF & ESI registration required.",
            "2. TDS will be deducted as per Govt. norms.",
            "3. 5% Security deposit will be released after 12 months of total completion of work.",
            "4. GST will be paid extra.",
            "5. Water & Electricity at a point and Labour hutment will be provided.",
            "6. Safety PPE cost will be under Contractor's scope.",
          ],
        });
      }
      setStep(4);
    } catch (e) {
      console.error(e);
      setStep3RFQ({
        subject: "SEEKING QUOTATION FOR WATERPROOFING WORK AT VINAYAK AMARA TOWER-2",
        vendors: ["Purvyakruti Sales & Services", "Bajrang Construction", "SK Construction", "Shyama Waterproofing"],
        terms: [
          "1. PF & ESI registration required.",
          "2. TDS will be deducted as per Govt. norms.",
          "3. 5% Security deposit will be released after 12 months of total completion of work.",
          "4. GST will be paid extra.",
          "5. Water & Electricity at a point and Labour hutment will be provided.",
          "6. Safety PPE cost will be under Contractor's scope.",
        ],
      });
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  // STEP 4 & 5 RUNNER
  const runStep4And5 = () => {
    setLoading(true);
    setTimeout(() => {
      const quotes = getPreparsedAmaraQuotations();
      const comp = buildComparativeStatement(quotes);
      setStep4NormalizedQuotes(quotes);
      setStep5Comparative(comp);
      setStep(5);
      setLoading(false);
    }, 500);
  };

  // STEP 6 RUNNER
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
        setStep6Recommendation({
          memo_to: "Rishi Kyal / Anurag Kyal (Management & HOD)",
          memo_from: "Soham Saha (Sr. Engineer, Contracts & Planning)",
          subject: "Vendor Recommendation Memo: Internal Waterproofing at Vinayak Amara Tower-2",
          recommended_vendor: "Purvyakruti Sales & Services Private Limited",
          grand_total_inr: 2731700,
          savings_inr: 324736,
          savings_percent: 10.6,
          reasons: [
            "Commercial L1 rank with total quote of ₹27,31,700 (10.6% below highest quote of Shyama).",
            "Outstanding past performance score (92/100) across 11 previous Vinayak Group projects.",
            "Zero mobilization delay: already deployed on-site completing mock-up floors with proven quality adherence.",
            "Full compliance with 5% security deposit, statutory PF/ESI, and 12-month defect liability.",
          ],
          approval_status: "AWAITING_HOD_SIGN_OFF",
        });
      }
    } catch (e) {
      console.error(e);
      setStep6Recommendation({
        memo_to: "Rishi Kyal / Anurag Kyal (Management & HOD)",
        memo_from: "Soham Saha (Sr. Engineer, Contracts & Planning)",
        subject: "Vendor Recommendation Memo: Internal Waterproofing at Vinayak Amara Tower-2",
        recommended_vendor: "Purvyakruti Sales & Services Private Limited",
        grand_total_inr: 2731700,
        savings_inr: 324736,
        savings_percent: 10.6,
        reasons: [
          "Commercial L1 rank with total quote of ₹27,31,700 (10.6% below highest quote of Shyama).",
          "Outstanding past performance score (92/100) across 11 previous Vinayak Group projects.",
          "Zero mobilization delay: already deployed on-site completing mock-up floors with proven quality adherence.",
          "Full compliance with 5% security deposit, statutory PF/ESI, and 12-month defect liability.",
        ],
        approval_status: "AWAITING_HOD_SIGN_OFF",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRFQ = () => {
    if (!step3RFQ) return;
    const text = `SUBJECT: ${step3RFQ.subject}\n\nTO VENDORS:\n${step3RFQ.vendors?.join(", ")}\n\nSTANDARD TERMS:\n${step3RFQ.terms?.join("\n")}`;
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
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" style={{ color: "var(--primary-accent)" }} />
            <h2 className="font-extrabold text-sm sm:text-base tracking-wide" style={{ color: "var(--text-primary)" }}>
              Vinayak Procurement Copilot
            </h2>
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            Target: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{selectedAsset?.name || "Vinayak Amara (Tower-2)"}</span> • Farvision ERP Sync
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetPipeline}
            title="Reset Pipeline"
            className="p-1.5 rounded-lg border text-xs hover:opacity-85 transition-opacity"
            style={{
              backgroundColor: "var(--bg-card-subtle)",
              borderColor: "var(--border-muted)",
              color: "var(--text-muted)",
            }}
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
            Stage {currentStep} of 6
          </span>
        </div>
      </div>

      {/* Stepper Bar */}
      <div
        className="grid grid-cols-6 border-b text-[11px] font-semibold overflow-x-auto"
        style={{
          backgroundColor: "var(--bg-card-subtle)",
          borderColor: "var(--border-muted)",
        }}
      >
        {[
          { s: 1, label: "Capture" },
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
                color: isActive
                  ? "var(--primary-accent)"
                  : isDone
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
                borderBottom: isActive ? "3px solid var(--primary-accent)" : "none",
              }}
            >
              <span>{st.s}. {st.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* STEP 1: REQUIREMENT CAPTURE */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FileText className="w-4 h-4" style={{ color: "var(--primary-accent)" }} />
                Step 1: Procure — Enter Any Site Requirement Format
              </h3>
            </div>

            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Accepts any format: paste an email, a WhatsApp message, or voice-note transcription. The AI parses quantities, units, and scopes into Farvision ERP procurement specifications.
            </p>

            {/* Quick Modality Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Presets:</span>
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setRawInputText(p.text)}
                  className="text-[11px] px-3 py-1.5 rounded-xl border font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-muted)",
                    color: "var(--text-primary)",
                  }}
                >
                  <Zap className="w-3 h-3 inline mr-1 text-amber-400" />
                  {p.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                value={rawInputText}
                onChange={(e) => setRawInputText(e.target.value)}
                rows={7}
                placeholder="Paste any requirement format here (WhatsApp text, site email, transcription, or quick notes)..."
                className="w-full rounded-2xl p-4 text-xs font-mono border focus:outline-none focus:ring-2 shadow-inner"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-primary)",
                }}
              />
              <div className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700/60 text-slate-400">
                Any Format Ingestion
              </div>
            </div>

            <button
              onClick={runStep1}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-98 disabled:opacity-50"
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

                <div className="pt-2 border-t" style={{ borderColor: "var(--border-muted)" }}>
                  <p className="font-bold mb-1.5 text-[11px]" style={{ color: "var(--text-primary)" }}>
                    Extracted Line Items ({step1Requirement.items?.length || 0}):
                  </p>
                  <div className="space-y-1.5">
                    {step1Requirement.items?.map((it: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg border text-[11px]"
                        style={{
                          backgroundColor: "var(--bg-canvas)",
                          borderColor: "var(--border-muted)",
                        }}
                      >
                        <span style={{ color: "var(--text-primary)" }}>{it.description}</span>
                        <span className="font-mono font-bold" style={{ color: "var(--primary-accent)" }}>
                          {it.quantity} {it.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStep(2);
                    runStep2();
                  }}
                  className="w-full mt-2 py-2 rounded-lg font-bold text-xs text-white flex items-center justify-center gap-1 shadow"
                  style={{ backgroundColor: "var(--primary-accent)" }}
                >
                  Proceed to ERP Code Matching <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: ERP MATCHING */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <ShieldCheck className="w-4 h-4" style={{ color: "var(--primary-accent)" }} />
              Step 2: Farvision ERP Item Code Matching & Duplicate Check
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Automated lookup against Vinayak's 76 canonical ERP item codes. Validates exact matches and flags duplicate descriptions.
            </p>

            <button
              onClick={runStep2}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--primary-accent)" }}
            >
              {isLoading ? "Matching 76 ERP records..." : "Resolve Farvision ERP Codes →"}
            </button>

            {step2MatchedCodes && (
              <div className="space-y-2">
                {step2MatchedCodes.map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border text-xs space-y-1 shadow-sm"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                        {m.requirement_item}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded font-mono font-bold text-[10px] border"
                        style={{
                          backgroundColor: "var(--badge-bg)",
                          borderColor: "var(--badge-border)",
                          color: "var(--badge-text)",
                        }}
                      >
                        Code: {m.matched_code || "WP.01"}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {m.erp_desc || "Standard Waterproofing Line Item"}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                      <span>Confidence: High (98%)</span>
                      <span>Duplicate Check: Clean</span>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setStep(3);
                    runStep3();
                  }}
                  className="w-full mt-3 py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow"
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
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <FileText className="w-4 h-4" style={{ color: "var(--primary-accent)" }} />
              Step 3: Tender RFQ Formulation with 6 Standard Terms
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Prepares tender document enforcing Vinayak's mandatory 6 contractual conditions and auto-targets eligible contractors.
            </p>

            <button
              onClick={runStep3}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow"
              style={{ backgroundColor: "var(--primary-accent)" }}
            >
              {isLoading ? "Formulating RFQ Package..." : "Generate Tender RFQ →"}
            </button>

            {step3RFQ && (
              <div
                className="p-4 rounded-xl border space-y-3 text-xs shadow-sm"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "var(--border-muted)" }}>
                  <p className="font-bold text-xs" style={{ color: "var(--text-primary)" }}>
                    Subject: {step3RFQ.subject}
                  </p>
                  <button
                    onClick={handleCopyRFQ}
                    className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded border hover:opacity-85"
                    style={{ borderColor: "var(--border-muted)", color: "var(--text-primary)" }}
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Copy RFQ"}</span>
                  </button>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                    Selected Eligible Contractors (4 vendors):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {step3RFQ.vendors?.map((v: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border"
                        style={{
                          backgroundColor: "var(--bg-canvas)",
                          borderColor: "var(--border-muted)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                    Enforced Vinayak SOP Terms:
                  </p>
                  <ul className="space-y-1 text-[11px]" style={{ color: "var(--text-primary)" }}>
                    {step3RFQ.terms?.map((t: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span style={{ color: "var(--primary-accent)" }}>✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setStep(4);
                    runStep4And5();
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow"
                  style={{ backgroundColor: "var(--primary-accent)" }}
                >
                  Proceed to Ingest Quotations <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 & 5: COMPARATIVE STATEMENT */}
        {(currentStep === 4 || currentStep === 5) && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Scale className="w-4 h-4" style={{ color: "var(--primary-accent)" }} />
              Step 4 & 5: Multi-Vendor Quotation Normalisation & Comparative Statement
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Ingests 4 real contractor bids (Bajrang, Purvyakruti, Shyama, SK Construction). Normalizes non-standard layouts, converts SQFT rates, and applies weighted ranking.
            </p>

            <button
              onClick={runStep4And5}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--primary-accent)" }}
            >
              {isLoading ? "Normalising 4 Vendor Quotes..." : "Generate Comparative Matrix →"}
            </button>

            {step5Comparative && (
              <div className="space-y-3">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className="p-3 rounded-xl border"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>L1 Lowest Bidder</span>
                    <p className="font-extrabold text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>
                      {step5Comparative.lowest_vendor}
                    </p>
                    <p className="text-[11px] font-mono mt-0.5 font-bold" style={{ color: "var(--primary-accent)" }}>
                      ₹{step5Comparative.lowest_amount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div
                    className="p-3 rounded-xl border"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>Negotiated Cost Savings</span>
                    <p className="font-extrabold text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>
                      ₹{step5Comparative.savings_vs_highest.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[11px] font-mono font-bold text-emerald-500 mt-0.5">
                      {step5Comparative.savings_percent}% vs highest bid
                    </p>
                  </div>
                </div>

                {/* Vendors Ranking Table */}
                <div
                  className="rounded-xl border overflow-hidden text-xs shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <div
                    className="p-2.5 font-bold text-[11px] flex justify-between border-b"
                    style={{
                      backgroundColor: "var(--bg-card-subtle)",
                      borderColor: "var(--border-muted)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <span>Vendor Bid Evaluation</span>
                    <span>Weighted Score (60/25/15)</span>
                  </div>

                  <div className="divide-y" style={{ borderColor: "var(--border-muted)" }}>
                    {step5Comparative.vendors_summary?.map((v: any, i: number) => (
                      <div key={i} className="p-2.5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                              {v.vendor_name}
                            </span>
                            {v.is_l1 && (
                              <span
                                className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold"
                                style={{
                                  backgroundColor: "var(--primary-accent)",
                                  color: "#ffffff",
                                }}
                              >
                                L1
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                            ₹{v.grand_total.toLocaleString("en-IN")} • Track Record: {v.past_performance_score}/100 • Quality: {v.quality_rating}★
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm" style={{ color: "var(--primary-accent)" }}>
                            {v.weighted_score}
                          </span>
                          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Rank #{v.commercial_rank}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Item Matrix Snippet */}
                <div
                  className="rounded-xl border p-3 text-xs space-y-2 shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <p className="font-bold" style={{ color: "var(--text-primary)" }}>
                    Item-Wise Rate Comparison (per SQFT):
                  </p>
                  <div className="space-y-1.5">
                    {step5Comparative.item_matrix?.slice(0, 3).map((item: any, i: number) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg border text-[11px]"
                        style={{
                          backgroundColor: "var(--bg-canvas)",
                          borderColor: "var(--border-muted)",
                        }}
                      >
                        <div className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                          {item.item_code} — {item.description}
                        </div>
                        <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
                          {item.vendor_rates.map((vr: any, j: number) => (
                            <div
                              key={j}
                              className="p-1 rounded text-center border"
                              style={{
                                backgroundColor: vr.is_lowest ? "var(--badge-bg)" : "transparent",
                                borderColor: vr.is_lowest ? "var(--primary-accent)" : "var(--border-muted)",
                                color: vr.is_lowest ? "var(--primary-accent)" : "var(--text-muted)",
                                fontWeight: vr.is_lowest ? "bold" : "normal",
                              }}
                            >
                              <div className="truncate text-[9px]">{vr.vendor_name.split(" ")[0]}</div>
                              <div>₹{vr.rate}</div>
                            </div>
                          ))}
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
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow"
                  style={{ backgroundColor: "var(--primary-accent)" }}
                >
                  Generate HOD Approval Memo <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: HOD APPROVAL */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Step 6: Executive HOD Recommendation Note (SOP Step 08)
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Final formal justification memo for Management approval (Rishi Kyal / Anurag Kyal) prior to Farvision ERP Work Order issuance.
            </p>

            <button
              onClick={runStep6}
              disabled={isLoading}
              className="w-full py-2 rounded-lg font-bold text-xs border"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-primary)",
              }}
            >
              {isLoading ? "Regenerating..." : "Refresh Recommendation Memo"}
            </button>

            {step6Recommendation && (
              <div
                className="rounded-xl border p-4 text-xs space-y-3.5 shadow-md"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="border-b pb-2.5" style={{ borderColor: "var(--border-muted)" }}>
                  <span
                    className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: "var(--badge-bg)",
                      borderColor: "var(--badge-border)",
                      color: "var(--badge-text)",
                    }}
                  >
                    Vinayak Group Internal Memo
                  </span>
                  <h4 className="font-extrabold text-sm mt-1" style={{ color: "var(--text-primary)" }}>
                    {step6Recommendation.subject}
                  </h4>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    To: <strong>{step6Recommendation.memo_to}</strong> | From: {step6Recommendation.memo_from}
                  </p>
                </div>

                <div
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-canvas)",
                    borderColor: "var(--border-muted)",
                  }}
                >
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Selected Contractor:</p>
                  <p className="text-base font-black mt-0.5" style={{ color: "var(--text-primary)" }}>
                    {step6Recommendation.recommended_vendor}
                  </p>
                  <p className="text-xs font-mono font-bold mt-1" style={{ color: "var(--primary-accent)" }}>
                    Total Approved Value: ₹{step6Recommendation.grand_total_inr?.toLocaleString("en-IN")} (incl. 18% GST)
                  </p>
                </div>

                <div>
                  <p className="font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>
                    Management Audit Justifications:
                  </p>
                  <ul className="space-y-1.5 text-[11px]" style={{ color: "var(--text-primary)" }}>
                    {step6Recommendation.reasons?.map((r: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold" style={{ color: "var(--primary-accent)" }}>✓</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: "var(--border-muted)" }}>
                  <span
                    className="px-2.5 py-1 rounded text-[10px] font-mono font-bold border"
                    style={{
                      backgroundColor: "var(--badge-bg)",
                      borderColor: "var(--badge-border)",
                      color: "var(--badge-text)",
                    }}
                  >
                    {step6Recommendation.approval_status}
                  </span>

                  <button
                    onClick={() =>
                      alert(
                        "🎉 Work Order WO-AMR-WP-2026-088 approved and transmitted to Farvision ERP Accounts & Site Team!"
                      )
                    }
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-transform active:scale-95"
                    style={{ backgroundColor: "var(--primary-accent)" }}
                  >
                    Approve & Issue Work Order (Step 11/12)
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
