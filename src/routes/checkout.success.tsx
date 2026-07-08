import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Stage } from "@/components/sections/Stage";
import { getOrderById } from "@/lib/orders.functions";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: z.object({ order: z.string().optional() }),
  head: () => ({ meta: [{ title: "Order confirmed — Aetheria" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { order } = Route.useSearch();
  const fetchOrder = useServerFn(getOrderById);
  const { data, isLoading } = useQuery({
    queryKey: ["order", order],
    enabled: !!order,
    queryFn: () => fetchOrder({ data: { id: order! } }),
  });

  return (
    <div className="perspective-2000">
      <Stage label="Success" depth={140} tilt={4} seam={false}>
        <div className="pt-40 pb-24 px-6 md:px-12 max-w-3xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-6">Thank you</span>
          <h1 className="font-serif italic text-5xl md:text-6xl mb-6">Your order is confirmed.</h1>
          {order && (
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-8">
              Reference · {order.slice(0, 8)}
            </p>
          )}
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-12">
            A quiet confirmation has been recorded. You can review it any time under Orders.
          </p>

          {isLoading && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-12">Fetching your order…</p>
          )}

          {data && (
            <div className="text-left border-y border-border py-8 mb-12">
              <ul className="divide-y divide-border">
                {data.order_items.map((i) => (
                  <li key={i.id} className="flex items-center gap-4 py-4">
                    {i.hero_image_url && (
                      <img src={i.hero_image_url} alt="" className="size-16 object-cover border border-border" />
                    )}
                    <div className="flex-1">
                      <p className="font-serif italic text-lg">{i.name_snapshot}</p>
                      {i.shade_snapshot && (
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          Shade — {i.shade_snapshot}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Qty × {i.qty}</p>
                    </div>
                    <span className="font-serif italic text-lg">
                      ${(Number(i.price_snapshot) * i.qty).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${Number(data.subtotal).toFixed(2)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{Number(data.shipping) === 0 ? "Free" : `$${Number(data.shipping).toFixed(2)}`}</dd></div>
                <div className="flex justify-between font-serif italic text-xl pt-2 border-t border-border"><dt>Total</dt><dd>${Number(data.total).toFixed(2)}</dd></div>
              </dl>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Link to="/account/orders" className="px-8 py-3 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors">
              View orders
            </Link>
            <Link to="/shop" className="px-8 py-3 border border-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors">
              Continue
            </Link>
          </div>
        </div>
      </Stage>
    </div>
  );
}
