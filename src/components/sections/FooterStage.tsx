import { ReactNode } from "react";
import { useScrollScene, mapRange } from "@/lib/useScrollScene";

/**
 * Footer wrapper — the camera dollies down, the footer rises from depth,
 * and a copper hairline sweeps across as the page comes to rest.
 */
export function FooterStage({ children }: { children: ReactNode }) {
  const { ref, progress } = useScrollScene<HTMLDivElement>();
  const y = mapRange(progress, 0, 0.6, 80, 0);
  const z = mapRange(progress, 0, 0.6, -260, 0);
  const op = mapRange(progress, 0, 0.4, 0, 1);
  const line = mapRange(progress, 0.1, 0.7, 0, 1);

  return (
    <div ref={ref} className="relative preserve-3d">
      <div className="relative h-px w-full overflow-hidden bg-border">
        <div
          className="absolute inset-y-0 left-0 h-px origin-left bg-gradient-to-r from-transparent via-accent to-transparent"
          style={{
            width: "100%",
            transform: `scaleX(${line})`,
            willChange: "transform",
          }}
        />
      </div>
      <div
        className="preserve-3d"
        style={{
          transform: `translate3d(0, ${y}px, ${z}px)`,
          opacity: op,
          willChange: "transform, opacity",
        }}
      >
        {children}
      </div>
    </div>
  );
}
