import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [orders, msgs, subs, posts] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
        supabase.from("journal_posts").select("id", { count: "exact", head: true }),
      ]);
      return {
        orders: orders.count ?? 0,
        messages: msgs.count ?? 0,
        subscribers: subs.count ?? 0,
        posts: posts.count ?? 0,
      };
    },
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Orders", value: counts?.orders ?? "—" },
        { label: "Messages", value: counts?.messages ?? "—" },
        { label: "Subscribers", value: counts?.subscribers ?? "—" },
        { label: "Journal posts", value: counts?.posts ?? "—" },
      ].map((c) => (
        <div key={c.label} className="border border-border p-6">
          <span className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">{c.label}</span>
          <span className="font-serif italic text-4xl">{c.value}</span>
        </div>
      ))}
    </div>
  );
}
