import { lazy, Suspense, useEffect, useState } from "react";

const ProductViewer = lazy(() =>
  import("@/components/viewer/ProductViewer").then((m) => ({ default: m.ProductViewer }))
);

const sequence = [
  { kind: "lipstick", color: "#a23b3b" },
  { kind: "serum", color: "#e0b46a" },
  { kind: "fragrance", color: "#d8b48a" },
  { kind: "foundation", color: "#c69a7a" },
] as const;

export function HeroViewer() {
  const [mounted, setMounted] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setI((v) => (v + 1) % sequence.length), 4200);
    return () => clearInterval(id);
  }, []);

  const current = sequence[i];

  return (
    <div className="relative w-full aspect-[4/5] perspective-1000">
      <div className="absolute -inset-4 bg-gradient-to-br from-accent/30 to-foreground/5 blur-3xl rounded-full" />
      <div className="relative size-full preserve-3d tilt-card bg-surface border border-border overflow-hidden">
        {mounted ? (
          <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Preparing scene…</div>}>
            <ProductViewer
              key={i}
              kind={current.kind}
              color={current.color}
              className="absolute inset-0 animate-rise"
            />
          </Suspense>
        ) : (
          <div className="absolute inset-0" />
        )}
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            Live 3D · {current.kind}
          </span>
        </div>
        <div className="absolute bottom-5 right-5 flex gap-1.5">
          {sequence.map((_, idx) => (
            <span
              key={idx}
              className={`h-px transition-all duration-500 ${idx === i ? "w-8 bg-accent" : "w-4 bg-foreground/20"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
