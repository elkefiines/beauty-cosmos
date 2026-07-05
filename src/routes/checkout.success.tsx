import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: z.object({ order: z.string().optional() }),
  head: () => ({ meta: [{ title: "Order confirmed — Aetheria" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { order } = Route.useSearch();
  return (
    <div className="perspective-2000">
      <Stage label="Success" depth={140} tilt={4} seam={false}>
        <div className="pt-40 pb-24 px-6 md:px-12 max-w-2xl mx-auto text-center">
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
