"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import Leaflet Map to avoid SSR issues
const KolkataSiteMap = dynamic(
  () => import("@/components/map/KolkataSiteMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg)] text-[var(--muted)]">
        Loading Vinayak Kolkata Site Map...
      </div>
    ),
  }
);

export default function MapViewPage() {
  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh-4rem)]">
      <KolkataSiteMap />
    </div>
  );
}

