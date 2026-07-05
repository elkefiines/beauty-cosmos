import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Stage } from "@/components/sections/Stage";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/_authenticated/account/orders")({
  head: () => ({ meta: [{ title: "Orders — Aetheria" }] }),
  component: OrdersPage,
});

type OrderRow = {
  id: string;
  status: string;
  total: number;
  currency: string;
  created_at: string;
  order_items: {
    id: string;
    name_snapshot: string;
    shade_snapshot: string | null;
    price_snapshot: number;
    qty: number;
    hero_image_url: string | null;
  }[];
};

function OrdersPage() {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total, currency, created_at, order_items(id, name_snapshot, shade_snapshot, price_snapshot, qty, hero_image_url)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as OrderRow[];
    },
  });

  return (
    <div className="perspective-2000">
      <Stage label="Orders Header" depth={140} tilt={3} seam={false}>
        <header className="pt-32 pb-8 px-6 md:px-12 max-w-4xl mx-auto">
          <Link to="/account" className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent">← Account</Link>
          <h1 className="mt-6 font-serif italic text-5xl md:text-6xl">Orders</h1>
        </header>
      </Stage>

      <Stage label="Orders List" depth={200} tilt={5}>
        <div className="pb-24 px-6 md:px-12 max-w-4xl mx-auto">
          {isLoading ? (
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Loading…</p>
          ) : orders.length === 0 ? (
            <div className="border-y border-border py-20 text-center">
              <p className="font-serif italic text-3xl mb-4">No orders yet.</p>
              <Link to="/shop" className="text-[10px] uppercase tracking-[0.25em] hover:text-accent">Explore the shop →</Link>
            </div>
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {orders.map((o) => (
                <li key={o.id} className="py-8">
                  <div className="flex justify-between items-baseline mb-4">
                    <div>
                      <p className="font-serif italic text-2xl">Order · {o.id.slice(0, 8)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                        {new Date(o.created_at).toLocaleDateString()} · {o.status}
                      </p>
                    </div>
                    <span className="font-serif italic text-2xl">${Number(o.total).toFixed(2)}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {o.order_items.map((i) => (
                      <li key={i.id} className="flex justify-between">
                        <span>{i.name_snapshot}{i.shade_snapshot ? ` — ${i.shade_snapshot}` : ""} × {i.qty}</span>
                        <span>${(Number(i.price_snapshot) * i.qty).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Stage>
    </div>
  );
}
