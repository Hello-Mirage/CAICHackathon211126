"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Navigation, Layers, ArrowRight, Box, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";
import { useProcurementStore } from "@/lib/store";

export interface VinayakSiteLocation {
  id: string;
  name: string;
  projectKey: string;
  category: string;
  status: string;
  scope: string;
  address: string;
  coords: [number, number]; // [lat, lng]
  lead: string;
  bestBid: string;
  farvisionPackage: string;
  tag: string;
}

export const VINAYAK_LOCATIONS: VinayakSiteLocation[] = [
  {
    id: "amara",
    name: "Vinayak Amara (Towers 1 & 2)",
    projectKey: "Vinayak Amara",
    category: "High-Rise Residential (G+23 & G+24)",
    status: "Active Tender",
    scope: "Internal Waterproofing (Toilets, Kitchen, Balconies, FRP) - 4,200 SQM",
    address: "Premises No. 07-0718, Action Area-II G, Newtown, Kolkata – 700 135",
    coords: [22.5937, 88.4800],
    lead: "Arijit Dey (QS & Billing Engineer)",
    bestBid: "Purvyakruti Sales (₹27,31,700 — L1)",
    farvisionPackage: "PKG-AMR-WP-2026",
    tag: "Primary Site",
  },
  {
    id: "aquina",
    name: "Vinayak Aquina (Infrastructure & Road)",
    projectKey: "Vinayak Aquina",
    category: "Residential Enclave & Civil",
    status: "BOQ Approved",
    scope: "Permanent Internal Heavy Road Network (45MT Load Pavers) - 1,450 SQM",
    address: "Rajarhat Main Road, Near Chowmatha, Kolkata – 700 136",
    coords: [22.6241, 88.4682],
    lead: "Dipon Senapati (QS & Billing Engineer)",
    bestBid: "Matur Enterprise (Rajat Da)",
    farvisionPackage: "PKG-AQN-RD-2026",
    tag: "Infrastructure",
  },
  {
    id: "vista",
    name: "Vinayak Vista",
    projectKey: "Vinayak Vista",
    category: "Superstructure Ongoing",
    status: "Superstructure Ongoing",
    scope: "R.C.C Superstructure & MEP Conduiting",
    address: "Lake Town Block-A, VIP Road Connector, Kolkata – 700 089",
    coords: [22.6050, 88.4010],
    lead: "Molay Das (Project Manager)",
    bestBid: "Civil Closed / MEP Active",
    farvisionPackage: "PKG-VST-MEP-2026",
    tag: "Superstructure",
  },
  {
    id: "citrus",
    name: "Vinayak Citrus",
    projectKey: "Vinayak Citrus",
    category: "Completed Luxury Enclave",
    status: "Delivered & Occupied",
    scope: "Post-Handover Defect Liability & Facility Fitouts",
    address: "EM Bypass Connector, Near Kasba, Kolkata – 700 107",
    coords: [22.5150, 88.3980],
    lead: "Subhashis Roy (Site Engineer)",
    bestBid: "Delivered",
    farvisionPackage: "PKG-CTR-WTY-2025",
    tag: "Delivered",
  },
  {
    id: "hq",
    name: "Vinayak Group Corporate HQ",
    projectKey: "Corporate HQ",
    category: "Head Office & Farvision ERP Data Center",
    status: "Headquarters",
    scope: "Central Contracts & Planning / Executive HOD Approvals",
    address: "122/1R, Satyendranath Mazumdar Sarani, Hazra, Kalighat, Kolkata – 700 026",
    coords: [22.5204, 88.3498],
    lead: "Executive Management / Rishi Kyal",
    bestBid: "ERP Central Host",
    farvisionPackage: "FARVISION-CENTRAL",
    tag: "Head Office",
  },
];

export default function KolkataSiteMap() {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});

  const { setSelectedProject, setRawInputDraft, setStep, theme } = useProcurementStore();
  const [activeSite, setActiveSite] = useState<VinayakSiteLocation>(VINAYAK_LOCATIONS[0]);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      // Clean existing instance if re-initializing
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Center around Kolkata (New Town, Rajarhat, Hazra)
      const map = L.map(mapContainerRef.current, {
        center: [22.585, 88.42],
        zoom: 12,
        zoomControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      // OpenStreetMap Standard Tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add custom SVG icon markers
      VINAYAK_LOCATIONS.forEach((loc) => {
        const isSelected = loc.id === activeSite.id;
        const markerHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            background: ${loc.id === "hq" ? "#0f6b6b" : loc.id === "amara" ? "#e0b66a" : "#16404a"};
            border: 2px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <span style="color: ${loc.id === "amara" ? "#2a1d05" : "#ffffff"}; font-weight: bold; font-size: 14px;">
              ${loc.id === "hq" ? "HQ" : loc.name.slice(8, 10).toUpperCase()}
            </span>
            ${
              loc.status.includes("Tender")
                ? `<span style="
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 10px;
                    height: 10px;
                    background: #7fd1ae;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                  "></span>`
                : ""
            }
          </div>
        `;

        const icon = L.divIcon({
          className: "custom-site-marker",
          html: markerHtml,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker(loc.coords, { icon }).addTo(map);

        marker.on("click", () => {
          if (isMounted) {
            setActiveSite(loc);
            map.flyTo(loc.coords, 14, { duration: 1.2 });
          }
        });

        markersRef.current[loc.id] = marker;
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleFlyTo = (loc: VinayakSiteLocation) => {
    setActiveSite(loc);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(loc.coords, 14, { duration: 1 });
    }
  };

  const handleLaunchCopilot = (loc: VinayakSiteLocation) => {
    setSelectedProject(loc.projectKey);
    const draft = `${loc.name}\nLocation: ${loc.address}\nCategory: ${loc.category}\nScope: ${loc.scope}\nFarvision Package: ${loc.farvisionPackage}`;
    setRawInputDraft(draft);
    setStep(1);
    router.push("/dashboard");
  };

  return (
    <div className="relative flex-1 w-full h-[calc(100vh-4rem)] overflow-hidden flex flex-col md:flex-row" style={{ backgroundColor: "var(--bg)" }}>
      {/* Left Sidebar: Site Directory & Project Inspector */}
      <div
        className="w-full md:w-[380px] lg:w-[420px] h-auto md:h-full flex flex-col border-r z-10 shrink-0 shadow-xl overflow-y-auto"
        style={{
          backgroundColor: "var(--panel)",
          borderColor: "var(--line)",
        }}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
              OpenStreetMap · Farvision GIS
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded border" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
              5 Kolkata Sites
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1" style={{ fontFamily: "var(--head)", color: "var(--text)" }}>
            Kolkata Tower Map
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Geotagged locations of Vinayak Group residential towers, active procurement packages, and Farvision ERP nodes.
          </p>
        </div>

        {/* Selected Project Card */}
        <div className="p-4 sm:p-5 border-b space-y-3" style={{ backgroundColor: "var(--raise)", borderColor: "var(--line)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "rgba(127, 209, 174, 0.2)", color: "var(--good)" }}>
              {activeSite.status}
            </span>
            <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
              {activeSite.farvisionPackage}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold" style={{ fontFamily: "var(--head)", color: "var(--text)" }}>
              {activeSite.name}
            </h3>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
              {activeSite.address}
            </p>
          </div>

          <div className="p-2.5 rounded-lg border text-xs space-y-1" style={{ background: "var(--bg)", borderColor: "var(--line)" }}>
            <p className="font-semibold" style={{ color: "var(--accent)" }}>Current Scope:</p>
            <p style={{ color: "var(--text)" }}>{activeSite.scope}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]" style={{ color: "var(--muted)" }}>
            <div>QS Lead: <strong style={{ color: "var(--text)" }}>{activeSite.lead}</strong></div>
            <div>Top Bidder: <strong style={{ color: "var(--good)" }}>{activeSite.bestBid}</strong></div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => handleLaunchCopilot(activeSite)}
              className="btn-solid flex-1 text-xs flex items-center justify-center gap-1.5"
            >
              <span>Procure in Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/site-3d"
              className="btn-ghost text-xs flex items-center justify-center gap-1.5"
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D View</span>
            </Link>
          </div>
        </div>

        {/* Site List Navigation */}
        <div className="flex-1 p-3 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider px-2 pt-1" style={{ color: "var(--muted)" }}>
            All Vinayak Properties:
          </p>

          {VINAYAK_LOCATIONS.map((loc) => {
            const isSelected = loc.id === activeSite.id;
            return (
              <button
                key={loc.id}
                onClick={() => handleFlyTo(loc)}
                className="w-full text-left p-3 rounded-xl border transition-all text-xs space-y-1"
                style={{
                  backgroundColor: isSelected ? "var(--raise)" : "transparent",
                  borderColor: isSelected ? "var(--accent)" : "var(--line)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: isSelected ? "var(--accent)" : "var(--text)" }}>
                    {loc.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded border" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
                    {loc.tag}
                  </span>
                </div>
                <p className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
                  {loc.address.split(",")[1]?.trim() || loc.address}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Map Canvas Container */}
      <div className="flex-1 relative w-full h-[450px] md:h-full">
        {/* Map Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Quick Action Overlay */}
        <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-2 p-1.5 rounded-xl border backdrop-blur-md shadow-lg text-xs" style={{ background: "var(--panel)", borderColor: "var(--line)" }}>
          <button
            onClick={() => handleFlyTo(VINAYAK_LOCATIONS[0])}
            className="px-2.5 py-1 rounded hover:opacity-80 transition-all font-semibold"
            style={{ color: "var(--text)" }}
          >
            Newtown (Amara)
          </button>
          <button
            onClick={() => handleFlyTo(VINAYAK_LOCATIONS[1])}
            className="px-2.5 py-1 rounded hover:opacity-80 transition-all font-semibold"
            style={{ color: "var(--text)" }}
          >
            Rajarhat (Aquina)
          </button>
          <button
            onClick={() => handleFlyTo(VINAYAK_LOCATIONS[4])}
            className="px-2.5 py-1 rounded hover:opacity-80 transition-all font-semibold"
            style={{ color: "var(--text)" }}
          >
            Hazra (HQ)
          </button>
        </div>
      </div>
    </div>
  );
}
