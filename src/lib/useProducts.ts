import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  base_price: number;
  model_kind: "lipstick" | "foundation" | "serum" | "fragrance";
  hero_image_url: string | null;
};

export type Shade = {
  id: string;
  product_id: string;
  name: string;
  hex: string;
  sku: string;
  sort_order: number;
};

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ["products", category ?? "all"],
    queryFn: async () => {
      let q = supabase.from("products").select("*").order("created_at", { ascending: true });
      if (category) q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!product) return null;
      const { data: shades, error: e2 } = await supabase
        .from("product_shades")
        .select("*")
        .eq("product_id", product.id)
        .order("sort_order");
      if (e2) throw e2;
      return { product: product as Product, shades: (shades ?? []) as Shade[] };
    },
  });
}
