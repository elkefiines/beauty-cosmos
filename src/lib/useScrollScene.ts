import { useEffect, useRef, useState } from "react";

/**
 * Returns scroll progress (0 → 1) of an element traversing the viewport.
 * 0 = element top at bottom of viewport (just entering)
 * 0.5 = element center at viewport center
 * 1 = element bottom at top of viewport (just leaving)
 */
export function useScrollScene<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    let raf = 0;
    const compute = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when section top hits bottom of viewport, 1 when bottom hits top
      const total = r.height + vh;
      const traveled = vh - r.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      setProgress(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return { ref, progress };
}

/** Linearly map a 0-1 progress slice into a new range with clamping. */
export function mapRange(
  p: number,
  inA: number,
  inB: number,
  outA: number,
  outB: number
) {
  if (inB === inA) return outA;
  const t = Math.max(0, Math.min(1, (p - inA) / (inB - inA)));
  return outA + (outB - outA) * t;
}
