import { ReactNode } from "react";
import { useScrollScene, mapRange } from "@/lib/useScrollScene";

type StageProps = {
  children: ReactNode;
  /** Visual intensity of the 3D motion. */
  depth?: number;
  /** Tilt amount in degrees applied on enter/exit. */
  tilt?: number;
  className?: string;
  /** Show a copper hairline seam at the top of the stage. */
  seam?: boolean;
};

/**
 * Shared section wrapper that participates in the single page-level 3D camera.
 * Each Stage uses its own scroll progress to recede/advance in Z and rotate
 * subtly on X — giving every section the same motion vocabulary so the page
 * reads as one continuous film instead of disconnected blocks.
 */
export function Stage({
  children,
  depth = 220,
  tilt = 6,
  className = "",
  seam = true,
}: StageProps) {
  const { ref, progress } = useScrollScene<HTMLDivElement>();

  // Enter from depth → settle at center → recede again on exit.
  const z =
    mapRange(progress, 0, 0.45, -depth, 0) +
    mapRange(progress, 0.55, 1, 0, -depth * 0.7);
  const rotX =
    mapRange(progress, 0, 0.45, tilt, 0) +
    mapRange(progress, 0.55, 1, 0, -tilt * 0.7);
  const op =
    mapRange(progress, 0, 0.25, 0.35, 1) *
    mapRange(progress, 0.75, 1, 1, 0.5);

  // Copper hairline seam sweeps across as the stage enters.
  const seamX = mapRange(progress, 0.05, 0.55, -110, 110);
  const seamOp =
    mapRange(progress, 0.05, 0.3, 0, 1) *
    mapRange(progress, 0.4, 0.7, 1, 0);

  return (
    <section ref={ref} className={`relative preserve-3d ${className}`}>
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
          opacity: op,
          transformOrigin: "center top",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </div>
    </section>
  );
}
