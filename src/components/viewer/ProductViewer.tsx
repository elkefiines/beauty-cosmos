import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { ModelByKind } from "./Models";

type Props = {
  kind: string;
  color: string;
  className?: string;
};

export function ProductViewer({ kind, color, className }: Props) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [2.4, 1.2, 3], fov: 35 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#F2EFE9"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
        <Suspense fallback={null}>
          <ModelByKind kind={kind} color={color} />
          <ContactShadows position={[0, -1.25, 0]} opacity={0.5} scale={6} blur={2.4} far={3} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}
