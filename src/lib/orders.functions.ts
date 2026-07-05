import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CheckoutInput = z.object({
  email: z.string().trim().email().max(320),
  address: z.object({
    name: z.string().trim().min(1).max(120),
    line1: z.string().trim().min(1).max(200),
    city: z.string().trim().min(1).max(120),
    postal_code: z.string().trim().min(1).max(30),
    country: z.string().trim().min(1).max(80),
  }),
  notes: z.string().trim().max(1000).optional(),
  session_id: z.string().min(8).max(80),
});

export const createOrderFromCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => CheckoutInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: lines, error: cartErr } = await supabase
      .from("cart_items")
      .select("id, qty, product:products(id, name, base_price, hero_image_url), shade:product_shades(id, name)")
      .eq("session_id", data.session_id);
    if (cartErr) throw cartErr;
    if (!lines || lines.length === 0) throw new Error("Cart is empty.");

    type Line = {
      id: string;
      qty: number;
      product: { id: string; name: string; base_price: number; hero_image_url: string | null } | null;
      shade: { id: string; name: string } | null;
    };
    const rows = lines as unknown as Line[];

    const subtotal = rows.reduce((s, l) => s + Number(l.product?.base_price ?? 0) * l.qty, 0);
    const shipping = subtotal > 100 ? 0 : 8;
    const total = subtotal + shipping;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        email: data.email,
        status: "confirmed",
        subtotal,
        shipping,
        tax: 0,
        total,
        currency: "USD",
        shipping_address: data.address,
        notes: data.notes ?? null,
      })
      .select("id")
      .single();
    if (orderErr) throw orderErr;

    const itemsPayload = rows
      .filter((l) => l.product)
      .map((l) => ({
        order_id: order.id,
        product_id: l.product!.id,
        shade_id: l.shade?.id ?? null,
        name_snapshot: l.product!.name,
        shade_snapshot: l.shade?.name ?? null,
        price_snapshot: l.product!.base_price,
        qty: l.qty,
        hero_image_url: l.product!.hero_image_url,
      }));
    const { error: itemErr } = await supabase.from("order_items").insert(itemsPayload);
    if (itemErr) throw itemErr;

    // Clear cart
    await supabase.from("cart_items").delete().eq("session_id", data.session_id);

    return { orderId: order.id, total };
  });
