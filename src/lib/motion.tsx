import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type MotionPreset = "cinematic" | "minimal" | "reduced";

export interface MotionConfig {
  /** Multiplier applied to translateZ ranges. */
  depthScale: number;
  /** Multiplier applied to rotateX/rotateY tilt. */
  tiltScale: number;
  /** Multiplier applied to opacity dimming. */
  fadeScale: number;
  /** Disable continuous loops / autoplay videos / marquees. */
  disableLoops: boolean;
  /** Scroll-snap mandatory on the unified page camera. */
  snapDefault: boolean;
}

const PRESETS: Record<MotionPreset, MotionConfig> = {
  cinematic: { depthScale: 1.0, tiltScale: 1.0, fadeScale: 1.0, disableLoops: false, snapDefault: false },
  minimal:   { depthScale: 0.45, tiltScale: 0.4, fadeScale: 0.6, disableLoops: false, snapDefault: false },
  reduced:   { depthScale: 0,    tiltScale: 0,   fadeScale: 0,   disableLoops: true,  snapDefault: false },
};

export interface SceneSample {
  id: string;
  label: string;
  progress: number;
  z: number;
  rotX: number;
}

interface MotionContextValue {
  preset: MotionPreset;
  setPreset: (p: MotionPreset) => void;
  config: MotionConfig;
  snap: boolean;
  setSnap: (v: boolean) => void;
  debug: boolean;
  setDebug: (v: boolean) => void;
  /** Stages publish their live samples; overlay subscribes. */
  reportScene: (sample: SceneSample) => void;
  unreportScene: (id: string) => void;
  subscribe: (cb: (samples: SceneSample[]) => void) => () => void;
}

const MotionCtx = createContext<MotionContextValue | null>(null);

const LS_KEY = "botanica.motion.v1";

function readPersisted(): { preset: MotionPreset; snap: boolean; debug: boolean } {
  if (typeof window === "undefined") return { preset: "cinematic", snap: false, debug: false };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { preset: "cinematic", snap: false, debug: false, ...JSON.parse(raw) };
  } catch {}
  return { preset: "cinematic", snap: false, debug: false };
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const initial = readPersisted();
  const [preset, setPresetState] = useState<MotionPreset>(initial.preset);
  const [snap, setSnapState] = useState<boolean>(initial.snap);
  const [debug, setDebugState] = useState<boolean>(initial.debug);

  // Honor OS reduced-motion as a one-time hint on first load.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches && !localStorage.getItem(LS_KEY)) setPresetState("reduced");
  }, []);

  const persist = useCallback((next: Partial<{ preset: MotionPreset; snap: boolean; debug: boolean }>) => {
    if (typeof window === "undefined") return;
    const merged = { preset, snap, debug, ...next };
    try { localStorage.setItem(LS_KEY, JSON.stringify(merged)); } catch {}
  }, [preset, snap, debug]);

  const setPreset = useCallback((p: MotionPreset) => { setPresetState(p); persist({ preset: p }); }, [persist]);
  const setSnap = useCallback((v: boolean) => { setSnapState(v); persist({ snap: v }); }, [persist]);
  const setDebug = useCallback((v: boolean) => { setDebugState(v); persist({ debug: v }); }, [persist]);

  const config = PRESETS[preset];

  // Apply scroll-snap on <html> at the camera root.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    if (snap && preset !== "reduced") {
      html.classList.add("scene-snap");
    } else {
      html.classList.remove("scene-snap");
    }
    return () => html.classList.remove("scene-snap");
  }, [snap, preset]);

  // Scene registry — published by Stage / FooterStage, consumed by debug overlay.
  const samplesRef = useRef<Map<string, SceneSample>>(new Map());
  const subsRef = useRef<Set<(s: SceneSample[]) => void>>(new Set());
  const rafRef = useRef<number | null>(null);

  const flush = useCallback(() => {
    rafRef.current = null;
    const list = Array.from(samplesRef.current.values());
    subsRef.current.forEach((cb) => cb(list));
  }, []);

  const reportScene = useCallback((sample: SceneSample) => {
    samplesRef.current.set(sample.id, sample);
    if (rafRef.current == null && typeof requestAnimationFrame !== "undefined") {
      rafRef.current = requestAnimationFrame(flush);
    }
  }, [flush]);

  const unreportScene = useCallback((id: string) => {
    samplesRef.current.delete(id);
  }, []);

  const subscribe = useCallback((cb: (s: SceneSample[]) => void) => {
    subsRef.current.add(cb);
    cb(Array.from(samplesRef.current.values()));
    return () => { subsRef.current.delete(cb); };
  }, []);

  const value = useMemo<MotionContextValue>(() => ({
    preset, setPreset, config, snap, setSnap, debug, setDebug,
    reportScene, unreportScene, subscribe,
  }), [preset, setPreset, config, snap, setSnap, debug, setDebug, reportScene, unreportScene, subscribe]);

  return <MotionCtx.Provider value={value}>{children}</MotionCtx.Provider>;
}

export function useMotion() {
  const ctx = useContext(MotionCtx);
  if (!ctx) {
    // Safe fallback for SSR / outside provider — cinematic defaults, no-op registry.
    return {
      preset: "cinematic" as MotionPreset,
      setPreset: () => {},
      config: PRESETS.cinematic,
      snap: false,
      setSnap: () => {},
      debug: false,
      setDebug: () => {},
      reportScene: () => {},
      unreportScene: () => {},
      subscribe: () => () => {},
    } satisfies MotionContextValue;
  }
  return ctx;
}
