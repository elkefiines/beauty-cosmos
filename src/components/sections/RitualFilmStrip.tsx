import { useScrollScene, mapRange } from "@/lib/useScrollScene";
import { LoopVideo } from "@/components/LoopVideo";
import pour from "@/assets/ritual-pour.mp4.asset.json";
import swatch from "@/assets/ritual-swatch.mp4.asset.json";
import mist from "@/assets/ritual-mist.mp4.asset.json";
import reel2 from "@/assets/reel-2.jpg";
import reel5 from "@/assets/reel-5.jpg";
import reel4 from "@/assets/reel-4.jpg";

const frames = [
  { src: pour.url, poster: reel2, label: "Pour", caption: "Liquid Gold" },
  { src: swatch.url, poster: reel5, label: "Swatch", caption: "Second Skin" },
  { src: mist.url, poster: reel4, label: "Mist", caption: "Desert Bloom" },
];

export function RitualFilmStrip() {
  const { ref, progress } = useScrollScene<HTMLDivElement>();
  // Horizontal pan across film frames as user scrolls through the section.
  const x = mapRange(progress, 0.1, 0.95, 4, -55);
  const z = mapRange(progress, 0, 0.5, -220, 0) + mapRange(progress, 0.5, 1, 0, -120);
  const rot = mapRange(progress, 0, 0.5, 8, 0) + mapRange(progress, 0.5, 1, 0, -6);

  return (
    <section
      ref={ref}
      className="relative py-32 overflow-hidden bg-foreground text-background perspective-2000"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 flex justify-between items-end gap-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent block mb-3">
            Rituals on Film
          </span>
          <h2 className="font-serif italic text-5xl md:text-6xl">A study in motion.</h2>
        </div>
        <p className="hidden md:block max-w-xs text-sm text-background/60 leading-relaxed">
          Three frames from the laboratory — slowed until pigment, light, and gesture
          read as architecture.
        </p>
      </div>

      <div
        className="relative w-[140%] preserve-3d"
        style={{
          transform: `translate3d(${x}%, 0, ${z}px) rotateY(${rot}deg)`,
          willChange: "transform",
        }}
      >
        <div className="flex gap-8 px-12">
          {frames.map((f, i) => (
            <figure
              key={i}
              className="relative shrink-0 w-[42vw] md:w-[34vw] aspect-[3/4] overflow-hidden bg-background/5 border border-background/10"
              style={{
                transform: `translateZ(${(i - 1) * 40}px) rotateY(${(i - 1) * -3}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <LoopVideo src={f.src} poster={f.poster} className="absolute inset-0 size-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-foreground/20" />
              {/* Film sprockets */}
              <div className="absolute inset-y-0 left-0 w-4 flex flex-col justify-around py-3 bg-foreground/40">
                {Array.from({ length: 10 }).map((_, k) => (
                  <span key={k} className="block size-2 rounded-sm bg-background/30 mx-auto" />
                ))}
              </div>
              <div className="absolute inset-y-0 right-0 w-4 flex flex-col justify-around py-3 bg-foreground/40">
                {Array.from({ length: 10 }).map((_, k) => (
                  <span key={k} className="block size-2 rounded-sm bg-background/30 mx-auto" />
                ))}
              </div>
              <figcaption className="absolute bottom-5 left-8 right-8 flex justify-between items-end text-background">
                <span className="font-serif italic text-2xl">{f.caption}</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-accent">
                  Frame · {String(i + 1).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
