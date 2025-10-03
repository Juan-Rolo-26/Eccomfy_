"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

type BoxPreviewProps = {
  style: string;
  viewMode: "flat" | "3d";
  rotation: number;
  zoom: number;
  onRotationChange: (value: number) => void;
  onZoomChange: (value: number) => void;
  hasInteriorPrint: boolean;
};

type Palette = {
  base: string;
  accent: string;
  lighting: string;
};

const STYLE_PALETTES: Record<string, Palette> = {
  shipper: { base: "#F3F0FF", accent: "#0A1E3D", lighting: "#D7E3FF" },
  product: { base: "#FFF5E6", accent: "#AA2E25", lighting: "#FFE8CC" },
  mailer: { base: "#EAFBF3", accent: "#1C4532", lighting: "#D0F5E4" },
};

const DEFAULT_PALETTE: Palette = {
  base: "#F5F6FF",
  accent: "#1A365D",
  lighting: "#E2E8F0",
};

const BOX_SIZE: [number, number, number] = [2, 1, 1];

function normalizeRotation(value: number) {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function BoxMesh({
  rotationDeg,
  scale,
  palette,
  hasInteriorPrint,
}: {
  rotationDeg: number;
  scale: number;
  palette: Palette;
  hasInteriorPrint: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(rotationDeg);

  const materials = useMemo(() => {
    const outer = new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.base),
      roughness: 0.32,
      metalness: 0.12,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.accent),
      roughness: 0.28,
      metalness: 0.18,
    });
    const inside = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hasInteriorPrint ? palette.accent : "#f7fafc"),
      roughness: 0.45,
      side: THREE.BackSide,
    });
    return { outer, inside, accent };
  }, [palette, hasInteriorPrint]);

  useFrame(() => {
    targetRotation.current = rotationDeg;
    if (!groupRef.current) return;
    const current = groupRef.current.rotation.y;
    const desired = toRadians(targetRotation.current);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(current, desired, 0.2);
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <mesh castShadow receiveShadow material={materials.outer}>
        <boxGeometry args={BOX_SIZE} />
      </mesh>
      <mesh scale={[0.98, 0.98, 0.98]} material={materials.inside}>
        <boxGeometry args={BOX_SIZE} />
      </mesh>
      <mesh position={[0, BOX_SIZE[1] / 2 + 0.005, 0]} material={materials.accent}>
        <planeGeometry args={[BOX_SIZE[0] * 0.72, BOX_SIZE[2] * 0.72]} />
      </mesh>
    </group>
  );
}

function FlatPreview({ palette }: { palette: Palette }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-[2.5rem] border border-[#d1d5ff] bg-gradient-to-br from-white via-white to-[#f5f6ff] p-8 text-brand-blue">
      <div className="grid w-full max-w-md grid-cols-3 gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">
        <div className="col-span-3 rounded-2xl border border-[#cbd5f5] bg-gradient-to-r from-white to-[#eef1ff] p-6 text-center">
          Tapa
        </div>
        <div className="col-span-2 rounded-2xl border border-[#cbd5f5] bg-gradient-to-b from-white to-[#eef1ff] p-6 text-center">
          Frente
        </div>
        <div className="rounded-2xl border border-[#cbd5f5] bg-gradient-to-b from-white to-[#eef1ff] p-6 text-center">
          Lateral
        </div>
        <div className="col-span-3 rounded-2xl border border-[#cbd5f5] bg-gradient-to-r from-white to-[#eef1ff] p-6 text-center">
          Base
        </div>
      </div>
      <p className="mt-6 text-xs text-brand-blue/70">Dieline listo para edición avanzada.</p>
      <div
        className="mt-6 h-2 w-20 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${palette.base}, ${palette.accent})`,
        }}
      />
    </div>
  );
}

export default function BoxPreview({
  style,
  viewMode,
  rotation,
  zoom,
  onRotationChange,
  onZoomChange,
  hasInteriorPrint,
}: BoxPreviewProps) {
  const palette = STYLE_PALETTES[style] ?? DEFAULT_PALETTE;
  const [dragging, setDragging] = useState(false);
  const lastX = useRef(0);

  const scale = Math.max(0.5, Math.min(2.2, zoom / 100));

  if (viewMode === "flat") {
    return <FlatPreview palette={palette} />;
  }

  return (
    <div
      className="relative h-full w-full select-none rounded-[3rem] border border-[#d1d5ff] bg-gradient-to-br from-white via-white to-[#f1f5ff]"
      onPointerDown={(event) => {
        setDragging(true);
        lastX.current = event.clientX;
      }}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      onPointerMove={(event) => {
        if (!dragging) return;
        const delta = event.clientX - lastX.current;
        lastX.current = event.clientX;
        onRotationChange(normalizeRotation(rotation + delta * 0.65));
      }}
      onWheel={(event) => {
        event.preventDefault();
        const next = THREE.MathUtils.clamp(zoom - event.deltaY * 0.05, 40, 220);
        onZoomChange(Math.round(next));
      }}
    >
      <Canvas
        shadows
        camera={{ position: [4.2, 2.9, 3.6], fov: 42 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#f5f6ff"]} />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[6, 8, 4]}
          intensity={0.9}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight
          position={[-4, 6, -6]}
          angle={0.6}
          intensity={0.35}
          color={palette.lighting}
        />
        <BoxMesh
          rotationDeg={rotation}
          scale={scale}
          palette={palette}
          hasInteriorPrint={hasInteriorPrint}
        />
        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.35}
          scale={6}
          blur={2.5}
          far={4}
        />
        <Environment preset="city" />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center text-xs uppercase tracking-[0.3em] text-brand-blue/70">
        Arrastrá para rotar • Zoom {zoom}%
      </div>
    </div>
  );
}
