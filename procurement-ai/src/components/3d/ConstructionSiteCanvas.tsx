"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls, Grid, Text } from "@react-three/drei";
import { useProcurementStore } from "@/lib/store";

// Clean, realistic 3D Architectural Tower
function TowerModel({ isLightMode, isSelected, onClick }: { isLightMode: boolean; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[0, 0, 0]} onClick={onClick}>
      {/* Concrete Foundation Podium */}
      <mesh position={[0, 1.25, 0]} receiveShadow castShadow>
        <boxGeometry args={[9, 2.5, 9]} />
        <meshStandardMaterial
          color={isLightMode ? "#ffffff" : "#0f2e34"}
          roughness={0.4}
        />
      </mesh>

      {/* Main Architectural Tower Shaft */}
      <mesh
        position={[0, 11, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[6.8, 17, 6.8]} />
        <meshStandardMaterial
          color={
            isSelected
              ? isLightMode
                ? "#0f6b6b"
                : "#e0b66a"
              : hovered
              ? isLightMode
                ? "#cfdedb"
                : "#21505a"
              : isLightMode
              ? "#e1ecea"
              : "#16404a"
          }
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>

      {/* Clean Recessed Window Facade Bands */}
      {[3.5, 6.2, 8.9, 11.6, 14.3, 17.0].map((y, idx) => (
        <group key={idx}>
          {/* Floor Slab Accent Line */}
          <mesh position={[0, y, 0]}>
            <boxGeometry args={[7.0, 0.25, 7.0]} />
            <meshStandardMaterial color={isLightMode ? "#0f6b6b" : "#21505a"} roughness={0.5} />
          </mesh>
          {/* Architectural Glazing Band */}
          <mesh position={[0, y + 0.9, 3.42]}>
            <boxGeometry args={[5.8, 1.2, 0.05]} />
            <meshStandardMaterial
              color={isLightMode ? "#0f6b6b" : "#e0b66a"}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Rooftop Parapet Level */}
      <mesh position={[0, 20.2, 0]} castShadow>
        <boxGeometry args={[4.8, 1.4, 4.8]} />
        <meshStandardMaterial color={isLightMode ? "#0f6b6b" : "#0f2e34"} roughness={0.4} />
      </mesh>
    </group>
  );
}

// Clean 3D Road Infrastructure Model
function RoadModel({ isLightMode, isSelected, onClick }: { isLightMode: boolean; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[0, 0, 0]} onClick={onClick}>
      {/* Subgrade Base */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[16, 0.6, 7.5]} />
        <meshStandardMaterial color={isLightMode ? "#cfdedb" : "#16404a"} roughness={0.9} />
      </mesh>

      {/* Surface Road Layer */}
      <mesh
        position={[0, 0.8, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[15.6, 0.4, 7.0]} />
        <meshStandardMaterial
          color={
            isSelected
              ? isLightMode
                ? "#0f6b6b"
                : "#e0b66a"
              : hovered
              ? isLightMode
                ? "#cfdedb"
                : "#21505a"
              : isLightMode
              ? "#e1ecea"
              : "#0f2e34"
          }
          roughness={0.5}
        />
      </mesh>

      {/* Kerb Edges */}
      <mesh position={[0, 1.15, 3.6]} castShadow>
        <boxGeometry args={[15.6, 0.35, 0.25]} />
        <meshStandardMaterial color={isLightMode ? "#0f6b6b" : "#21505a"} />
      </mesh>
      <mesh position={[0, 1.15, -3.6]} castShadow>
        <boxGeometry args={[15.6, 0.35, 0.25]} />
        <meshStandardMaterial color={isLightMode ? "#0f6b6b" : "#21505a"} />
      </mesh>
    </group>
  );
}

export default function ConstructionSiteCanvas() {
  const { setSelectedProject, theme } = useProcurementStore();
  const isLightMode = theme === "light";

  // Isolated stage selection: "building" or "road"
  const [activeSpace, setActiveSpace] = useState<"building" | "road">("building");

  return (
    <div
      className="w-full h-full relative transition-colors duration-200"
      style={{ backgroundColor: "var(--bg-canvas)" }}
    >
      {/* Clean 3D Model Switcher */}
      <div
        className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl border shadow-xl backdrop-blur-md"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-muted)",
        }}
      >
        <button
          onClick={() => {
            setActiveSpace("building");
            setSelectedProject("Vinayak Amara");
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          style={{
            backgroundColor: activeSpace === "building" ? "var(--primary-accent)" : "transparent",
            color: activeSpace === "building" ? "#ffffff" : "var(--text-primary)",
          }}
        >
          Building Model
        </button>
        <button
          onClick={() => {
            setActiveSpace("road");
            setSelectedProject("Vinayak Aquina");
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          style={{
            backgroundColor: activeSpace === "road" ? "var(--primary-accent)" : "transparent",
            color: activeSpace === "road" ? "#ffffff" : "var(--text-primary)",
          }}
        >
          Road Model
        </button>
      </div>

      {/* 3D Viewport */}
      <Canvas
        shadows
        className="w-full h-full"
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

        {/* Ground Isometric Grid */}
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

        {activeSpace === "building" && (
          <TowerModel
            isLightMode={isLightMode}
            isSelected={true}
            onClick={() => setSelectedProject("Vinayak Amara")}
          />
        )}

        {activeSpace === "road" && (
          <RoadModel
            isLightMode={isLightMode}
            isSelected={true}
            onClick={() => setSelectedProject("Vinayak Aquina")}
          />
        )}
      </Canvas>
    </div>
  );
}
