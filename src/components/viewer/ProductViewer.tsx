import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { ModelByKind } from "./Models";

type Props = {
  kind: string;
  color: string;
  className?: string;
};

export function ProductViewer({ kind, color, className }: Props) {
  const [interacting, setInteracting] = useState(false);

  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [2.4, 1.2, 3], fov: 35 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#F2EFE9"]} />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3, 2, 2]} intensity={0.7} color={color} />
        <Suspense fallback={null}>
          <ModelByKind kind={kind} color={color} />
          <ContactShadows
            position={[0, -1.25, 0]}
            opacity={0.5}
            scale={6}
            blur={2.4}
            far={3}
          />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={2.2}
          maxDistance={5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          autoRotate={!interacting}
          autoRotateSpeed={0.6}
          onStart={() => setInteracting(true)}
          onEnd={() => setInteracting(false)}
        />
      </Canvas>
    </div>
  );
}
