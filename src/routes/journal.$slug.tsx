import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/journal/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Journal — Aetheria` },
      { name: "description", content: "A field note from the Aetheria atelier." },
    ],
  }),
  component: JournalPost,
  notFoundComponent: () => (
    <div className="pt-40 px-12 text-center">
      <p className="font-serif italic text-3xl mb-4">Note not found.</p>
      <Link to="/journal" className="text-xs uppercase tracking-[0.25em] hover:text-accent">Return to Journal →</Link>
    </div>
  ),
});

function JournalPost() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["journal", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="pt-40 text-center text-xs uppercase tracking-widest text-muted-foreground">Loading…</div>;
  if (!data) throw notFound();

  return (
    <div className="perspective-2000">
      <Stage label="Post Header" depth={140} tilt={3} seam={false}>
        <header className="pt-32 pb-12 px-6 md:px-12 max-w-3xl mx-auto">
          <Link to="/journal" className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent">← Journal</Link>
          <span className="mt-8 text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">
            {data.published_at ? new Date(data.published_at).toLocaleDateString() : ""}
          </span>
          <h1 className="font-serif italic text-5xl md:text-6xl leading-tight">{data.title}</h1>
          <p className="mt-6 text-lg text-muted-foreground font-serif italic">{data.excerpt}</p>
        </header>
      </Stage>

      {data.cover_url && (
        <Stage label="Post Cover" depth={260} tilt={7}>
          <div className="px-6 md:px-12 max-w-5xl mx-auto">
            <div className="aspect-[16/9] overflow-hidden bg-surface border border-border">
              <img src={data.cover_url} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </Stage>
      )}

      <Stage label="Post Body" depth={200} tilt={5}>
        <article className="py-20 px-6 md:px-12 max-w-2xl mx-auto prose-serif">
          {data.body.split(/\n\n+/).map((para, i) => (
            <p key={i} className="mb-6 text-base leading-relaxed text-foreground/85">{para}</p>
          ))}
        </article>
      </Stage>
    </div>
  );
}
