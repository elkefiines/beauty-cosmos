import { createFileRoute, Link } from "@tanstack/react-router";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Aetheria" },
      { name: "description", content: "A small botanical atelier in Brussels. Cold-blended, single-origin, hand-decanted." },
      { property: "og:title", content: "About — Aetheria" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="perspective-2000">
      <Stage label="About Header" depth={140} tilt={4} seam={false}>
        <header className="pt-32 pb-16 px-6 md:px-12 max-w-4xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">The Atelier</span>
          <h1 className="font-serif italic text-5xl md:text-7xl leading-[0.95]">
            A small studio.<br/>A short list.
          </h1>
        </header>
      </Stage>

      <Stage label="About Body" depth={220} tilt={6}>
        <div className="px-6 md:px-12 pb-24 max-w-3xl mx-auto space-y-8 text-base leading-relaxed text-foreground/85">
          <p>
            Aetheria began in a converted greenhouse in Brussels. Two people, one press, and a
            question — could a cosmetic feel less like a purchase and more like a ritual.
          </p>
          <p>
            Every formula is cold-blended in small batches from a single season's harvest,
            traceable to the field, the press, and the hand that decanted it. We do not blend
            across seasons. What arrives in autumn will not be what arrives in spring, and that
            is the point.
          </p>
          <p id="sustainability" className="pt-8 border-t border-border">
            <span className="block text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Sustainability</span>
            All glass is refillable and returnable for a small credit. Outer packaging is recycled
            kraft, printed with soy inks. No new plastics have entered the atelier since 2024.
          </p>
        </div>
      </Stage>

      <Stage label="About CTA" depth={180} tilt={4}>
        <div className="px-6 md:px-12 pb-32 max-w-3xl mx-auto flex flex-wrap gap-4">
          <Link to="/shop" className="px-8 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors">
            Explore the shop
          </Link>
          <Link to="/journal" className="px-8 py-4 border border-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors">
            Read the journal
          </Link>
        </div>
      </Stage>
    </div>
  );
}
