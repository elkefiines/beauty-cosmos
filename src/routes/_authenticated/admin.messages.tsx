import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: AdminMessages,
});

function AdminMessages() {
  const qc = useQueryClient();
  const { data: msgs = [] } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const toggle = useMutation({
    mutationFn: async (m: { id: string; handled: boolean }) => {
      const { error } = await supabase.from("contact_messages").update({ handled: !m.handled }).eq("id", m.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  return (
    <ul className="divide-y divide-border border-y border-border">
      {msgs.length === 0 && <li className="py-8 text-xs uppercase tracking-widest text-muted-foreground">No messages yet.</li>}
      {msgs.map((m) => (
        <li key={m.id} className="py-6">
          <div className="flex justify-between items-baseline mb-2">
            <div>
              <p className="font-serif italic text-xl">{m.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {m.email} · {new Date(m.created_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => toggle.mutate({ id: m.id, handled: m.handled })}
              className="text-[10px] uppercase tracking-[0.25em] hover:text-accent"
            >
              {m.handled ? "Mark unread" : "Mark handled"}
            </button>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
        </li>
      ))}
    </ul>
  );
}
