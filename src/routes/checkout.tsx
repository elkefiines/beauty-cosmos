import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Stage } from "@/components/sections/Stage";
import { useCart } from "@/lib/useCart";
import { getSessionId } from "@/lib/session";
import { createOrderFromCart } from "@/lib/orders.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Aetheria" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { lines, subtotal } = useCart();
  const navigate = useNavigate();
  const submit = useServerFn(createOrderFromCart);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    name: "",
    line1: "",
    city: "",
    postal_code: "",
    country: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate({ to: "/auth", search: { from: "/checkout" } });
      } else {
        setEmail(data.user.email ?? "");
        setChecked(true);
      }
    });
  }, [navigate]);

  const shipping = subtotal > 100 ? 0 : 8;
  const total = subtotal + shipping;

  const place = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) return toast.error("Your bag is empty.");
    setBusy(true);
    try {
      const res = await submit({
        data: {
          email,
          address: {
            name: form.name,
            line1: form.line1,
            city: form.city,
            postal_code: form.postal_code,
            country: form.country,
          },
          notes: form.notes || undefined,
          session_id: getSessionId(),
        },
      });
      navigate({ to: "/checkout/success", search: { order: res.orderId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order.");
    } finally {
      setBusy(false);
    }
  };

  if (!checked) {
    return <div className="pt-40 text-center text-xs uppercase tracking-widest text-muted-foreground">…</div>;
  }

  return (
    <div className="perspective-2000">
      <Stage label="Checkout Header" depth={140} tilt={3} seam={false}>
        <header className="pt-32 pb-8 px-6 md:px-12 max-w-5xl mx-auto">
          <Link to="/cart" className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent">← Bag</Link>
          <h1 className="mt-6 font-serif italic text-5xl md:text-6xl">Checkout</h1>
          <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
            Demo mode — no payment is processed. Your order will be recorded.
          </p>
        </header>
      </Stage>

      <Stage label="Checkout Form" depth={200} tilt={5}>
        <form onSubmit={place} className="pb-24 px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif italic text-2xl mb-2">Delivery</h2>
            <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required max={120} />
            <Field label="Email" value={email} onChange={setEmail} required max={320} type="email" />
            <Field label="Address" value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} required max={200} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required max={120} />
              <Field label="Postal code" value={form.postal_code} onChange={(v) => setForm({ ...form, postal_code: v })} required max={30} />
            </div>
            <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} required max={80} />
            <Field label="Notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} max={1000} />
          </div>

          <aside className="lg:col-span-5 bg-surface border border-border p-8 self-start">
            <h2 className="font-serif italic text-2xl mb-6">Order</h2>
            <ul className="space-y-3 mb-6 text-sm max-h-64 overflow-y-auto pr-2">
              {lines.map((l) => (
                <li key={l.id} className="flex justify-between">
                  <span className="text-muted-foreground">{l.product.name} × {l.qty}</span>
                  <span>${(Number(l.product.base_price) * l.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd></div>
            </dl>
            <div className="flex justify-between items-baseline border-t border-border mt-4 pt-4 mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em]">Total</span>
              <span className="font-serif italic text-3xl">${total.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              disabled={busy || lines.length === 0}
              className="w-full py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors disabled:opacity-50"
            >
              {busy ? "Placing…" : "Place order"}
            </button>
          </aside>
        </form>
      </Stage>
    </div>
  );
}

function Field({
  label, value, onChange, required, max, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; max?: number; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <input
        type={type}
        required={required}
        maxLength={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block w-full bg-transparent border-b border-border py-2 outline-none focus:border-foreground text-sm"
      />
    </label>
  );
}
