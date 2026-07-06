import { createFileRoute } from "@tanstack/react-router";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Aetheria" },
      { name: "description", content: "The terms of ordering, returns, and use of the Aetheria site." },
    ],
  }),
  component: () => (
    <div className="perspective-2000">
      <Stage label="Terms" depth={120} tilt={3} seam={false}>
        <article className="pt-32 pb-24 px-6 md:px-12 max-w-2xl mx-auto space-y-8 text-sm leading-relaxed text-foreground/85">
          <header>
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">Legal</span>
            <h1 className="font-serif italic text-5xl mb-3">Terms.</h1>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Last updated · 2026</p>
          </header>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">Ordering</h2>
            <p>
              This site currently operates in demonstration mode: orders are recorded and
              confirmed by email but no payment is taken. Prices and availability may change
              without notice. Formulas are natural and may vary from one season to the next.
            </p>
          </section>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">Shipping</h2>
            <p>
              Complimentary shipping on orders over $100. Below that, a flat $8 is applied.
              Orders are decanted and shipped from Brussels within three working days.
            </p>
          </section>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">Returns</h2>
            <p>
              Unopened items may be returned within 30 days for a full refund. Opened items
              may be exchanged once for a different shade or scent. Custom decants are final.
            </p>
          </section>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">Refills</h2>
            <p>
              All glassware is refillable and returnable for a small credit. Return using the
              prepaid label enclosed with your order.
            </p>
          </section>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">Intellectual property</h2>
            <p>
              Imagery, copy, formulations, and the site's visual language remain the property
              of the atelier. You may share single images and quotes with attribution; bulk
              reproduction is not permitted.
            </p>
          </section>

          <section>
            <h2 className="font-serif italic text-2xl mb-3">Liability &amp; jurisdiction</h2>
            <p>
              We stand behind our formulas but cannot be held liable for individual sensitivity
              — always patch-test. These terms are governed by the laws of Belgium; disputes fall
              under the courts of Brussels.
            </p>
          </section>
        </article>
      </Stage>
    </div>
  ),
});
