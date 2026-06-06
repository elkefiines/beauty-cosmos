import { useScrollScene, mapRange } from "@/lib/useScrollScene";

/** Thin bronze line that sweeps horizontally as the user scrolls past it. */
export function SectionSeam() {
  const { ref, progress } = useScrollScene<HTMLDivElement>();
  const x = mapRange(progress, 0.2, 0.8, -100, 100);
  const op = mapRange(progress, 0.15, 0.5, 0, 1) * mapRange(progress, 0.5, 0.85, 1, 0);
  return (
    <div ref={ref} className="relative h-px w-full overflow-hidden bg-border">
      <div
        className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent"
        style={{
          transform: `translateX(${x}%)`,
          opacity: op,
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
