import { createFileRoute } from "@tanstack/react-router";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — Aetheria" }] }),
  component: () => (
    <div className="perspective-2000">
      <Stage label="Privacy" depth={120} tilt={3} seam={false}>
        <article className="pt-32 pb-24 px-6 md:px-12 max-w-2xl mx-auto space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block">Legal</span>
          <h1 className="font-serif italic text-5xl">Privacy.</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We collect only what we need to send you an order and remember your ritual —
            email, name, shipping address. We never sell or share it. You may request deletion
            at any time by writing to the atelier.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our cart uses a browser-local session identifier so items persist between visits.
            No third-party trackers.
          </p>
        </article>
      </Stage>
    </div>
  ),
});
