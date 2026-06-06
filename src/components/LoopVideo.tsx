import { useEffect, useRef, useState } from "react";

interface LoopVideoProps {
  src: string;
  poster?: string;
  className?: string;
  /** Pause when scrolled out of view to save CPU. Defaults to true. */
  pauseOffscreen?: boolean;
}

/**
 * Lazy, muted, looping background video. Mounts the <video> only after the
 * element enters the viewport so SSR/initial paint stays light.
 */
export function LoopVideo({
  src,
  poster,
  className = "",
  pauseOffscreen = true,
}: LoopVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
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
            const v = videoRef.current;
            if (v && v.paused) void v.play().catch(() => {});
          } else if (pauseOffscreen) {
            const v = videoRef.current;
            if (v && !v.paused) v.pause();
          }
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pauseOffscreen]);

  return (
    <div ref={wrapRef} className={className}>
      {shouldMount ? (
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
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </div>
  );
}
