import { useEffect, useState } from "react";
import { useMotion, type MotionPreset, type SceneSample } from "@/lib/motion";

const PRESETS: { id: MotionPreset; label: string }[] = [
  { id: "cinematic", label: "Cinematic" },
  { id: "minimal", label: "Minimal" },
  { id: "reduced", label: "Reduced" },
];

/** Floating controls — preset, snap, debug. */
export function MotionControls() {
  const { preset, setPreset, snap, setSnap, debug, setDebug } = useMotion();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Motion settings"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[60] size-11 rounded-full border border-accent/40 bg-background/80 backdrop-blur-md text-accent text-[10px] uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors shadow-vitrine"
      >
        3D
      </button>

      {open ? (
        <div className="fixed bottom-20 right-5 z-[60] w-72 p-5 rounded-md border border-accent/30 bg-background/90 backdrop-blur-xl text-foreground shadow-vitrine">
          <div className="text-[9px] uppercase tracking-[0.3em] text-accent mb-3">
            Motion Preset
          </div>
          <div className="grid grid-cols-3 gap-1 mb-5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={`text-[10px] uppercase tracking-[0.18em] py-2 border transition-colors ${
                  preset === p.id
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border hover:border-accent/60"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <label className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] mb-3 cursor-pointer">
            <span>Scroll Snap</span>
            <input
              type="checkbox"
              checked={snap}
              onChange={(e) => setSnap(e.target.checked)}
              className="accent-[color:var(--accent)]"
            />
          </label>
          <label className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] cursor-pointer">
            <span>Debug Overlay</span>
            <input
              type="checkbox"
              checked={debug}
              onChange={(e) => setDebug(e.target.checked)}
              className="accent-[color:var(--accent)]"
            />
          </label>
        </div>
      ) : null}

      <SceneDebugOverlay />
    </>
  );
}

function SceneDebugOverlay() {
  const { debug, subscribe, preset, snap } = useMotion();
  const [samples, setSamples] = useState<SceneSample[]>([]);

  useEffect(() => {
    if (!debug) return;
    return subscribe(setSamples);
  }, [debug, subscribe]);

  if (!debug) return null;

  const active = samples.filter((s) => s.progress > 0.001 && s.progress < 0.999);
  // Continuity: max gap between consecutive section progress windows
  // (lower = smoother camera handoff)
  const sorted = [...samples].sort((a, b) => a.progress - b.progress);

  return (
    <div className="fixed top-20 left-5 z-[60] w-80 p-4 rounded-md border border-accent/30 bg-background/85 backdrop-blur-xl text-foreground font-mono text-[10px] shadow-vitrine pointer-events-none">
      <div className="flex justify-between mb-2 text-accent uppercase tracking-[0.2em] text-[9px]">
        <span>Scene Debug</span>
        <span>
          {preset} · {snap ? "snap" : "free"}
        </span>
      </div>
      <div className="mb-2 text-muted-foreground">
        Active: {active.length}/{samples.length}
      </div>
      <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
        {sorted.map((s) => {
          const pct = Math.round(s.progress * 100);
          const isActive = s.progress > 0.001 && s.progress < 0.999;
          return (
            <div key={s.id} className={isActive ? "opacity-100" : "opacity-40"}>
              <div className="flex justify-between">
                <span className="truncate max-w-[140px]">{s.label}</span>
                <span className="tabular-nums">
                  z{s.z.toFixed(0)} · r{s.rotX.toFixed(1)}°
                </span>
              </div>
              <div className="relative h-1 bg-border mt-0.5 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
