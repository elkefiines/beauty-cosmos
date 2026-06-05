import { Link } from "@tanstack/react-router";
import { X, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/useCart";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, subtotal, updateQty, remove, isLoading } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl border-l border-border flex flex-col transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-8 py-8 border-b border-border">
          <h3 className="font-serif italic text-3xl">Your Bag</h3>
          <button onClick={onClose} aria-label="Close cart" className="hover:text-accent transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {!mounted || isLoading || lines.length === 0 ? (
            <div className="text-center mt-20">
              <p className="font-serif italic text-2xl mb-3">Your bag is empty.</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-8">
                Quiet moments await.
              </p>
              <Link
                to="/shop"
                onClick={onClose}
                className="inline-block px-8 py-3 border border-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors"
              >
                Explore the Shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-8">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-5">
                  <div
                    className="size-20 shrink-0 border border-border"
                    style={{ background: l.shade?.hex ?? "var(--surface)" }}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-serif italic text-xl leading-tight">{l.product.name}</p>
                      {l.shade && (
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                          {l.shade.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 border border-border px-2 py-1">
                        <button
                          onClick={() => updateQty.mutate({ id: l.id, qty: l.qty - 1 })}
                          aria-label="Decrease"
                          className="p-1 hover:text-accent"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="text-xs w-4 text-center">{l.qty}</span>
                        <button
                          onClick={() => updateQty.mutate({ id: l.id, qty: l.qty + 1 })}
                          aria-label="Increase"
                          className="p-1 hover:text-accent"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="text-sm">${(Number(l.product.base_price) * l.qty).toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => remove.mutate(l.id)}
                      className="self-start mt-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {mounted && lines.length > 0 && (
          <div className="border-t border-border px-8 py-6 bg-surface/50">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em]">Subtotal</span>
              <span className="font-serif italic text-2xl">${subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/cart"
              onClick={onClose}
              className="block text-center w-full py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors"
            >
              Review Bag
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
