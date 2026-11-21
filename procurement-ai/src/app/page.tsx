"use client";

import dynamic from "next/dynamic";
import ProcurementDashboard from "@/components/dashboard/ProcurementDashboard";

// Dynamically import 3D Canvas to avoid SSR issues
const ConstructionSiteCanvas = dynamic(
  () => import("@/components/3d/ConstructionSiteCanvas"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* 3D Isometric Site Scene (Left ~58%) */}
      <section className="flex-[3] relative h-full">
        <ConstructionSiteCanvas />
      </section>

      {/* AI Procurement Operations Drawer/Dashboard (Right ~42%) */}
      <aside className="flex-[2] min-w-[460px] max-w-[620px] h-full shadow-2xl z-10">
        <ProcurementDashboard />
      </aside>
    </main>
  );
}
