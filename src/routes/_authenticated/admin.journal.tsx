import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/journal")({
  component: AdminJournal,
});

function AdminJournal() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    slug: "", title: "", excerpt: "", cover_url: "", body: "", published: false,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["admin-journal"],
    queryFn: async () => {
      const { data, error } = await supabase.from("journal_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim().slice(0, 200),
        excerpt: form.excerpt.trim().slice(0, 500),
        cover_url: form.cover_url.trim() || null,
        body: form.body,
        published: form.published,
        published_at: form.published ? new Date().toISOString() : null,
      };
      if (editing) {
        const { error } = await supabase.from("journal_posts").update(payload).eq("id", editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("journal_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved.");
      setEditing(null);
      setForm({ slug: "", title: "", excerpt: "", cover_url: "", body: "", published: false });
      qc.invalidateQueries({ queryKey: ["admin-journal"] });
      qc.invalidateQueries({ queryKey: ["journal"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-journal"] }),
  });

  const startEdit = (p: typeof posts[number]) => {
    setEditing(p.id);
    setForm({
      slug: p.slug, title: p.title, excerpt: p.excerpt ?? "",
      cover_url: p.cover_url ?? "", body: p.body ?? "", published: p.published,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
        <h2 className="font-serif italic text-2xl mb-4">{editing ? "Edit post" : "New post"}</h2>
        <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
        <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        <Input label="Excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} />
        <Input label="Cover URL" value={form.cover_url} onChange={(v) => setForm({ ...form, cover_url: v })} />
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Body</span>
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={10}
            className="mt-2 block w-full bg-transparent border border-border p-3 outline-none focus:border-foreground text-sm"
          />
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          <span className="text-xs">Published</span>
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={save.isPending} className="px-6 py-3 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-colors disabled:opacity-50">
            {editing ? "Update" : "Create"}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ slug: "", title: "", excerpt: "", cover_url: "", body: "", published: false }); }} className="px-6 py-3 border border-border text-[10px] uppercase tracking-[0.3em]">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="font-serif italic text-2xl mb-4">All posts</h2>
        <ul className="divide-y divide-border border-y border-border">
          {posts.map((p) => (
            <li key={p.id} className="py-4 flex items-baseline justify-between gap-4">
              <div>
                <p className="font-serif italic text-lg">{p.title}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {p.slug} · {p.published ? "published" : "draft"}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="text-[10px] uppercase tracking-[0.25em] hover:text-accent">Edit</button>
                <button onClick={() => confirm("Delete?") && del.mutate(p.id)} className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-destructive">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block w-full bg-transparent border-b border-border py-2 outline-none focus:border-foreground text-sm"
      />
    </label>
  );
}
