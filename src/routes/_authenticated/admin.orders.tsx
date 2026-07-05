import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, email, status, total, currency, created_at, order_items(id, name_snapshot, qty)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <ul className="divide-y divide-border border-y border-border">
      {orders.length === 0 && <li className="py-8 text-xs uppercase tracking-widest text-muted-foreground">No orders yet.</li>}
      {orders.map((o) => (
        <li key={o.id} className="py-6">
          <div className="flex justify-between items-baseline">
            <div>
              <p className="font-serif italic text-xl">{o.id.slice(0, 8)} — {o.email}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {new Date(o.created_at).toLocaleString()} · {o.status}
              </p>
            </div>
            <span className="font-serif italic text-2xl">${Number(o.total).toFixed(2)}</span>
          </div>
          <ul className="mt-3 text-xs text-muted-foreground space-y-1">
            {(o.order_items as { id: string; name_snapshot: string; qty: number }[]).map((i) => (
              <li key={i.id}>· {i.name_snapshot} × {i.qty}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
