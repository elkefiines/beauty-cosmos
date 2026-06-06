import { createFileRoute, Link } from "@tanstack/react-router";
import { useProducts } from "@/lib/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { PhotoReel } from "@/components/PhotoReel";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { RitualFilmStrip } from "@/components/sections/RitualFilmStrip";
import { Manifesto } from "@/components/sections/Manifesto";
import { SectionSeam } from "@/components/SectionSeam";
import { useReveal } from "@/lib/useReveal";
import { useScrollScene, mapRange } from "@/lib/useScrollScene";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aetheria — The New Geometry of Beauty" },
      {
        name: "description",
        content:
          "A 3D cosmetics laboratory. Explore sculptural lipstick, foundation, skincare, and fragrance in three dimensions.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="bg-background text-foreground overflow-x-clip">
      <CinematicHero />
      <SectionSeam />
      <PhotoReel />
      <SectionSeam />
      <RitualFilmStrip />
      <SectionSeam />
      <ElementalForms />
      <SectionSeam />
      <Specimen />
      <SectionSeam />
      <Manifesto />
    </div>
  );
}

function ElementalForms() {
  const { data: products = [] } = useProducts();
  const featured = products.slice(0, 4);
  const { ref, progress } = useScrollScene<HTMLDivElement>();
  const z = mapRange(progress, 0, 0.5, -200, 0) + mapRange(progress, 0.5, 1, 0, -160);
  const rotX = mapRange(progress, 0, 0.5, 8, 0) + mapRange(progress, 0.5, 1, 0, -6);
  const op = mapRange(progress, 0, 0.35, 0, 1);

  return (
    <section
      ref={ref}
      className="relative py-32 px-6 md:px-12 perspective-2000 bg-background overflow-hidden"
    >
      <div
        className="max-w-7xl mx-auto preserve-3d"
        style={{
          transform: `translate3d(0, 0, ${z}px) rotateX(${rotX}deg)`,
          opacity: op,
          willChange: "transform, opacity",
        }}
      >
        <div className="flex justify-between items-end mb-20">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-3">
              Curated Series
            </span>
            <h2 className="font-serif italic text-5xl md:text-6xl">Elemental Forms</h2>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="w-12 h-px bg-foreground/20" />
            <span className="text-[10px] uppercase tracking-widest">
              01 — {String(featured.length).padStart(2, "0")}
            </span>
            <Link to="/shop" className="text-[10px] uppercase tracking-[0.25em] hover:text-accent">
              View All
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
          {featured.map((p, i) => (
            <div
              key={p.id}
              className={`tilt-card ${i % 2 === 1 ? "md:pt-12" : i === 2 ? "md:pt-6" : ""}`}
              style={{
                transitionDelay: `${i * 80}ms`,
                transform: `translateZ(${(i - 1.5) * 22}px)`,
              }}
            >
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Specimen() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="bg-foreground text-background py-32 px-6 md:px-12 overflow-hidden relative perspective-2000">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)]" />
      <div
        ref={ref}
        className="reveal max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10"
      >
        <div className="space-y-8">
          <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium">
            Interactive Specimen
          </span>
          <h2 className="font-serif italic text-5xl md:text-7xl leading-[0.9]">
            Inspect every <br />
            molecule.
          </h2>
          <p className="text-background/60 text-sm max-w-md leading-relaxed">
            Each formulation is rendered as a three-dimensional object. Rotate, study, and consider
            its architecture before it ever reaches your skin.
          </p>
          <Link
            to="/shop"
            className="inline-block px-10 py-4 bg-background text-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-accent hover:text-background transition-all duration-500 hover:translate-y-[-2px]"
          >
            Browse the Catalog
          </Link>
        </div>
        <div className="relative aspect-square flex items-center justify-center preserve-3d">
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="size-full border border-background rounded-full animate-slow-spin" />
            <div className="absolute size-[80%] border border-background/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            <div
              className="absolute size-[60%] border border-background/20 rounded-full animate-slow-spin"
              style={{ animationDuration: "25s" }}
            />
          </div>
          <div className="relative z-10 size-48 rounded-full bg-gradient-to-br from-accent/60 to-background/10 blur-2xl animate-drift" />
          <div className="absolute z-20 text-center bg-foreground/40 backdrop-blur-sm p-8 border border-background/10 tilt-card">
            <div className="size-12 rounded-full border border-background/20 mx-auto mb-3 flex items-center justify-center">
              <div className="size-2 bg-accent rounded-full animate-pulse" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] block mb-1">3D Environment</span>
            <span className="text-[8px] text-background/40 uppercase">Drag to rotate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
