"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls, Grid, Text } from "@react-three/drei";
import * as THREE from "three";
import { useProcurementStore, SelectedAsset } from "@/lib/store";

interface ZoneProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  hoverColor: string;
  label: string;
  asset: SelectedAsset;
  isLightMode: boolean;
  floors?: number;
}

// Detailed Amara Tower-2 Component: Shows multi-level building with highlighted waterproofing zones
function AmaraTower2Detailed({ isLightMode, isSelected, onClick }: { isLightMode: boolean; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[0, 0, 0]} onClick={onClick}>
      {/* Ground Floor Podium */}
      <mesh position={[0, 1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[10, 3, 10]} />
        <meshStandardMaterial
          color={isLightMode ? "#EDCDBB" : "#0F4C75"}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Main Residential Tower (G+23 Floors representation) */}
      <mesh
        position={[0, 10, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[7, 14, 7]} />
        <meshStandardMaterial
          color={isSelected ? (isLightMode ? "#BF9270" : "#3282B8") : hovered ? (isLightMode ? "#E3B7A0" : "#266d9c") : (isLightMode ? "#f7dfcf" : "#14354c")}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Highlighted Waterproofing Zones (Toilets, Kitchen, Balconies bands) */}
      {[-2, 1, 4, 7, 10, 13].map((y, i) => (
        <group key={i}>
          {/* Balcony slab projections */}
          <mesh position={[0, y, 3.8]}>
            <boxGeometry args={[5, 0.4, 0.8]} />
            <meshStandardMaterial color={isLightMode ? "#BF9270" : "#00d294"} metalness={0.4} />
          </mesh>
          <mesh position={[3.8, y, 0]}>
            <boxGeometry args={[0.8, 0.4, 5]} />
            <meshStandardMaterial color={isLightMode ? "#BF9270" : "#00d294"} metalness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Roof Water Tank & Mumpty Room */}
      <mesh position={[0, 18, 0]} castShadow>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color={isLightMode ? "#BF9270" : "#3282B8"} />
      </mesh>

      {/* Floating 3D Badge */}
      <Text
        position={[0, 21.5, 0]}
        fontSize={1.2}
        color={isLightMode ? "#2A1810" : "#BBE1FA"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor={isLightMode ? "#FFEDDB" : "#090d16"}
      >
        {"Vinayak Amara — Tower 2\n(Active Waterproofing: WP.01 - WP.07)"}
      </Text>
    </group>
  );
}

// Detailed Aquina Road Component: Shows 45MT heavy load cross section and paver block laying
function AquinaRoadDetailed({ isLightMode, isSelected, onClick }: { isLightMode: boolean; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[0, 0, 0]} onClick={onClick}>
      {/* Subgrade / Sand filling base */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[18, 0.4, 8]} />
        <meshStandardMaterial color={isLightMode ? "#E3B7A0" : "#755240"} roughness={0.9} />
      </mesh>

      {/* 100mm WBM Jhama Brick Foundation */}
      <mesh position={[0, 0.6, 0]} receiveShadow>
        <boxGeometry args={[17.6, 0.4, 7.6]} />
        <meshStandardMaterial color={isLightMode ? "#D9B8A2" : "#475569"} roughness={0.7} />
      </mesh>

      {/* 80mm Heavy Paver Block Surface (45MT capacity) */}
      <mesh
        position={[0, 1.0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[17, 0.4, 7]} />
        <meshStandardMaterial
          color={isSelected ? (isLightMode ? "#BF9270" : "#3282B8") : hovered ? (isLightMode ? "#E3B7A0" : "#266d9c") : (isLightMode ? "#c9a184" : "#1e3a5f")}
          roughness={0.4}
        />
      </mesh>

      {/* Precast Kerb Stones along edges */}
      <mesh position={[0, 1.3, 3.6]} castShadow>
        <boxGeometry args={[17, 0.5, 0.3]} />
        <meshStandardMaterial color={isLightMode ? "#BF9270" : "#94a3b8"} />
      </mesh>
      <mesh position={[0, 1.3, -3.6]} castShadow>
        <boxGeometry args={[17, 0.5, 0.3]} />
        <meshStandardMaterial color={isLightMode ? "#BF9270" : "#94a3b8"} />
      </mesh>

      {/* Heavy Construction Vehicle / Roller placeholder */}
      <mesh position={[4, 1.8, 0]} castShadow>
        <boxGeometry args={[3.5, 1.5, 2]} />
        <meshStandardMaterial color={isLightMode ? "#C27D38" : "#f59e0b"} metalness={0.6} />
      </mesh>

      {/* 3D Badge */}
      <Text
        position={[0, 4.5, 0]}
        fontSize={1.1}
        color={isLightMode ? "#2A1810" : "#BBE1FA"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor={isLightMode ? "#FFEDDB" : "#090d16"}
      >
        {"Vinayak Aquina — Internal Road\n(45 MT Fire FSR Paver Road)"}
      </Text>
    </group>
  );
}

// Detailed Amara Tower-1 Component (Civil Finished)
function AmaraTower1Detailed({ isLightMode, isSelected, onClick }: { isLightMode: boolean; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[0, 0, 0]} onClick={onClick}>
      <mesh
        position={[0, 9, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[8, 18, 8]} />
        <meshStandardMaterial
          color={isSelected ? (isLightMode ? "#BF9270" : "#3282B8") : hovered ? (isLightMode ? "#E3B7A0" : "#334155") : (isLightMode ? "#EDCDBB" : "#1B262C")}
          roughness={0.5}
        />
      </mesh>

      {/* Glass Facade Bands */}
      {[-3, 0, 3, 6, 9, 12, 15].map((y, i) => (
        <mesh key={i} position={[0, y, 4.05]}>
          <boxGeometry args={[7, 0.8, 0.1]} />
          <meshStandardMaterial color={isLightMode ? "#BF9270" : "#38bdf8"} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* 3D Badge */}
      <Text
        position={[0, 20.5, 0]}
        fontSize={1.1}
        color={isLightMode ? "#2A1810" : "#BBE1FA"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor={isLightMode ? "#FFEDDB" : "#090d16"}
      >
        {"Vinayak Amara — Tower 1\n(Civil Structure Finished)"}
      </Text>
    </group>
  );
}

export default function ConstructionSiteCanvas() {
  const { selectedAsset, setSelectedAsset, setSelectedProject, theme } = useProcurementStore();
  const isLightMode = theme === "light";

  // Filter modes: "all" | "amara-tower2" | "aquina-road" | "amara-tower1"
  const [activeSpace, setActiveSpace] = useState<string>("all");

  const amaraTower2Asset: SelectedAsset = {
    id: "amara-tower2",
    name: "Vinayak Amara (Tower-2)",
    project: "Vinayak Amara",
    category: "Waterproofing",
    scope: "Ground, 1st & Typical Floors (Toilets, Kitchen, Balconies, FRP)",
    status: "pending",
    description: "Active site requirement submitted by QS Arijit Dey for internal waterproofing across floors.",
    requirementsCount: 9,
  };

  const aquinaRoadAsset: SelectedAsset = {
    id: "aquina-road",
    name: "Vinayak Aquina (Internal Road)",
    project: "Vinayak Aquina",
    category: "Road Work",
    scope: "Main Gate to Tower-2 Flat-B Side (45MT Fire Authority load specs)",
    status: "pending",
    description: "Internal road permanent work with paver blocks, WBM foundation, and sand filling.",
    requirementsCount: 17,
  };

  const amaraTower1Asset: SelectedAsset = {
    id: "amara-tower1",
    name: "Vinayak Amara (Tower-1)",
    project: "Vinayak Amara",
    category: "Structural",
    scope: "Superstructure complete, MEP ongoing",
    status: "approved",
    description: "Tower 1 civil superstructure complete, procurement closed for primary structure.",
    requirementsCount: 0,
  };

  const handleSelectSpace = (spaceId: string) => {
    setActiveSpace(spaceId);
    if (spaceId === "amara-tower2") {
      setSelectedAsset(amaraTower2Asset);
      setSelectedProject("Vinayak Amara");
    } else if (spaceId === "aquina-road") {
      setSelectedAsset(aquinaRoadAsset);
      setSelectedProject("Vinayak Aquina");
    } else if (spaceId === "amara-tower1") {
      setSelectedAsset(amaraTower1Asset);
      setSelectedProject("Vinayak Amara");
    } else {
      setSelectedAsset(null);
    }
  };

  return (
    <div
      className="w-full h-full relative transition-colors duration-200"
      style={{ backgroundColor: "var(--bg-canvas)" }}
    >
      {/* 3D Space Selector Pill Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border shadow-xl backdrop-blur-md"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-muted)",
        }}
      >
        <span className="text-[10px] font-mono px-2 py-1 font-bold uppercase tracking-wider text-slate-400">
          3D Space:
        </span>
        {[
          { id: "all", label: "Full Site Overview" },
          { id: "amara-tower2", label: "Amara: Tower-2 (Waterproofing)" },
          { id: "aquina-road", label: "Aquina: Main Road (45MT)" },
          { id: "amara-tower1", label: "Amara: Tower-1 (Structure)" },
        ].map((space) => {
          const isActive = activeSpace === space.id;
          return (
            <button
              key={space.id}
              onClick={() => handleSelectSpace(space.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
              style={{
                backgroundColor: isActive ? "var(--primary-accent)" : "transparent",
                color: isActive ? "#ffffff" : "var(--text-primary)",
              }}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              <span>{space.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        className="w-full h-full"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedAsset(null);
          }
        }}
      >
        <OrthographicCamera
          makeDefault
          position={activeSpace === "all" ? [25, 25, 25] : [20, 20, 20]}
          zoom={activeSpace === "all" ? 20 : 28}
          near={-50}
          far={250}
        />
        <OrbitControls
          enableRotate={true}
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 6}
        />

        <ambientLight intensity={isLightMode ? 1.0 : 0.8} />
        <directionalLight
          position={[20, 30, 10]}
          intensity={isLightMode ? 1.8 : 1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight
          position={[-15, 20, -10]}
          intensity={isLightMode ? 0.8 : 0.6}
        />

        {/* Site Ground Grid */}
        <Grid
          position={[0, 0, 0]}
          args={[50, 50]}
          cellSize={1}
          cellThickness={0.8}
          cellColor={isLightMode ? "#E3B7A0" : "#0F4C75"}
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor={isLightMode ? "#BF9270" : "#3282B8"}
          fadeDistance={60}
          infiniteGrid
        />

        {/* ISOLATED 3D SPACES */}
        {activeSpace === "amara-tower2" && (
          <AmaraTower2Detailed
            isLightMode={isLightMode}
            isSelected={selectedAsset?.id === "amara-tower2"}
            onClick={() => {
              setSelectedAsset(amaraTower2Asset);
              setSelectedProject("Vinayak Amara");
            }}
          />
        )}

        {activeSpace === "aquina-road" && (
          <AquinaRoadDetailed
            isLightMode={isLightMode}
            isSelected={selectedAsset?.id === "aquina-road"}
            onClick={() => {
              setSelectedAsset(aquinaRoadAsset);
              setSelectedProject("Vinayak Aquina");
            }}
          />
        )}

        {activeSpace === "amara-tower1" && (
          <AmaraTower1Detailed
            isLightMode={isLightMode}
            isSelected={selectedAsset?.id === "amara-tower1"}
            onClick={() => {
              setSelectedAsset(amaraTower1Asset);
              setSelectedProject("Vinayak Amara");
            }}
          />
        )}

        {/* FULL SITE OVERVIEW (Shows all 3 assets distributed on site) */}
        {activeSpace === "all" && (
          <group>
            {/* Amara Tower-2 position */}
            <group position={[-8, 0, -5]}>
              <AmaraTower2Detailed
                isLightMode={isLightMode}
                isSelected={selectedAsset?.id === "amara-tower2"}
                onClick={() => handleSelectSpace("amara-tower2")}
              />
            </group>

            {/* Aquina Internal Road position */}
            <group position={[6, 0, 8]}>
              <AquinaRoadDetailed
                isLightMode={isLightMode}
                isSelected={selectedAsset?.id === "aquina-road"}
                onClick={() => handleSelectSpace("aquina-road")}
              />
            </group>

            {/* Amara Tower-1 position */}
            <group position={[10, 0, -8]}>
              <AmaraTower1Detailed
                isLightMode={isLightMode}
                isSelected={selectedAsset?.id === "amara-tower1"}
                onClick={() => handleSelectSpace("amara-tower1")}
              />
            </group>
          </group>
        )}
      </Canvas>
    </div>
  );
}
