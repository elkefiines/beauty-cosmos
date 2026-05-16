import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/useCart";

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

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
      <header className="mb-16">
        <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">Your Bag</span>
        <h1 className="font-serif italic text-5xl md:text-7xl">Selected Specimens</h1>
      </header>

      {isLoading ? (
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Loading…</p>
      ) : lines.length === 0 ? (
        <div className="text-center py-20 border-y border-border">
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <ul className="lg:col-span-8 divide-y divide-border border-y border-border">
            {lines.map((l) => (
              <li key={l.id} className="flex gap-6 py-8">
                <div
                  className="size-28 shrink-0 border border-border"
                  style={{ background: l.shade?.hex ?? "var(--surface)" }}
                />
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

          <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start bg-surface border border-border p-8">
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
              onClick={() => alert("Checkout coming soon.")}
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
  );
}
