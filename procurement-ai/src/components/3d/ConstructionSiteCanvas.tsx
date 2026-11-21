"use client";

import React, { useRef, useState } from "react";
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
}

function SiteBuilding({ position, size, color, hoverColor, label, asset }: ZoneProps) {
  const [hovered, setHovered] = useState(false);
  const { selectedAsset, setSelectedAsset } = useProcurementStore();
  const isSelected = selectedAsset?.id === asset.id;

  const activeColor = isSelected ? "#3b82f6" : hovered ? hoverColor : color;

  return (
    <group position={position}>
      {/* Base Foundation */}
      <mesh
        position={[0, size[1] / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedAsset(asset);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={activeColor}
          roughness={0.4}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Roof detailing */}
      <mesh position={[0, size[1] + 0.2, 0]}>
        <boxGeometry args={[size[0] * 0.9, 0.4, size[2] * 0.9]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* Label billboard in 3D */}
      <Text
        position={[0, size[1] + 2.2, 0]}
        fontSize={1.2}
        color={isSelected ? "#60a5fa" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor="#090d16"
      >
        {label}
      </Text>
    </group>
  );
}

function ConstructionCrane({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Vertical Tower */}
      <mesh position={[0, 8, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 16, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Horizontal Jib */}
      <mesh position={[2, 16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 14, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Counter Jib */}
      <mesh position={[-2.5, 16, 0]}>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}

export default function ConstructionSiteCanvas() {
  const { setSelectedAsset } = useProcurementStore();

  const assets: { zone: ZoneProps; id: string }[] = [
    {
      id: "amara-tower2",
      zone: {
        position: [-6, 0, -4],
        size: [6, 12, 6],
        color: "#64748b",
        hoverColor: "#94a3b8",
        label: "Amara: Tower-2\n(Waterproofing)",
        asset: {
          id: "amara-tower2",
          name: "Amara Tower-2",
          project: "Vinayak Amara",
          category: "Waterproofing",
          scope: "Ground, 1st & Typical Floors (Toilets, Kitchen, Balconies, FRP)",
          status: "pending",
          description: "Active requirement submitted by Site QS Arijit Dey for internal waterproofing across floors.",
          requirementsCount: 9,
        },
      },
    },
    {
      id: "aquina-road",
      zone: {
        position: [6, 0, 4],
        size: [10, 0.8, 6],
        color: "#475569",
        hoverColor: "#64748b",
        label: "Aquina: Main Road\n(Paving & WBM)",
        asset: {
          id: "aquina-road",
          name: "Aquina Internal Road",
          project: "Vinayak Aquina",
          category: "Road Work",
          scope: "Main Gate to Tower-2 Flat-B Side (45MT Fire Authority load specs)",
          status: "pending",
          description: "Internal road permanent work with paver blocks and silver sand filling.",
          requirementsCount: 17,
        },
      },
    },
    {
      id: "amara-tower1",
      zone: {
        position: [8, 0, -8],
        size: [5, 10, 5],
        color: "#334155",
        hoverColor: "#475569",
        label: "Amara: Tower-1\n(Structure Finished)",
        asset: {
          id: "amara-tower1",
          name: "Amara Tower-1",
          project: "Vinayak Amara",
          category: "Structural",
          scope: "Superstructure complete, MEP ongoing",
          status: "approved",
          description: "Tower 1 baseline complete, procurement closed for primary structure.",
          requirementsCount: 0,
        },
      },
    },
  ];

  return (
    <div className="w-full h-full relative bg-slate-950">
      {/* 3D Canvas with True Isometric Angle */}
      <Canvas
        shadows
        className="w-full h-full"
        onPointerDown={(e) => {
          // click background deselects
          if (e.target === e.currentTarget) {
            setSelectedAsset(null);
          }
        }}
      >
        {/* Orthographic Camera at 45-degree Isometric projection [20, 20, 20] */}
        <OrthographicCamera
          makeDefault
          position={[25, 25, 25]}
          zoom={22}
          near={-50}
          far={200}
        />
        <OrbitControls
          enableRotate={true}
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 6}
        />

        <ambientLight intensity={0.8} />
        <directionalLight
          position={[20, 30, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-15, 20, -10]} intensity={0.6} />

        {/* Site Ground Grid */}
        <Grid
          position={[0, 0, 0]}
          args={[40, 40]}
          cellSize={1}
          cellThickness={0.8}
          cellColor="#1e293b"
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor="#334155"
          fadeDistance={50}
          infiniteGrid
        />

        {/* Construction Assets */}
        {assets.map((item) => (
          <SiteBuilding key={item.id} {...item.zone} />
        ))}

        {/* Visual Construction Equipment */}
        <ConstructionCrane position={[-1, 0, -2]} />
        <ConstructionCrane position={[12, 0, 2]} />
      </Canvas>

      {/* Control Overlay Helper */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-300 pointer-events-none shadow-lg">
        <p className="font-semibold text-slate-100 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Isometric 3D Site Overview
        </p>
        <p className="text-slate-400 mt-1">Left Click + Drag: Rotate | Right Click: Pan | Scroll: Zoom</p>
        <p className="text-blue-400 mt-0.5">Click any 3D asset to inspect procurement items</p>
      </div>
    </div>
  );
}
