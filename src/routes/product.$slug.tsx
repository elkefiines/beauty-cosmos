import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import { useProduct, useProducts } from "@/lib/useProducts";
import { useCart } from "@/lib/useCart";
import { ShadeSelector } from "@/components/ShadeSelector";
import { Stage } from "@/components/sections/Stage";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";

const ProductShowcase3D = lazy(() =>
  import("@/components/viewer/ProductShowcase3D").then((m) => ({ default: m.ProductShowcase3D }))
);

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Aetheria` },
      { name: "description", content: `Explore ${params.slug} in three dimensions at Aetheria.` },
      { property: "og:title", content: `${params.slug} — Aetheria` },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useProduct(slug);
  const { add } = useCart();
  const [shadeId, setShadeId] = useState<string | null>(null);
  const [imageIdx, setImageIdx] = useState(0);
  const { data: allProducts = [] } = useProducts();

  if (isLoading) {
    return (
      <div className="pt-40 px-12 text-center text-xs uppercase tracking-widest text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!data) {
    return (
      <div className="pt-40 px-12 text-center">
        <p className="font-serif italic text-3xl mb-4">Specimen not found.</p>
        <Link to="/shop" className="text-xs uppercase tracking-[0.25em] hover:text-accent">
          Return to Shop →
        </Link>
      </div>
    );
  }

  const { product, shades } = data;
  const selected = shades.find((s) => s.id === shadeId) ?? shades[0];
  const color = selected?.hex ?? "#a67c52";

  const related = allProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  const galleryRaw = (product.gallery_urls && product.gallery_urls.length > 0
    ? product.gallery_urls
    : [product.hero_image_url]
  ).filter((u): u is string => !!u);
  const gallery = Array.from(new Set(galleryRaw));

  const activeImage = gallery[Math.min(imageIdx, gallery.length - 1)] ?? product.hero_image_url ?? "";

  const handleAdd = () => {
    add.mutate(
      { productId: product.id, shadeId: selected?.id ?? null, qty: 1 },
      {
        onSuccess: () => toast.success(`Added ${product.name} to your bag.`),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Could not add to bag."),
      }
    );
  };

  return (
    <div className="perspective-2000">
      <Stage label="Product Overview" depth={160} tilt={4} seam={false}>
        <div className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
          <Link
            to="/shop"
            className="inline-block mb-10 text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent"
          >
            ← Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Media column: 3D showcase + real image gallery */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="relative w-full aspect-square bg-surface overflow-hidden border border-border">
                <Suspense fallback={
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Preparing 3D environment…
                  </div>
                }>
                  <ProductShowcase3D
                    images={gallery}
                    activeIndex={Math.min(imageIdx, gallery.length - 1)}
                    accentHex={color}
                    className="absolute inset-0"
                  />
                </Suspense>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-background/80 backdrop-blur-sm border border-border">
                  <div className="size-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[9px] font-medium tracking-[0.25em] uppercase">Move to inspect · tap thumb to swap</span>
                </div>
              </div>
              {gallery.length > 0 && (
                <ProductGallery
                  images={gallery}
                  activeIndex={Math.min(imageIdx, gallery.length - 1)}
                  onSelect={setImageIdx}
                  alt={product.name}
                />
              )}
              {activeImage && (
                <div className="w-full aspect-[4/5] bg-surface overflow-hidden border border-border">
                  <img
                    src={activeImage}
                    alt={product.name}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>


            {/* Detail column */}
            <div className="lg:col-span-5 flex flex-col gap-10 lg:sticky lg:top-32 lg:self-start">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">
                  {product.category}
                </span>
                <h1 className="font-serif italic text-5xl md:text-6xl leading-[0.95] mb-3">
                  {product.name}
                </h1>
                {product.tagline && (
                  <p className="font-serif italic text-lg text-muted-foreground mb-6">
                    {product.tagline}
                  </p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                  {product.description}
                </p>
              </div>

              {shades.length > 0 && (
                <ShadeSelector
                  shades={shades}
                  selectedId={selected?.id ?? null}
                  onSelect={setShadeId}
                />
              )}

              <div className="border-t border-border pt-8 space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="font-serif italic text-3xl">${Number(product.base_price).toFixed(2)}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Net Wt. {product.volume || "—"}
                  </span>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={add.isPending}
                  className="w-full py-5 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] font-semibold hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {add.isPending ? "Adding…" : "Add to Bag"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-border pt-8">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    Volume
                  </span>
                  <span className="font-serif italic text-lg">{product.volume || "—"}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                    Origin
                  </span>
                  <span className="font-serif italic text-lg">{product.origin || "—"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Stage>

      {product.ingredients.length > 0 && (
        <Stage label="Ingredients" depth={220} tilt={5}>
          <div className="px-6 md:px-12 py-24 max-w-5xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">Composition</span>
            <h2 className="font-serif italic text-4xl md:text-5xl mb-12">A short ingredient list.</h2>
            <ul className="divide-y divide-border border-y border-border">
              {product.ingredients.map((ing, i) => (
                <li key={ing} className="flex items-baseline justify-between py-5">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground w-12">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif italic text-lg flex-1 pl-6">{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        </Stage>
      )}

      <Stage label="The Ritual" depth={240} tilt={6}>
        <div className="px-6 md:px-12 py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">The Ritual</span>
            <h2 className="font-serif italic text-4xl md:text-5xl mb-10 leading-tight">
              Three quiet steps.
            </h2>
            <ol className="space-y-8">
              {[
                { t: "Prepare", d: "Cleanse skin. Warm the object briefly in the hand." },
                { t: "Apply", d: "A single considered pass. Nothing more than needed." },
                { t: "Settle", d: "Wait. Let the formula meet the skin on its own terms." },
              ].map((s, i) => (
                <li key={s.t} className="grid grid-cols-[3rem_1fr] gap-4">
                  <span className="font-serif italic text-3xl text-accent leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] mb-2">{s.t}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {product.hero_image_url && (
            <div className="lg:col-span-7 aspect-[4/5] bg-surface border border-border overflow-hidden">
              <img
                src={product.hero_image_url}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[2000ms] ease-out"
              />
            </div>
          )}
        </div>
      </Stage>

      {related.length > 0 && (
        <Stage label="Related" depth={200} tilt={5}>
          <div className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
            <div className="flex items-baseline justify-between mb-12">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-3">Also from the series</span>
                <h2 className="font-serif italic text-3xl md:text-4xl">You may also love.</h2>
              </div>
              <Link to="/shop" className="text-[10px] uppercase tracking-[0.25em] hover:text-accent hidden md:block">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </Stage>
      )}
    </div>
  );
}
