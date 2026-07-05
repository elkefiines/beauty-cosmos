import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, User } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/lib/useCart";
import { useAuth } from "@/lib/useAuth";

export function Nav() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-12 py-6 md:py-8 mix-blend-difference text-white pointer-events-none">
        <Link to="/" className="text-2xl font-serif italic tracking-tight pointer-events-auto">
          Aetheria
        </Link>
        <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.25em] font-medium pointer-events-auto">
          <Link to="/shop" className="hover:opacity-60 transition-opacity">Shop</Link>
          <Link to="/journal" className="hover:opacity-60 transition-opacity">Journal</Link>
          <Link to="/stockists" className="hover:opacity-60 transition-opacity">Stockists</Link>
          <Link to="/about" className="hover:opacity-60 transition-opacity">About</Link>
        </div>
        <div className="flex items-center gap-6 pointer-events-auto">
          <Link
            to={isAuthenticated ? "/account" : "/auth"}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] hover:opacity-60"
            aria-label={isAuthenticated ? "Account" : "Sign in"}
          >
            <User className="size-4" />
            <span className="hidden md:inline">{isAuthenticated ? "Account" : "Sign in"}</span>
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] hover:opacity-60"
            aria-label="Open cart"
          >
            <ShoppingBag className="size-4" />
            <span>Cart ({count})</span>
          </button>
        </div>
      </nav>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
