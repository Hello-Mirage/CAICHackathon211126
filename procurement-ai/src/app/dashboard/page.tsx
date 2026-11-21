"use client";

import React from "react";
import ProcurementDashboard from "@/components/dashboard/ProcurementDashboard";
import { useProcurementStore } from "@/lib/store";

export default function DashboardPage() {
  const {
    selectedProject,
    setSelectedProject,
    currentStep,
    step1Requirement,
    step5Comparative,
    rawInputDraft,
  } = useProcurementStore();

  const isAmara = selectedProject.includes("Amara");
  const isAquina = selectedProject.includes("Aquina");

  const sop = [
    ["BOQ receipt and checking", "01–03"],
    ["Tender document and floating", "04–05"],
    ["Comparative statement and rates", "06–07"],
    ["Approval and vendor KYC", "08–09"],
    ["Work order and final floating", "10–12"],
  ];

  const at = Math.min(Math.floor(((currentStep - 1) * 5) / 6), 4);

  return (
    <main className="vinayak-main">
      <aside>
        {/* Project Switcher Segment */}
        <div className="seg" role="group" aria-label="Project">
          <button
            onClick={() => setSelectedProject("Vinayak Amara")}
            aria-pressed={isAmara}
          >
            Amara
          </button>
          <button
            onClick={() => setSelectedProject("Vinayak Aquina")}
            aria-pressed={isAquina}
          >
            Aquina
          </button>
          <button
            onClick={() => setSelectedProject("Vinayak Vista")}
            aria-pressed={!isAmara && !isAquina}
          >
            Vista
          </button>
        </div>

        {/* Dynamic Project Name & Scope */}
        <h1>{selectedProject || "Vinayak Group"}</h1>
        <p className="saving">
          {step5Comparative?.summary?.savings_percentage
            ? `${step5Comparative.summary.savings_percentage}% saved at L1 (₹${Number(
                step5Comparative.summary.savings_amount || 0
              ).toLocaleString("en-IN")})`
            : `Tender Stage: Step 0${currentStep} of 6`}
        </p>
        <p className="scope">
          {step1Requirement?.scope_summary ||
            (rawInputDraft
              ? rawInputDraft.length > 220
                ? rawInputDraft.slice(0, 220) + "..."
                : rawInputDraft
              : "No package loaded yet. Type or paste your bill of quantities, tender items, or vendor quote in Step 1 to begin.")}
        </p>

        {/* Dynamic Metadata Details */}
        <dl className="vinayak-dl">
          <dt>Category</dt>
          <dd>{step1Requirement?.category || "Awaiting Intake"}</dd>
          <dt>Line Items</dt>
          <dd>
            {step1Requirement?.items?.length
              ? `${step1Requirement.items.length} BOQ items extracted`
              : "Pending input"}
          </dd>
          <dt>Source</dt>
          <dd>Farvision ERP · User Intake</dd>
        </dl>

        {/* 12-Step SOP Audit Trail */}
        <section className="trail">
          <h2>12-step SOP</h2>
          <ol className="vinayak-ol">
            {sop.map((s, i) => (
              <li
                key={i}
                className={`vinayak-li ${
                  i < at ? "done" : i === at ? "now" : ""
                }`}
              >
                <span>{s[0]}</span>
                <small>SOP {s[1]}</small>
              </li>
            ))}
          </ol>
        </section>
      </aside>

      {/* Procurement Engine Copilot */}
      <ProcurementDashboard />
    </main>
  );
}

