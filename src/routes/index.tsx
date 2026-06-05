import { createFileRoute, Link } from "@tanstack/react-router";
import { useProducts } from "@/lib/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { HeroViewer } from "@/components/HeroViewer";
import { PhotoReel } from "@/components/PhotoReel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aetheria — The New Geometry of Beauty" },
      { name: "description", content: "A 3D cosmetics laboratory. Explore sculptural lipstick, foundation, skincare, and fragrance in three dimensions." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useProducts();
  const featured = products.slice(0, 4);

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <header className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-28 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 -left-20 size-96 border border-accent/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 size-96 border border-accent/20 rounded-full blur-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-7xl mx-auto items-center relative z-10 gap-12">
          <div className="lg:col-span-7 animate-rise">
            <h1 className="font-serif italic text-[64px] md:text-[110px] lg:text-[130px] leading-[0.85] -ml-1 mb-10">
              <span className="block">The New</span>
              <span className="block lg:pl-20">Geometry</span>
              <span className="block text-accent">of Beauty</span>
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground mb-8">
              Experience cosmetics through the lens of architectural precision. Our laboratory
              synthesizes molecular science with sculptural form — every product, viewable in
              three dimensions before it touches your skin.
            </p>
            <Link
              to="/shop"
              className="inline-block px-10 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors"
            >
              Enter the Laboratory
            </Link>
          </div>
          <div className="lg:col-span-5 relative flex justify-end animate-float">
            <div className="w-full max-w-sm">
              <HeroViewer />
            </div>
          </div>
        </div>
      </header>

      {/* Photo reel */}
      <PhotoReel />

      {/* Categories / Featured with 3D tilt */}
      <section className="py-32 px-6 md:px-12 border-t border-border perspective-1000">
        <div className="max-w-7xl mx-auto">
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
              >
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specimen pitch */}
      <section className="bg-foreground text-background py-32 px-6 md:px-12 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)]" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium">
              Interactive Specimen
            </span>
            <h2 className="font-serif italic text-5xl md:text-7xl leading-[0.9]">
              Inspect every <br />molecule.
            </h2>
            <p className="text-background/60 text-sm max-w-md leading-relaxed">
              Each formulation is rendered as a three-dimensional object. Rotate, study, and consider
              its architecture before it ever reaches your skin.
            </p>
            <Link
              to="/shop"
              className="inline-block px-10 py-4 bg-background text-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-accent hover:text-background transition-colors"
            >
              Browse the Catalog
            </Link>
          </div>
          <div className="relative aspect-square flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="size-full border border-background rounded-full animate-[spin_25s_linear_infinite]" />
              <div className="absolute size-[80%] border border-background/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            </div>
            <div className="relative z-10 size-48 rounded-full bg-gradient-to-br from-accent/60 to-background/10 blur-2xl" />
            <div className="absolute z-20 text-center bg-foreground/40 backdrop-blur-sm p-8 border border-background/10">
              <div className="size-12 rounded-full border border-background/20 mx-auto mb-3 flex items-center justify-center">
                <div className="size-2 bg-accent rounded-full animate-pulse" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] block mb-1">3D Environment</span>
              <span className="text-[8px] text-background/40 uppercase">Drag to rotate</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
