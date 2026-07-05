import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.string().trim().email().max(320);

export function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return toast.error("Enter a valid email");
    setBusy(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: parsed.data });
    setBusy(false);
    if (error) {
      if (error.code === "23505") {
        toast.success("You're already subscribed.");
        setEmail("");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("Subscribed. Look for our next lab note.");
    setEmail("");
  };

  return (
    <footer className="px-6 md:px-12 pt-32 pb-12 bg-background border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-7xl mx-auto">
        <div className="md:col-span-4 font-serif italic text-4xl leading-tight">
          Distilled from earth, by hand.
        </div>

        <div className="md:col-span-4 grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Explore</span>
            <Link to="/shop" className="text-xs hover:text-accent transition-colors">Shop</Link>
            <Link to="/journal" className="text-xs hover:text-accent transition-colors">Journal</Link>
            <Link to="/stockists" className="text-xs hover:text-accent transition-colors">Stockists</Link>
            <Link to="/about" className="text-xs hover:text-accent transition-colors">About</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Support</span>
            <Link to="/contact" className="text-xs hover:text-accent transition-colors">Contact</Link>
            <Link to="/journal/$slug" params={{ slug: "shipping-and-returns" }} className="text-xs hover:text-accent transition-colors">Shipping</Link>
            <Link to="/privacy" className="text-xs hover:text-accent transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs hover:text-accent transition-colors">Terms</Link>
          </div>
        </div>
        <div className="md:col-span-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Subscribe to the lab notes
          </p>
          <form className="border-b border-foreground/20 pb-3 flex justify-between items-center group" onSubmit={subscribe}>
            <input
              type="email"
              required
              maxLength={320}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="bg-transparent text-xs flex-1 outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={busy}
              className="text-xs group-hover:translate-x-1 transition-transform disabled:opacity-50"
              aria-label="Subscribe"
            >
              →
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 flex justify-between items-end text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
        <span>© {new Date().getFullYear()} Aetheria Atelier</span>
        <span>Hand-distilled, small batch</span>
      </div>
    </footer>
  );
}
