import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  images: string[];
  activeIndex: number;
  accentHex?: string;
  className?: string;
};

/**
 * A cinematic 3D "vitrine" that levitates the real product photo on a
 * textured plane. Pointer moves the camera target for a parallax feel;
 * shade selection re-tints the rim light; switching image cross-fades.
 */
export function ProductShowcase3D({ images, activeIndex, accentHex = "#a67c52", className }: Props) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, 3.2], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#F2EFE9"]} />
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[3.5, 4.5, 3.5]}
          intensity={1.05}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-2.5, 1.5, 1.5]} intensity={0.6} color={accentHex} />
        <Suspense fallback={null}>
          <FloatingPhoto images={images} activeIndex={activeIndex} accentHex={accentHex} />
          <ContactShadows position={[0, -1.35, 0]} opacity={0.45} scale={6} blur={2.6} far={3} />
          <Environment preset="studio" />
        </Suspense>
        <ParallaxRig />
      </Canvas>
    </div>
  );
}

function ParallaxRig() {
  useFrame(({ camera, pointer, clock }) => {
    const t = clock.getElapsedTime();
    const targetX = pointer.x * 0.6 + Math.sin(t * 0.4) * 0.05;
    const targetY = 0.15 + pointer.y * 0.35;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function useImageTexture(url: string | undefined) {
  const [state, setState] = useState<{ tex: THREE.Texture | null; aspect: number }>({
    tex: null,
    aspect: 3 / 4,
  });

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      url,
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.needsUpdate = true;
        const img = tex.image as HTMLImageElement | undefined;
        const aspect = img?.width && img?.height ? img.width / img.height : 3 / 4;
        setState({ tex, aspect });
      },
      undefined,
      () => {
        // ignore load errors — plane stays blank
      }
    );
    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}

function FloatingPhoto({
  images,
  activeIndex,
  accentHex,
}: {
  images: string[];
  activeIndex: number;
  accentHex: string;
}) {
  const group = useRef<THREE.Group>(null);
  const matA = useRef<THREE.MeshStandardMaterial>(null);
  const matB = useRef<THREE.MeshStandardMaterial>(null);

  const [slotA, setSlotA] = useState(activeIndex);
  const [slotB, setSlotB] = useState(activeIndex);
  const [showA, setShowA] = useState(true);
  const fade = useRef(1);

  useEffect(() => {
    const currentSlot = showA ? slotA : slotB;
    if (activeIndex === currentSlot) return;
    if (showA) {
      setSlotB(activeIndex);
      setShowA(false);
    } else {
      setSlotA(activeIndex);
      setShowA(true);
    }
  }, [activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const a = useImageTexture(images[slotA]);
  const b = useImageTexture(images[slotB]);

  const sizeFor = (aspect: number) => {
    const h = 2.4;
    return [h * aspect, h] as const;
  };
  const [wA, hA] = useMemo(() => sizeFor(a.aspect), [a.aspect]);
  const [wB, hB] = useMemo(() => sizeFor(b.aspect), [b.aspect]);

  useFrame((_, dt) => {
    if (group.current) {
      const t = performance.now() * 0.0006;
      group.current.rotation.y = Math.sin(t) * 0.12;
      group.current.position.y = Math.sin(t * 1.4) * 0.04;
    }
    const target = showA ? 1 : 0;
    fade.current += (target - fade.current) * Math.min(1, dt * 5.5);
    if (matA.current) matA.current.opacity = fade.current;
    if (matB.current) matB.current.opacity = 1 - fade.current;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, -0.6]}>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial color={accentHex} transparent opacity={0.08} />
      </mesh>

      <mesh position={[0, 0, 0]} castShadow>
        <planeGeometry args={[wA, hA]} />
        <meshStandardMaterial
          ref={matA}
          map={a.tex ?? undefined}
          transparent
          opacity={1}
          roughness={0.6}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0, 0.002]} castShadow>
        <planeGeometry args={[wB, hB]} />
        <meshStandardMaterial
          ref={matB}
          map={b.tex ?? undefined}
          transparent
          opacity={0}
          roughness={0.6}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
