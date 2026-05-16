import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/lib/useCart";

export function Nav() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-12 py-6 md:py-8 mix-blend-difference text-white pointer-events-none">
        <Link to="/" className="text-2xl font-serif italic tracking-tight pointer-events-auto">
          Aetheria
        </Link>
        <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-[0.25em] font-medium pointer-events-auto">
          <Link to="/shop" className="hover:opacity-60 transition-opacity">Shop</Link>
          <Link to="/shop" search={{ category: "skincare" } as never} className="hover:opacity-60 transition-opacity">Collections</Link>
          <Link to="/" hash="journal" className="hover:opacity-60 transition-opacity">Journal</Link>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] pointer-events-auto"
          aria-label="Open cart"
        >
          <ShoppingBag className="size-4" />
          <span>Cart ({count})</span>
        </button>
      </nav>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
