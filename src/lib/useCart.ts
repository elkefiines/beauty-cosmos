import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "./session";

export type CartLine = {
  id: string;
  qty: number;
  product: { id: string; slug: string; name: string; base_price: number; model_kind: string };
  shade: { id: string; name: string; hex: string } | null;
};

export function useCart() {
  const qc = useQueryClient();
  const sessionId = typeof window !== "undefined" ? getSessionId() : "ssr";

  const cart = useQuery({
    queryKey: ["cart", sessionId],
    enabled: typeof window !== "undefined",
    queryFn: async (): Promise<CartLine[]> => {
      const { data, error } = await supabase
        .from("cart_items")
        .select(
          "id, qty, product:products(id, slug, name, base_price, model_kind), shade:product_shades(id, name, hex)"
        )
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as CartLine[];
    },
  });

  const add = useMutation({
    mutationFn: async (vars: { productId: string; shadeId: string | null; qty?: number }) => {
      const { error } = await supabase.from("cart_items").insert({
        session_id: getSessionId(),
        product_id: vars.productId,
        shade_id: vars.shadeId,
        qty: vars.qty ?? 1,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const updateQty = useMutation({
    mutationFn: async (vars: { id: string; qty: number }) => {
      if (vars.qty <= 0) {
        const { error } = await supabase.from("cart_items").delete().eq("id", vars.id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase
        .from("cart_items")
        .update({ qty: vars.qty })
        .eq("id", vars.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cart_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const lines = cart.data ?? [];
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * Number(l.product.base_price), 0);

  return { lines, count, subtotal, isLoading: cart.isLoading, add, updateQty, remove };
}
