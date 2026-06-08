import { useRef } from "react";
import reel1 from "@/assets/reel-1.jpg";
import reel2 from "@/assets/reel-2.jpg";
import reel3 from "@/assets/reel-3.jpg";
import reel4 from "@/assets/reel-4.jpg";
import reel5 from "@/assets/reel-5.jpg";
import reel6 from "@/assets/reel-6.jpg";
import bot1 from "@/assets/botanical-1.jpg";
import bot2 from "@/assets/botanical-2.jpg";
import bot3 from "@/assets/botanical-3.jpg";
import bot4 from "@/assets/botanical-4.jpg";
import pour from "@/assets/ritual-pour.mp4.asset.json";
import mist from "@/assets/ritual-mist.mp4.asset.json";
import { useReveal } from "@/lib/useReveal";
import { useScrollScene, mapRange } from "@/lib/useScrollScene";
import { LoopVideo } from "@/components/LoopVideo";

type Item =
  | { kind: "img"; src: string; caption: string; tag: string }
  | { kind: "video"; src: string; poster: string; caption: string; tag: string };

const row1: Item[] = [
  { kind: "img", src: bot1, caption: "Chamomile & Lavender", tag: "Infusion · No. 04" },
  { kind: "video", src: pour.url, poster: bot3, caption: "Amber Pour", tag: "Tincture · in motion" },
  { kind: "img", src: bot2, caption: "Amber Flacon", tag: "Editorial" },
  { kind: "img", src: reel3, caption: "Second Skin", tag: "Balm · No. 02" },
  { kind: "img", src: bot4, caption: "By the Hand", tag: "Atelier study" },
];
const row2: Item[] = [
  { kind: "img", src: reel5, caption: "Silk Veil", tag: "Hydrosol" },
  { kind: "img", src: bot3, caption: "Honey Drop", tag: "Texture study" },
  { kind: "video", src: mist.url, poster: reel4, caption: "Desert Bloom", tag: "Hydrosol · in motion" },
  { kind: "img", src: reel6, caption: "Bronze Index", tag: "Pressed pigment" },
  { kind: "img", src: reel2, caption: "Liquid Gold", tag: "Oil · 30ml" },
  { kind: "img", src: reel1, caption: "Sculpted Balm", tag: "No. 04" },
];


function Card({ item }: { item: Item }) {
  return (
    <figure className="reel-card relative shrink-0 w-[260px] md:w-[340px] aspect-[3/4] overflow-hidden bg-surface group cursor-pointer">
      {item.kind === "img" ? (
        <img
          src={item.src}
          alt={item.caption}
          loading="lazy"
          width={1024}
          height={1280}
          className="size-full object-cover transition-transform duration-[2200ms] ease-out group-hover:scale-[1.15]"
        />
      ) : (
        <LoopVideo src={item.src} poster={item.poster} className="absolute inset-0 size-full" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-90" />
      {item.kind === "video" ? (
        <span className="absolute top-5 left-5 flex items-center gap-2 text-background text-[9px] uppercase tracking-[0.3em] z-10">
          <span className="size-1.5 rounded-full bg-accent animate-pulse" /> Live
        </span>
      ) : null}
      <figcaption className="absolute bottom-5 left-5 right-5 text-background translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
        <span className="block text-[9px] uppercase tracking-[0.3em] text-accent mb-1">
          {item.tag}
        </span>
        <span className="font-serif italic text-2xl leading-tight">{item.caption}</span>
      </figcaption>
      <div className="absolute top-5 right-5 size-8 rounded-full border border-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-background text-[10px]">→</span>
      </div>
    </figure>
  );
}

export function PhotoReel() {
  const headerRef = useReveal<HTMLDivElement>();
  const { ref: sceneRef, progress } = useScrollScene<HTMLDivElement>();
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll-driven 3D tilt of the whole reel block.
  const rotX = mapRange(progress, 0, 0.5, 10, 0) + mapRange(progress, 0.5, 1, 0, -8);
  const z = mapRange(progress, 0, 0.5, -180, 0) + mapRange(progress, 0.5, 1, 0, -120);

  return (
    <section
      ref={sceneRef}
      className="py-32 overflow-hidden border-t border-border bg-surface/40 perspective-2000"
    >
      <div
        ref={headerRef}
        className="reveal max-w-7xl mx-auto px-6 md:px-12 mb-16"
      >
        <div className="flex justify-between items-end gap-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-3">
              The Editorial Reel
            </span>
            <h2 className="font-serif italic text-5xl md:text-6xl">In Motion</h2>
          </div>
          <p className="hidden md:block max-w-xs text-sm text-muted-foreground leading-relaxed">
            A continuous gallery of light, pigment, and form — hover to slow time,
            hover a frame to lift it from the reel.
          </p>
        </div>
      </div>

      <div
        className="preserve-3d"
        style={{
          transform: `translate3d(0, 0, ${z}px) rotateX(${rotX}deg)`,
          willChange: "transform",
        }}
      >
        <div ref={trackRef} className="reel-row relative fade-edges">
          <div className="flex w-max gap-5 animate-marquee will-change-transform px-3">
            {[...row1, ...row1].map((c, i) => (
              <Card key={`r1-${i}`} item={c} />
            ))}
          </div>
        </div>

        <div className="reel-row relative mt-5 fade-edges">
          <div className="flex w-max gap-5 animate-marquee-reverse will-change-transform px-3">
            {[...row2, ...row2].map((c, i) => (
              <Card key={`r2-${i}`} item={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
