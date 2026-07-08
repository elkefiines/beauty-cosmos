import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  images: string[];
  activeIndex: number;
  onSelect: (i: number) => void;
  alt: string;
};

export function ProductGallery({ images, activeIndex, onSelect, alt }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? 0 : (i + 1) % images.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i === null ? 0 : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => onSelect(i)}
            onDoubleClick={() => setLightbox(i)}
            className={`relative shrink-0 size-20 md:size-24 border overflow-hidden bg-surface transition-all ${
              i === activeIndex
                ? "border-foreground scale-[1.03]"
                : "border-border hover:border-foreground/60"
            }`}
            aria-label={`View image ${i + 1} of ${images.length}`}
            aria-current={i === activeIndex}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
            {i === activeIndex && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setLightbox(activeIndex)}
          className="ml-2 shrink-0 text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent"
        >
          Zoom →
        </button>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 size-10 rounded-full border border-border flex items-center justify-center hover:bg-surface"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
          <img
            src={images[lightbox]}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {lightbox + 1} / {images.length} · Esc to close
          </span>
        </div>
      )}
    </>
  );
}
