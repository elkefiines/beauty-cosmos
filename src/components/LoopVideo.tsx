import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/lib/motion";

interface LoopVideoProps {
  src: string;
  poster?: string;
  className?: string;
  /** Pause when scrolled out of view to save CPU. Defaults to true. */
  pauseOffscreen?: boolean;
  /** Pixels of pre-mount margin so the video is ready before it enters view. */
  preloadMargin?: string;
}

/**
 * Lazy, muted, looping background video. Two-stage scroll-driven loading:
 *   1. When within `preloadMargin` of the viewport → mount + buffer metadata.
 *   2. When actually intersecting → play. When leaving → pause.
 * Honors the "reduced" motion preset by showing the poster only.
 */
export function LoopVideo({
  src,
  poster,
  className = "",
  pauseOffscreen = true,
  preloadMargin = "800px",
}: LoopVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const { config } = useMotion();
  const disabled = config.disableLoops;

  // Stage 1 — preload-ahead mount (large rootMargin).
  useEffect(() => {
    if (disabled) return;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShouldMount(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldMount(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: `${preloadMargin} 0px ${preloadMargin} 0px`, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [preloadMargin, disabled]);

  // Stage 2 — play/pause on actual visibility.
  useEffect(() => {
    if (disabled || !shouldMount) return;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = videoRef.current;
          if (!v) continue;
          if (e.isIntersecting) {
            if (v.paused) void v.play().catch(() => {});
          } else if (pauseOffscreen && !v.paused) {
            v.pause();
          }
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shouldMount, pauseOffscreen, disabled]);

  return (
    <div ref={wrapRef} className={className}>
      {shouldMount && !disabled ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 size-full object-cover"
        />
      ) : poster ? (
        <img
          src={poster}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </div>
  );
}
