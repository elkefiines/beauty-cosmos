import { ReactNode, useEffect, useId } from "react";
import { useScrollScene, mapRange } from "@/lib/useScrollScene";
import { useMotion } from "@/lib/motion";

type StageProps = {
  children: ReactNode;
  /** Base depth in px — scaled by the active motion preset. */
  depth?: number;
  /** Base tilt in degrees — scaled by the active motion preset. */
  tilt?: number;
  className?: string;
  /** Show a copper hairline seam at the top of the stage. */
  seam?: boolean;
  /** Debug label shown in the scene overlay. */
  label?: string;
};

/**
 * Shared section wrapper participating in the page-level 3D camera.
 * Reads motion preset (cinematic / minimal / reduced) to scale depth/tilt.
 * Publishes live scroll samples to the debug overlay registry.
 * Acts as a scroll-snap anchor when snap mode is enabled.
 */
export function Stage({
  children,
  depth = 220,
  tilt = 6,
  className = "",
  seam = true,
  label,
}: StageProps) {
  const { ref, progress } = useScrollScene<HTMLDivElement>();
  const { config, reportScene, unreportScene } = useMotion();
  const uid = useId();

  const D = depth * config.depthScale;
  const T = tilt * config.tiltScale;

  const z =
    mapRange(progress, 0, 0.45, -D, 0) +
    mapRange(progress, 0.55, 1, 0, -D * 0.7);
  const rotX =
    mapRange(progress, 0, 0.45, T, 0) +
    mapRange(progress, 0.55, 1, 0, -T * 0.7);
  const op =
    1 -
    (1 - mapRange(progress, 0, 0.25, 0.35, 1)) * config.fadeScale -
    (1 - mapRange(progress, 0.75, 1, 1, 0.5)) * config.fadeScale;

  const seamX = mapRange(progress, 0.05, 0.55, -110, 110);
  const seamOp =
    mapRange(progress, 0.05, 0.3, 0, 1) * mapRange(progress, 0.4, 0.7, 1, 0);

  useEffect(() => {
    reportScene({
      id: uid,
      label: label ?? "Stage",
      progress,
      z,
      rotX,
    });
  }, [uid, label, progress, z, rotX, reportScene]);

  useEffect(() => () => unreportScene(uid), [uid, unreportScene]);

  return (
    <section
      ref={ref}
      className={`scene-anchor relative preserve-3d ${className}`}
      data-scene={label ?? "stage"}
    >
      {seam ? (
        <div className="absolute inset-x-0 top-0 h-px overflow-hidden bg-border pointer-events-none z-20">
          <div
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent"
            style={{
              transform: `translateX(${seamX}%)`,
              opacity: seamOp,
              willChange: "transform, opacity",
            }}
          />
        </div>
      ) : null}
      <div
        className="preserve-3d"
        style={{
          transform: `translate3d(0, 0, ${z}px) rotateX(${rotX}deg)`,
          opacity: Math.max(0, Math.min(1, op)),
          transformOrigin: "center top",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </div>
    </section>
  );
}
