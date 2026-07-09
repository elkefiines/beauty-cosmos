import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/useCart";
import { useProducts } from "@/lib/useProducts";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Aetheria" },
      { name: "description", content: "Review your selected Aetheria specimens." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, updateQty, remove, isLoading } = useCart();
  const { data: products = [] } = useProducts();
  const emptyBg = products[0]?.hero_image_url;
  const navigate = useNavigate();

  return (
    <div className="perspective-2000">
      <Stage label="Cart Header" depth={120} tilt={3} seam={false}>
        <header className="pt-32 pb-14 px-6 md:px-12 max-w-5xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">Your Bag</span>
          <h1 className="font-serif italic text-5xl md:text-7xl">Selected Specimens</h1>
        </header>
      </Stage>

      <Stage label="Cart Contents" depth={220} tilt={5}>
        <div className="pb-24 px-6 md:px-12 max-w-5xl mx-auto">
          {isLoading ? (
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Loading…</p>
          ) : lines.length === 0 ? (
            <div className="relative overflow-hidden border-y border-border">
              <div
                aria-hidden
                className="absolute inset-0 opacity-30 bg-cover bg-center animate-[kenburns_18s_ease-in-out_infinite_alternate]"
                style={{ backgroundImage: emptyBg ? `url(${emptyBg})` : undefined }}
              />
              <div className="relative text-center py-24">
                <p className="font-serif italic text-3xl mb-4">Your bag is empty.</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-8">
                  Begin with a single object.
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-10 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors"
                >
                  Explore the Shop
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <ul className="lg:col-span-8 divide-y divide-border border-y border-border">
                {lines.map((l) => (
                  <li key={l.id} className="flex gap-6 py-8">
                    <div className="relative size-28 shrink-0 border border-border bg-surface overflow-hidden">
                      {l.product.hero_image_url ? (
                        <img
                          src={l.product.hero_image_url}
                          alt={l.product.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                      {l.shade && (
                        <span
                          className="absolute bottom-1.5 right-1.5 size-4 rounded-full border-2 border-background shadow"
                          style={{ background: l.shade.hex }}
                          aria-label={`Shade ${l.shade.name}`}
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-serif italic text-2xl leading-tight">{l.product.name}</p>
                          {l.shade && (
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                              Shade — {l.shade.name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => remove.mutate(l.id)}
                          aria-label="Remove"
                          className="text-muted-foreground hover:text-accent"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3 border border-border px-3 py-1.5">
                          <button
                            onClick={() => updateQty.mutate({ id: l.id, qty: l.qty - 1 })}
                            aria-label="Decrease"
                            className="hover:text-accent"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="text-xs w-5 text-center">{l.qty}</span>
                          <button
                            onClick={() => updateQty.mutate({ id: l.id, qty: l.qty + 1 })}
                            aria-label="Increase"
                            className="hover:text-accent"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <span className="font-serif italic text-xl">
                          ${(Number(l.product.base_price) * l.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start bg-surface border border-border p-8 relative">
                <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-transparent via-accent to-transparent" />
                </div>
                <h2 className="font-serif italic text-2xl mb-8">Summary</h2>
                <dl className="space-y-4 mb-8 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>${subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="text-[10px] uppercase tracking-widest">Calculated at checkout</dd>
                  </div>
                </dl>
                <div className="flex justify-between items-baseline border-t border-border pt-4 mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em]">Total</span>
                  <span className="font-serif italic text-3xl">${subtotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate({ to: "/checkout" })}
                  className="w-full py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/shop"
                  className="block text-center mt-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent"
                >
                  ← Continue Browsing
                </Link>
              </aside>
            </div>
          )}
        </div>
      </Stage>
    </div>
  );
}
