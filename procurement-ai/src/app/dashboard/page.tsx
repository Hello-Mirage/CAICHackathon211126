"use client";

import React from "react";
import ProcurementDashboard from "@/components/dashboard/ProcurementDashboard";
import { useProcurementStore } from "@/lib/store";

export default function DashboardPage() {
  const { selectedProject, setSelectedProject, currentStep } = useProcurementStore();

  const isAmara = selectedProject.includes("Amara");

  const sop = [
    ["BOQ receipt and checking", "01–03"],
    ["Tender document and floating", "04–05"],
    ["Comparative statement and rates", "06–07"],
    ["Approval and vendor KYC", "08–09"],
    ["Work order and final floating", "10–12"],
  ];

  const at = Math.min(Math.floor((currentStep - 1) * 5 / 6), 4);

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
            aria-pressed={!isAmara}
          >
            Aquina
          </button>
        </div>

        {/* Project Name & Scope */}
        <h1>{isAmara ? "Vinayak Amara" : "Vinayak Aquina"}</h1>
        <p className="saving">{isAmara ? "10.6% saved at L1" : "Savings pending"}</p>
        <p className="scope">
          {isAmara
            ? "Internal waterproofing for Tower 2: ground floor, 1st floor and 3rd floor onwards, including all typical floors (toilets, kitchens, balconies, terraces, FRP). Mockup floor approved."
            : "Procurement package for Aquina. Switch projects any time; each one keeps its own BOQ and vendor comparison."}
        </p>

        {/* Metadata Details */}
        <dl className="vinayak-dl">
          <dt>Category</dt>
          <dd>{isAmara ? "Waterproofing (Civil)" : "Road Work & Paving"}</dd>
          <dt>Timeline</dt>
          <dd>{isAmara ? "Nov 2026 – Jun 2028" : "Oct 2026 – Mar 2027"}</dd>
          <dt>Source</dt>
          <dd>Farvision ERP</dd>
        </dl>

        {/* 12-Step SOP Audit Trail */}
        <section className="trail">
          <h2>12-step SOP</h2>
          <ol className="vinayak-ol">
            {sop.map((s, i) => (
              <li
                key={i}
                className={`vinayak-li ${i < at ? "done" : i === at ? "now" : ""}`}
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
