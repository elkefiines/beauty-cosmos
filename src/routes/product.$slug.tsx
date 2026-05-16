import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import { useProduct } from "@/lib/useProducts";
import { useCart } from "@/lib/useCart";
import { ShadeSelector } from "@/components/ShadeSelector";

// Lazy-load the 3D viewer (three.js is heavy)
const ProductViewer = lazy(() =>
  import("@/components/viewer/ProductViewer").then((m) => ({ default: m.ProductViewer }))
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
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <Link
        to="/shop"
        className="inline-block mb-10 text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent"
      >
        ← Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* 3D Viewer */}
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-square bg-surface overflow-hidden border border-border">
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Preparing 3D environment…
              </div>
            }>
              <ProductViewer kind={product.model_kind} color={color} className="absolute inset-0" />
            </Suspense>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-background/80 backdrop-blur-sm border border-border">
              <div className="size-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[9px] font-medium tracking-[0.25em] uppercase">Drag to rotate</span>
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">
              {product.category}
            </span>
            <h1 className="font-serif italic text-5xl md:text-6xl leading-[0.95] mb-6">
              {product.name}
            </h1>
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
                Net Wt. 30ml
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
                Formulation
              </span>
              <span className="font-serif italic text-lg">Cold-blended</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Origin
              </span>
              <span className="font-serif italic text-lg">Brussels</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
