import type { Shade } from "@/lib/useProducts";

export function ShadeSelector({
  shades,
  selectedId,
  onSelect,
}: {
  shades: Shade[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (shades.length === 0) return null;
  const selected = shades.find((s) => s.id === selectedId);
  return (
    <div>
      <div className="flex justify-between items-end mb-4 border-b border-border pb-2">
        <span className="text-[10px] uppercase tracking-[0.25em]">Select Shade</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {selected ? selected.name : "—"}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {shades.map((s) => {
          const active = s.id === selectedId;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              aria-label={s.name}
              title={s.name}
              className={`size-9 rounded-full transition-all ring-offset-2 ring-offset-background ${active ? "ring-2 ring-foreground" : "ring-1 ring-border hover:scale-110"}`}
              style={{ background: s.hex }}
            />
          );
        })}
      </div>
    </div>
  );
}
