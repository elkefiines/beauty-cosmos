import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/useProducts";

const SHADE_HINT: Record<string, string> = {
  lipstick: "#b0664f",
  foundation: "#d4b184",
  serum: "#a67c52",
  fragrance: "#c9a37a",
};

export function ProductCard({ product, index }: { product: Product; index?: number }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block relative"
    >
      {typeof index === "number" && (
        <span
          aria-hidden
          className="absolute -top-6 left-0 text-[80px] font-serif italic text-foreground/[0.06] group-hover:text-accent/20 transition-colors -z-10 leading-none"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <div
        className="w-full aspect-[3/4] bg-surface mb-6 group-hover:-translate-y-2 transition-transform duration-700 flex items-center justify-center"
      >
        <div
          className="size-24 rounded-full opacity-80 group-hover:scale-110 transition-transform duration-700"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${SHADE_HINT[product.model_kind] ?? "#a67c52"}, ${SHADE_HINT[product.model_kind] ?? "#a67c52"}40)`,
          }}
        />
      </div>
      <h3 className="text-[10px] uppercase tracking-[0.25em] mb-1 text-muted-foreground">
        {product.category}
      </h3>
      <p className="font-serif italic text-xl">{product.name}</p>
      <p className="text-xs mt-1 text-muted-foreground">${Number(product.base_price).toFixed(0)}</p>
    </Link>
  );
}
