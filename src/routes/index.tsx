import { createFileRoute, Link } from "@tanstack/react-router";
import { useProducts } from "@/lib/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { PhotoReel } from "@/components/PhotoReel";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { RitualFilmStrip } from "@/components/sections/RitualFilmStrip";
import { Manifesto } from "@/components/sections/Manifesto";
import { SectionSeam } from "@/components/SectionSeam";
import { LoopVideo } from "@/components/LoopVideo";
import { useReveal } from "@/lib/useReveal";
import { useScrollScene, mapRange } from "@/lib/useScrollScene";
import specimenBg from "@/assets/specimen-bg.mp4.asset.json";
import specimenPoster from "@/assets/botanical-1.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Botanica — Hand-Distilled Apothecary" },
      {
        name: "description",
        content:
          "A small botanical atelier. Pressed oils, infused balms, and single-origin tinctures, decanted into amber glass.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="bg-background text-foreground overflow-x-clip perspective-2000">
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
              The Collection
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
  const { ref: sceneRef, progress } = useScrollScene<HTMLDivElement>();
  const ringRot = mapRange(progress, 0, 1, -40, 40);
  const innerRot = mapRange(progress, 0, 1, 60, -60);
  return (
    <section
      ref={sceneRef}
      className="relative bg-background text-foreground py-32 px-6 md:px-12 overflow-hidden perspective-2000"
    >
      {/* Botanical macro video behind a vitrine */}
      <div className="absolute inset-0">
        <LoopVideo
          src={specimenBg.url}
          poster={specimenPoster}
          className="absolute inset-0 size-full"
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 vignette" />
      </div>

      <div
        ref={ref}
        className="reveal relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        <div className="space-y-8">
          <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium">
            Single Specimen · 01
          </span>
          <h2 className="font-serif italic text-5xl md:text-7xl leading-[0.9]">
            One bottle. <br />
            One garden.
          </h2>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            Each flacon is hand-blended in small batches from a single season's harvest —
            traceable to the field, the press, and the hand that decanted it.
          </p>
          <Link
            to="/shop"
            className="inline-block px-10 py-4 bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all duration-500 hover:translate-y-[-2px]"
          >
            Browse the Apothecary
          </Link>
        </div>
        <div className="relative aspect-square flex items-center justify-center preserve-3d">
          {/* Orbiting copper rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute size-full border border-accent/30 rounded-full"
              style={{ transform: `rotate(${ringRot}deg)` }}
            />
            <div
              className="absolute size-[80%] border border-accent/40 rounded-full animate-orbit-reverse"
            />
            <div
              className="absolute size-[60%] border border-accent/20 rounded-full animate-orbit"
              style={{ transform: `rotate(${innerRot}deg)` }}
            />
            <div className="absolute size-[40%] border border-accent/50 rounded-full" />
          </div>
          <div className="relative z-10 size-56 rounded-full bg-gradient-to-br from-accent/50 to-transparent blur-3xl animate-drift" />
          <div className="absolute z-20 text-center bg-background/60 backdrop-blur-sm p-10 border border-accent/30 tilt-card shadow-vitrine">
            <div className="size-12 rounded-full border border-accent/40 mx-auto mb-4 flex items-center justify-center">
              <div className="size-2 bg-accent rounded-full animate-pulse" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] block mb-1 text-accent">
              Hand-poured
            </span>
            <span className="font-serif italic text-lg block">Amber Vial · 30ml</span>
            <span className="text-[8px] text-muted-foreground uppercase tracking-wider mt-2 block">
              Rotate to inspect
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

