"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls, Grid, Text } from "@react-three/drei";
import * as THREE from "three";
import { useProcurementStore, SelectedAsset } from "@/lib/store";

// Detailed Amara Tower-2 Component: Proper G+23 Floor Structure with clean embedded balconies
function AmaraTower2Detailed({ isLightMode, isSelected, onClick }: { isLightMode: boolean; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  // Tower dimension specs:
  // Base footprint: 8m x 8m, 2m high
  // Tower shaft: 6.4m x 6.4m, 16m high
  // Floor levels (y from 3 to 17)
  const floorLevels = [3.5, 6.0, 8.5, 11.0, 13.5, 16.0];

  return (
    <group position={[0, 0, 0]} onClick={onClick}>
      {/* Foundation Concrete Footing */}
      <mesh position={[0, 1, 0]} receiveShadow castShadow>
        <boxGeometry args={[9, 2, 9]} />
        <meshStandardMaterial
          color={isLightMode ? "#EDCDBB" : "#0F4C75"}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Main High-Rise Core Shaft */}
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
        <boxGeometry args={[6.4, 16, 6.4]} />
        <meshStandardMaterial
          color={isSelected ? (isLightMode ? "#BF9270" : "#3282B8") : hovered ? (isLightMode ? "#E3B7A0" : "#266d9c") : (isLightMode ? "#f7dfcf" : "#1B262C")}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Clean Horizontal Floor Slabs & Integrated Waterproofing Balconies */}
      {floorLevels.map((y, idx) => (
        <group key={idx}>
          {/* Concrete Floor Slab Plate */}
          <mesh position={[0, y, 0]} receiveShadow>
            <boxGeometry args={[6.8, 0.3, 6.8]} />
            <meshStandardMaterial color={isLightMode ? "#D9B8A2" : "#334155"} roughness={0.5} />
          </mesh>

          {/* Front Integrated Balcony Tray (WP.06 / WP.07 Waterproofing Zone) */}
          <mesh position={[0, y + 0.15, 3.6]} receiveShadow castShadow>
            <boxGeometry args={[4.2, 0.35, 0.8]} />
            <meshStandardMaterial color={isLightMode ? "#BF9270" : "#00d294"} roughness={0.3} />
          </mesh>
          {/* Side Integrated Kitchen Wash Slab (WP.04 / WP.05) */}
          <mesh position={[3.6, y + 0.15, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.8, 0.35, 3.8]} />
            <meshStandardMaterial color={isLightMode ? "#BF9270" : "#3080ff"} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Roof Parapet & Overhead Water Tank (OWHT Waterproofing WP.10.B) */}
      <mesh position={[0, 18.8, 0]} castShadow>
        <boxGeometry args={[4.5, 1.6, 4.5]} />
        <meshStandardMaterial color={isLightMode ? "#BF9270" : "#3282B8"} roughness={0.3} />
      </mesh>
      <mesh position={[0, 20.0, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 1.0, 16]} />
        <meshStandardMaterial color={isLightMode ? "#A67A5B" : "#BBE1FA"} metalness={0.4} />
      </mesh>

      {/* 3D Information Tag */}
      <Text
        position={[0, 22.5, 0]}
        fontSize={1.1}
        color={isLightMode ? "#2A1810" : "#BBE1FA"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.09}
        outlineColor={isLightMode ? "#FFEDDB" : "#090d16"}
      >
        {"Vinayak Amara — Tower 2\n(Waterproofing Scope: WP.01 - WP.07)"}
      </Text>
    </group>
  );
}

// Detailed Aquina Road Component: Clean Layered Civil Cross-Section
function AquinaRoadDetailed({ isLightMode, isSelected, onClick }: { isLightMode: boolean; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[0, 0, 0]} onClick={onClick}>
      {/* Layer 1: Sub-grade / Silver Sand Filling (200mm) */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[16, 0.5, 7.5]} />
        <meshStandardMaterial color={isLightMode ? "#E3B7A0" : "#5a4537"} roughness={0.9} />
      </mesh>

      {/* Layer 2: 100mm WBM Jhama Brick Foundation */}
      <mesh position={[0, 0.75, 0]} receiveShadow>
        <boxGeometry args={[15.6, 0.5, 7.1]} />
        <meshStandardMaterial color={isLightMode ? "#D9B8A2" : "#3d4b56"} roughness={0.7} />
      </mesh>

      {/* Layer 3: 80mm Heavy Paver Block Surface (45MT Fire Dept load) */}
      <mesh
        position={[0, 1.25, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[15, 0.5, 6.5]} />
        <meshStandardMaterial
          color={isSelected ? (isLightMode ? "#BF9270" : "#3282B8") : hovered ? (isLightMode ? "#E3B7A0" : "#266d9c") : (isLightMode ? "#c9a184" : "#1e3a5f")}
          roughness={0.4}
        />
      </mesh>

      {/* Precast Concrete Kerb Stones */}
      <mesh position={[0, 1.6, 3.4]} castShadow>
        <boxGeometry args={[15.2, 0.4, 0.3]} />
        <meshStandardMaterial color={isLightMode ? "#BF9270" : "#94a3b8"} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.6, -3.4]} castShadow>
        <boxGeometry args={[15.2, 0.4, 0.3]} />
        <meshStandardMaterial color={isLightMode ? "#BF9270" : "#94a3b8"} roughness={0.3} />
      </mesh>

      {/* Road Compactor Roller Marker */}
      <mesh position={[3.5, 2.0, 0]} castShadow>
        <boxGeometry args={[3.2, 1.2, 1.8]} />
        <meshStandardMaterial color={isLightMode ? "#C27D38" : "#f59e0b"} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* 3D Information Tag */}
      <Text
        position={[0, 4.2, 0]}
        fontSize={1.1}
        color={isLightMode ? "#2A1810" : "#BBE1FA"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.09}
        outlineColor={isLightMode ? "#FFEDDB" : "#090d16"}
      >
        {"Vinayak Aquina — Internal Road\n(45 MT Fire Authority Paver Road)"}
      </Text>
    </group>
  );
}

// Detailed Amara Tower-1 Component: Civil Superstructure Finished
function AmaraTower1Detailed({ isLightMode, isSelected, onClick }: { isLightMode: boolean; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[0, 0, 0]} onClick={onClick}>
      {/* Tower Base */}
      <mesh position={[0, 1, 0]} receiveShadow castShadow>
        <boxGeometry args={[8, 2, 8]} />
        <meshStandardMaterial color={isLightMode ? "#EDCDBB" : "#0F4C75"} roughness={0.4} />
      </mesh>

      {/* Tower Shaft */}
      <mesh
        position={[0, 9.5, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[6.8, 15, 6.8]} />
        <meshStandardMaterial
          color={isSelected ? (isLightMode ? "#BF9270" : "#3282B8") : hovered ? (isLightMode ? "#E3B7A0" : "#334155") : (isLightMode ? "#EDCDBB" : "#1B262C")}
          roughness={0.4}
        />
      </mesh>

      {/* Facade Glazing Ribbon Elements */}
      {[-2, 1, 4, 7, 10, 13].map((y, i) => (
        <mesh key={i} position={[0, y + 2.5, 3.45]}>
          <boxGeometry args={[5.8, 0.7, 0.1]} />
          <meshStandardMaterial color={isLightMode ? "#BF9270" : "#38bdf8"} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* 3D Information Tag */}
      <Text
        position={[0, 19.5, 0]}
        fontSize={1.1}
        color={isLightMode ? "#2A1810" : "#BBE1FA"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.09}
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

  // Dedicated single-building mode only. Default to active requirement "amara-tower2".
  const [activeSpace, setActiveSpace] = useState<string>("amara-tower2");

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
    }
  };

  return (
    <div
      className="w-full h-full relative transition-colors duration-200"
      style={{ backgroundColor: "var(--bg-canvas)" }}
    >
      {/* Building Space Switcher Bar (Isolated Dedicated Spaces Only) */}
      <div
        className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border shadow-xl backdrop-blur-md"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-muted)",
        }}
      >
        <span className="text-[10px] font-mono px-2 py-1 font-bold uppercase tracking-wider text-slate-400">
          Isolated Space:
        </span>
        {[
          { id: "amara-tower2", label: "Amara: Tower-2 (Waterproofing)" },
          { id: "aquina-road", label: "Aquina: Main Road (45MT)" },
          { id: "amara-tower1", label: "Amara: Tower-1 (Structure)" },
        ].map((space) => {
          const isActive = activeSpace === space.id;
          return (
            <button
              key={space.id}
              onClick={() => handleSelectSpace(space.id)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
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
          position={[22, 22, 22]}
          zoom={26}
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

        {/* Ground Foundation Grid */}
        <Grid
          position={[0, 0, 0]}
          args={[40, 40]}
          cellSize={1}
          cellThickness={0.8}
          cellColor={isLightMode ? "#E3B7A0" : "#0F4C75"}
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor={isLightMode ? "#BF9270" : "#3282B8"}
          fadeDistance={50}
          infiniteGrid
        />

        {/* RENDER ONLY THE CURRENTLY SELECTED ISOLATED BUILDING */}
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
      </Canvas>
    </div>
  );
}
