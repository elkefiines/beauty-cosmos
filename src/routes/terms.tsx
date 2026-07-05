import { createFileRoute } from "@tanstack/react-router";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms — Aetheria" }] }),
  component: () => (
    <div className="perspective-2000">
      <Stage label="Terms" depth={120} tilt={3} seam={false}>
        <article className="pt-32 pb-24 px-6 md:px-12 max-w-2xl mx-auto space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block">Legal</span>
          <h1 className="font-serif italic text-5xl">Terms.</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By ordering from Aetheria you agree that formulas are natural and may vary
            season to season. Unopened items may be returned within 30 days. Opened items
            are exchange-only.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All content — imagery, copy, formulations — remains the property of the atelier.
          </p>
        </article>
      </Stage>
    </div>
  ),
});
