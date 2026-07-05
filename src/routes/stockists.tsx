import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Stage } from "@/components/sections/Stage";

export const Route = createFileRoute("/stockists")({
  head: () => ({
    meta: [
      { title: "Stockists — Aetheria" },
      { name: "description", content: "Where to find Aetheria in person." },
    ],
  }),
  component: StockistsPage,
});

function StockistsPage() {
  const { data: rows = [] } = useQuery({
    queryKey: ["stockists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stockists")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="perspective-2000">
      <Stage label="Stockists Header" depth={140} tilt={4} seam={false}>
        <header className="pt-32 pb-14 px-6 md:px-12 max-w-5xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-4">In person</span>
          <h1 className="font-serif italic text-5xl md:text-6xl">Stockists.</h1>
        </header>
      </Stage>

      <Stage label="Stockists List" depth={220} tilt={6}>
        <ul className="pb-24 px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.map((s) => (
            <li key={s.id} className="border border-border p-8 hover:border-foreground transition-colors">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent block mb-3">
                {s.city}, {s.country}
              </span>
              <h2 className="font-serif italic text-2xl mb-2">{s.name}</h2>
              {s.address && <p className="text-xs text-muted-foreground mb-3">{s.address}</p>}
              {s.url && (
                <a href={s.url} target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-[0.25em] hover:text-accent">
                  Visit →
                </a>
              )}
            </li>
          ))}
        </ul>
      </Stage>
    </div>
  );
}
