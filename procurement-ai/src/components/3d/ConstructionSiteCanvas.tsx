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
}

function SiteBuilding({
  position,
  size,
  color,
  hoverColor,
  label,
  asset,
  isLightMode,
}: ZoneProps) {
  const [hovered, setHovered] = useState(false);
  const { selectedAsset, setSelectedAsset } = useProcurementStore();
  const isSelected = selectedAsset?.id === asset.id;

  const activeColor = isSelected
    ? isLightMode
      ? "#BF9270"
      : "#3282B8"
    : hovered
    ? hoverColor
    : color;

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
        />
      </mesh>

      {/* Roof detailing */}
      <mesh position={[0, size[1] + 0.2, 0]}>
        <boxGeometry args={[size[0] * 0.9, 0.4, size[2] * 0.9]} />
        <meshStandardMaterial
          color={isLightMode ? "#A67A5B" : "#1B262C"}
          roughness={0.6}
        />
      </mesh>

      {/* Label billboard in 3D */}
      <Text
        position={[0, size[1] + 2.2, 0]}
        fontSize={1.2}
        color={
          isSelected
            ? isLightMode
              ? "#7A4A28"
              : "#BBE1FA"
            : isLightMode
            ? "#2A1810"
            : "#ffffff"
        }
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.08}
        outlineColor={isLightMode ? "#FFEDDB" : "#090d16"}
      >
        {label}
      </Text>
    </group>
  );
}

function ConstructionCrane({
  position,
  isLightMode,
}: {
  position: [number, number, number];
  isLightMode: boolean;
}) {
  const craneColor = isLightMode ? "#C27D38" : "#f59e0b";
  return (
    <group position={position}>
      {/* Vertical Tower */}
      <mesh position={[0, 8, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 16, 8]} />
        <meshStandardMaterial color={craneColor} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Horizontal Jib */}
      <mesh position={[2, 16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 14, 8]} />
        <meshStandardMaterial color={craneColor} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Counter Jib */}
      <mesh position={[-2.5, 16, 0]}>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color={isLightMode ? "#7A5C4D" : "#475569"} />
      </mesh>
    </group>
  );
}

export default function ConstructionSiteCanvas() {
  const { setSelectedAsset, theme } = useProcurementStore();
  const isLightMode = theme === "light";

  const assets: { zone: Omit<ZoneProps, "isLightMode">; id: string }[] = [
    {
      id: "amara-tower2",
      zone: {
        position: [-6, 0, -4],
        size: [6, 12, 6],
        color: isLightMode ? "#EDCDBB" : "#0F4C75",
        hoverColor: isLightMode ? "#E3B7A0" : "#3282B8",
        label: "Amara: Tower-2\n(Waterproofing)",
        asset: {
          id: "amara-tower2",
          name: "Vinayak Amara (Tower-2)",
          project: "Vinayak Amara",
          category: "Waterproofing",
          scope: "Ground, 1st & Typical Floors (Toilets, Kitchen, Balconies, FRP)",
          status: "pending",
          description:
            "Active site requirement submitted by QS Arijit Dey for internal waterproofing across floors.",
          requirementsCount: 9,
        },
      },
    },
    {
      id: "aquina-road",
      zone: {
        position: [6, 0, 4],
        size: [10, 0.8, 6],
        color: isLightMode ? "#D9B8A2" : "#3282B8",
        hoverColor: isLightMode ? "#BF9270" : "#559ece",
        label: "Aquina: Main Road\n(Paving & WBM)",
        asset: {
          id: "aquina-road",
          name: "Vinayak Aquina (Internal Road)",
          project: "Vinayak Aquina",
          category: "Road Work",
          scope: "Main Gate to Tower-2 Flat-B Side (45MT Fire Authority load specs)",
          status: "pending",
          description:
            "Internal road permanent work with paver blocks, WBM foundation, and sand filling.",
          requirementsCount: 17,
        },
      },
    },
    {
      id: "amara-tower1",
      zone: {
        position: [8, 0, -8],
        size: [5, 10, 5],
        color: isLightMode ? "#CBB09E" : "#1B262C",
        hoverColor: isLightMode ? "#BA9883" : "#283b45",
        label: "Amara: Tower-1\n(Structure Finished)",
        asset: {
          id: "amara-tower1",
          name: "Vinayak Amara (Tower-1)",
          project: "Vinayak Amara",
          category: "Structural",
          scope: "Superstructure complete, MEP ongoing",
          status: "approved",
          description:
            "Tower 1 civil superstructure complete, procurement closed for primary structure.",
          requirementsCount: 0,
        },
      },
    },
  ];

  return (
    <div
      className="w-full h-full relative transition-colors duration-200"
      style={{ backgroundColor: "var(--bg-canvas)" }}
    >
      {/* 3D Canvas with True Isometric Angle */}
      <Canvas
        shadows
        className="w-full h-full"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedAsset(null);
          }
        }}
      >
        {/* Orthographic Camera at 45-degree Isometric projection */}
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

        {/* Construction Assets */}
        {assets.map((item) => (
          <SiteBuilding
            key={item.id}
            {...item.zone}
            isLightMode={isLightMode}
          />
        ))}

        {/* Construction Equipment */}
        <ConstructionCrane position={[-1, 0, -2]} isLightMode={isLightMode} />
        <ConstructionCrane position={[12, 0, 2]} isLightMode={isLightMode} />
      </Canvas>
    </div>
  );
}
