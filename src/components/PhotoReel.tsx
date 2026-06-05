import reel1 from "@/assets/reel-1.jpg";
import reel2 from "@/assets/reel-2.jpg";
import reel3 from "@/assets/reel-3.jpg";
import reel4 from "@/assets/reel-4.jpg";
import reel5 from "@/assets/reel-5.jpg";
import reel6 from "@/assets/reel-6.jpg";

const row1 = [
  { src: reel1, caption: "Sculpted Rouge", tag: "Lipstick · No. 04" },
  { src: reel2, caption: "Liquid Gold", tag: "Serum · 30ml" },
  { src: reel3, caption: "Second Skin", tag: "Editorial" },
  { src: reel4, caption: "Desert Bloom", tag: "Fragrance" },
  { src: reel5, caption: "Silk Veil", tag: "Foundation" },
  { src: reel6, caption: "Bronze Index", tag: "Powder" },
];
const row2 = [...row1].reverse();

function Card({ src, caption, tag }: { src: string; caption: string; tag: string }) {
  return (
    <figure className="relative shrink-0 w-[260px] md:w-[340px] aspect-[3/4] overflow-hidden bg-surface group">
      <img
        src={src}
        alt={caption}
        loading="lazy"
        width={1024}
        height={1024}
        className="size-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-70" />
      <figcaption className="absolute bottom-5 left-5 right-5 text-background">
        <span className="block text-[9px] uppercase tracking-[0.3em] text-accent mb-1">{tag}</span>
        <span className="font-serif italic text-2xl leading-tight">{caption}</span>
      </figcaption>
    </figure>
  );
}

export function PhotoReel() {
  return (
    <section className="py-32 overflow-hidden border-t border-border bg-surface/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="flex justify-between items-end gap-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-3">
              The Editorial Reel
            </span>
            <h2 className="font-serif italic text-5xl md:text-6xl">In Motion</h2>
          </div>
          <p className="hidden md:block max-w-xs text-sm text-muted-foreground leading-relaxed">
            A continuous gallery of light, pigment, and form — captured between
            laboratory and atelier.
          </p>
        </div>
      </div>

      {/* Row 1 */}
      <div className="relative">
        <div className="flex w-max gap-5 animate-marquee will-change-transform">
          {[...row1, ...row1].map((c, i) => (
            <Card key={`r1-${i}`} {...c} />
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="relative mt-5">
        <div className="flex w-max gap-5 animate-marquee-reverse will-change-transform">
          {[...row2, ...row2].map((c, i) => (
            <Card key={`r2-${i}`} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
