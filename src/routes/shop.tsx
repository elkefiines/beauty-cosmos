import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useProducts } from "@/lib/useProducts";
import { ProductCard } from "@/components/ProductCard";

const searchSchema = z.object({
  category: z.enum(["lipstick", "foundation", "skincare", "fragrance"]).optional(),
});

const CATEGORIES = [
  { value: undefined, label: "All" },
  { value: "lipstick", label: "Lipstick" },
  { value: "foundation", label: "Foundation" },
  { value: "skincare", label: "Skincare" },
  { value: "fragrance", label: "Fragrance" },
] as const;

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Aetheria" },
      { name: "description", content: "Browse the Aetheria catalog: sculptural lipstick, foundation, skincare, and fragrance." },
      { property: "og:title", content: "Shop — Aetheria" },
      { property: "og:description", content: "The full Aetheria catalog." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const { data: products = [], isLoading } = useProducts(category);

  return (
    <div className="px-6 md:px-12 pt-32 pb-24 max-w-7xl mx-auto">
      <header className="mb-16">
        <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">The Catalog</span>
        <h1 className="font-serif italic text-5xl md:text-7xl">Elemental Forms</h1>
      </header>

      <nav className="flex flex-wrap gap-2 md:gap-3 mb-16 border-b border-border pb-6">
        {CATEGORIES.map((c) => {
          const active = category === c.value;
          return (
            <Link
              key={c.label}
              to="/shop"
              search={c.value ? { category: c.value } : {}}
              className={`px-5 py-2 text-[10px] uppercase tracking-[0.25em] border transition-colors ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </nav>

      {isLoading ? (
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Loading…</p>
      ) : products.length === 0 ? (
        <p className="font-serif italic text-2xl">No products in this series yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
