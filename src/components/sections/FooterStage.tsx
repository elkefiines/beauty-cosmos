import { ReactNode, useEffect, useId } from "react";
import { useScrollScene, mapRange } from "@/lib/useScrollScene";
import { useMotion } from "@/lib/motion";

/**
 * Footer wrapper — matches the Stage choreography so the camera continuity
 * from hero through body carries straight into the footer: the footer rises
 * from depth on the same Z range, tilts on the same X axis, and a copper
 * hairline scales in as the page comes to rest.
 */
export function FooterStage({ children }: { children: ReactNode }) {
  const { ref, progress } = useScrollScene<HTMLDivElement>();
  const { config, reportScene, unreportScene } = useMotion();
  const uid = useId();

  const D = 260 * config.depthScale;
  const T = 6 * config.tiltScale;

  // Mirror Stage: enter from depth → settle → small parallax drift.
  const z =
    mapRange(progress, 0, 0.5, -D, 0) +
    mapRange(progress, 0.7, 1, 0, -D * 0.25);
  const rotX = mapRange(progress, 0, 0.5, T, 0);
  const y = mapRange(progress, 0, 0.55, 90, 0) * (config.depthScale || 0.1);
  const op = mapRange(progress, 0, 0.4, 0, 1);
  const line = mapRange(progress, 0.1, 0.65, 0, 1);
  const seamX = mapRange(progress, 0.05, 0.55, -110, 110);
  const seamOp =
    mapRange(progress, 0.05, 0.3, 0, 1) * mapRange(progress, 0.4, 0.7, 1, 0);

  useEffect(() => {
    reportScene({ id: uid, label: "Footer", progress, z, rotX });
  }, [uid, progress, z, rotX, reportScene]);
  useEffect(() => () => unreportScene(uid), [uid, unreportScene]);

  return (
    <div ref={ref} className="scene-anchor relative preserve-3d" data-scene="footer">
      {/* Copper hairline that scales in (continuity sweep matching Stage seams) */}
      <div className="relative h-px w-full overflow-hidden bg-border">
        <div
          className="absolute inset-y-0 left-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-accent to-transparent"
          style={{ transform: `scaleX(${line})`, willChange: "transform" }}
        />
        <div
          className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent"
          style={{
            transform: `translateX(${seamX}%)`,
            opacity: seamOp,
            willChange: "transform, opacity",
          }}
        />
      </div>
      <div
        className="preserve-3d"
        style={{
          transform: `translate3d(0, ${y}px, ${z}px) rotateX(${rotX}deg)`,
          opacity: op,
          transformOrigin: "center top",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </div>
    </div>
  );
}
