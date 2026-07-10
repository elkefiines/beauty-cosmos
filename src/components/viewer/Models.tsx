import { useRef } from "react";
import type { Mesh, Group } from "three";

const matte = (color: string) => ({ color, roughness: 0.55, metalness: 0.05 });
const glossy = (color: string) => ({ color, roughness: 0.15, metalness: 0.4 });
const glass = (color: string) => ({ color, roughness: 0.05, metalness: 0.1, transmission: 0.6, thickness: 0.5, transparent: true, opacity: 0.85 });

export function LipstickModel({ color }: { color: string }) {
  const ref = useRef<Group>(null);
  return (
    <group ref={ref}>
      {/* Base tube */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 1.2, 64]} />
        <meshStandardMaterial {...glossy("#1c1c1c")} />
      </mesh>
      {/* Band */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.46, 0.06, 64]} />
        <meshStandardMaterial {...glossy("#a67c52")} />
      </mesh>
      {/* Bullet */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.4, 1.0, 64]} />
        <meshStandardMaterial {...matte(color)} />
      </mesh>
      {/* Tip */}
      <mesh position={[0.13, 1.25, 0]} rotation={[0, 0, -0.5]} castShadow>
        <coneGeometry args={[0.32, 0.45, 64]} />
        <meshStandardMaterial {...matte(color)} />
      </mesh>
    </group>
  );
}

export function FoundationModel({ color }: { color: string }) {
  const ref = useRef<Group>(null);
  return (
    <group ref={ref}>
      {/* Bottle body */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[1.1, 1.6, 0.55]} />
        <meshPhysicalMaterial {...glass(color)} />
      </mesh>
      {/* Shoulder */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.55, 0.18, 0.4]} />
        <meshPhysicalMaterial {...glass(color)} />
      </mesh>
      {/* Pump cap */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.35, 32]} />
        <meshStandardMaterial {...matte("#1c1c1c")} />
      </mesh>
      {/* Nozzle */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 24]} />
        <meshStandardMaterial {...matte("#1c1c1c")} />
      </mesh>
    </group>
  );
}

export function SerumModel({ color }: { color: string }) {
  const ref = useRef<Group>(null);
  return (
    <group ref={ref}>
      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 1.4, 64]} />
        <meshPhysicalMaterial {...glass(color)} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.25, 32]} />
        <meshStandardMaterial {...matte("#a67c52")} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.3, 32]} />
        <meshStandardMaterial {...matte("#1c1c1c")} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial {...matte("#1c1c1c")} />
      </mesh>
    </group>
  );
}

export function FragranceModel({ color }: { color: string }) {
  const ref = useRef<Group>(null);
  return (
    <group ref={ref}>
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[1.3, 1.6, 0.4]} />
        <meshPhysicalMaterial {...glass(color)} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.7, 0.5, 0.32]} />
        <meshStandardMaterial {...matte("#a67c52")} />
      </mesh>
    </group>
  );
}

export function ModelByKind({ kind, color }: { kind: string; color: string }) {
  switch (kind) {
    case "lipstick": return <LipstickModel color={color} />;
    case "foundation": return <FoundationModel color={color} />;
    case "serum": return <SerumModel color={color} />;
    case "fragrance": return <FragranceModel color={color} />;
    default: return <LipstickModel color={color} />;
  }
}
// Avoid unused warnings for Mesh import
export type { Mesh };
