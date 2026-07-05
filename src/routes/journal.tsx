import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Aetheria" },
      { name: "description", content: "Field notes from the atelier — on ritual, ingredients, and single-origin formulas." },
      { property: "og:title", content: "Journal — Aetheria" },
    ],
  }),
  component: JournalIndex,
});

type PostRow = {
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string | null;
  published_at: string | null;
};

function JournalIndex() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["journal", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_posts")
        .select("slug, title, excerpt, cover_url, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PostRow[];
    },
  });

  return (
    <div className="perspective-2000">
      <Stage label="Journal Header" depth={140} tilt={4} seam={false}>
        <header className="pt-32 pb-14 px-6 md:px-12 max-w-6xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">The Journal</span>
          <h1 className="font-serif italic text-5xl md:text-7xl">Field notes.</h1>
        </header>
      </Stage>

      <Stage label="Journal List" depth={220} tilt={6}>
        <div className="pb-24 px-6 md:px-12 max-w-6xl mx-auto">
          {isLoading ? (
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Loading…</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link to="/journal/$slug" params={{ slug: p.slug }} className="group block">
                    {p.cover_url && (
                      <div className="aspect-[4/3] mb-6 overflow-hidden bg-surface border border-border">
                        <img
                          src={p.cover_url}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                        />
                      </div>
                    )}
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}
                    </span>
                    <h2 className="font-serif italic text-3xl mt-2 mb-3 group-hover:text-accent transition-colors">{p.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Stage>
    </div>
  );
}
