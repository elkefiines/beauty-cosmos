import { Link } from "@tanstack/react-router";
import { useRef, type MouseEvent } from "react";
import type { Product } from "@/lib/useProducts";

export function ProductCard({ product, index }: { product: Product; index?: number }) {
  const frameRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-8px)`;
  };
  const onLeave = () => {
    const el = frameRef.current;
    if (!el) return;
    el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block relative"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {typeof index === "number" && (
        <span
          aria-hidden
          className="absolute -top-6 left-0 text-[80px] font-serif italic text-foreground/[0.06] group-hover:text-accent/25 transition-colors -z-10 leading-none"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <div
        ref={frameRef}
        className="w-full aspect-[3/4] bg-surface mb-6 overflow-hidden border border-border/60 transition-transform duration-500 ease-out will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {product.hero_image_url ? (
          <img
            src={product.hero_image_url}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1280}
            className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
      </div>
      <h3 className="text-[10px] uppercase tracking-[0.25em] mb-1 text-muted-foreground">
        {product.category}
      </h3>
      <p className="font-serif italic text-xl">{product.name}</p>
      {product.tagline && (
        <p className="text-[11px] text-muted-foreground/80 mt-1 italic">{product.tagline}</p>
      )}
      <p className="text-xs mt-2 text-muted-foreground">${Number(product.base_price).toFixed(0)}</p>
    </Link>
  );
}
