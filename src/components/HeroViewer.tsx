import { lazy, Suspense, useEffect, useRef, useState } from "react";

const ProductViewer = lazy(() =>
  import("@/components/viewer/ProductViewer").then((m) => ({ default: m.ProductViewer }))
);

const sequence = [
  { kind: "lipstick", color: "#a23b3b", label: "Sculpted Rouge" },
  { kind: "serum", color: "#e0b46a", label: "Liquid Gold" },
  { kind: "fragrance", color: "#d8b48a", label: "Desert Bloom" },
  { kind: "foundation", color: "#c69a7a", label: "Second Skin" },
] as const;

export function HeroViewer() {
  const [mounted, setMounted] = useState(false);
  const [i, setI] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setI((v) => (v + 1) % sequence.length);
        setTransitioning(false);
      }, 550);
    }, 4600);
    return () => clearInterval(id);
  }, []);

  // Mouse-driven 3D tilt
  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    let raf = 0;
    let tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tx = py * -14;
      ty = px * 18;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        inner.style.transform = `rotateX(${tx}deg) rotateY(${ty}deg) translateZ(20px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      inner.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
    };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const current = sequence[i];

  return (
    <div ref={wrapRef} className="relative w-full aspect-[4/5] perspective-2000">
      <div className="absolute -inset-6 bg-gradient-to-br from-accent/30 to-foreground/5 blur-3xl rounded-full animate-drift" />
      <div
        ref={innerRef}
        className="relative size-full preserve-3d bg-surface border border-border overflow-hidden transition-transform duration-[900ms] ease-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={`absolute inset-0 transition-all duration-[600ms] ease-out ${
            transitioning ? "opacity-0 scale-90 blur-sm" : "opacity-100 scale-100 blur-0"
          }`}
        >
          {mounted ? (
            <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Preparing scene…</div>}>
              <ProductViewer
                key={i}
                kind={current.kind}
                color={current.color}
                className="absolute inset-0"
              />
            </Suspense>
          ) : null}
        </div>

        {/* Decorative concentric ring */}
        <div className="pointer-events-none absolute inset-8 border border-foreground/5 rounded-full animate-slow-spin" />

        <div className="absolute top-5 left-5 flex items-center gap-2 z-10">
          <div className="size-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            Live 3D · {current.kind}
          </span>
        </div>
        <div className="absolute bottom-5 left-5 z-10">
          <span className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
            Now Viewing
          </span>
          <span
            key={current.label}
            className="font-serif italic text-2xl text-foreground animate-rise inline-block"
          >
            {current.label}
          </span>
        </div>
        <div className="absolute bottom-5 right-5 flex gap-1.5 z-10">
          {sequence.map((_, idx) => (
            <span
              key={idx}
              className={`h-px transition-all duration-700 ${idx === i ? "w-10 bg-accent" : "w-4 bg-foreground/20"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
