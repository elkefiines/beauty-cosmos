import { Link } from "@tanstack/react-router";
import { HeroViewer } from "@/components/HeroViewer";
import { LoopVideo } from "@/components/LoopVideo";
import { useScrollScene, mapRange } from "@/lib/useScrollScene";
import heroVideo from "@/assets/hero-atelier.mp4.asset.json";
import heroPoster from "@/assets/botanical-3.jpg";


export function CinematicHero() {
  const { ref, progress } = useScrollScene<HTMLDivElement>();
  // As the user scrolls down, the hero recedes into depth.
  const z = mapRange(progress, 0.4, 1, 0, -260);
  const rot = mapRange(progress, 0.4, 1, 0, -8);
  const op = mapRange(progress, 0.55, 0.95, 1, 0);
  // Parallax layers
  const videoY = mapRange(progress, 0, 1, -60, 120);
  const textY = mapRange(progress, 0, 1, 0, -80);

  return (
    <header
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-28 overflow-hidden perspective-2000 bg-background"
    >

      {/* Background video layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translate3d(0, ${videoY}px, 0)`, willChange: "transform" }}
      >
        <LoopVideo
          src={heroVideo.url}
          poster={heroPoster}
          className="absolute inset-0 size-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,transparent_0%,var(--background)_80%)]" />
      </div>


      {/* Floating ambient rings */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 -left-20 size-96 border border-accent/30 rounded-full blur-3xl animate-drift" />
        <div
          className="absolute bottom-1/4 -right-20 size-96 border border-accent/20 rounded-full blur-2xl animate-drift"
          style={{ animationDelay: "-6s" }}
        />
      </div>

      {/* Foreground stage with scroll-driven recession */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-7xl mx-auto items-center relative z-10 gap-12 preserve-3d"
        style={{
          transform: `translate3d(0, ${textY}px, ${z}px) rotateX(${rot}deg)`,
          opacity: op,
          willChange: "transform, opacity",
        }}
      >
        <div className="lg:col-span-7 animate-rise preserve-3d">
          <span className="text-[10px] uppercase tracking-[0.4em] text-accent block mb-6 animate-rise">
            Aetheria Laboratoire
          </span>
          <h1 className="font-serif italic text-[64px] md:text-[110px] lg:text-[130px] leading-[0.85] -ml-1 mb-10">
            <span className="block animate-rise" style={{ animationDelay: "0.1s" }}>
              The New
            </span>
            <span className="block lg:pl-20 animate-rise" style={{ animationDelay: "0.25s" }}>
              Geometry
            </span>
            <span className="block text-accent animate-rise" style={{ animationDelay: "0.4s" }}>
              of Beauty
            </span>
          </h1>
          <p
            className="max-w-md text-sm leading-relaxed text-muted-foreground mb-8 animate-rise"
            style={{ animationDelay: "0.55s" }}
          >
            Experience cosmetics through the lens of architectural precision. Our laboratory
            synthesizes molecular science with sculptural form — every product, viewable in
            three dimensions before it touches your skin.
          </p>
          <Link
            to="/shop"
            className="inline-block px-10 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-accent transition-all duration-500 hover:translate-y-[-2px] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] animate-rise"
            style={{ animationDelay: "0.7s" }}
          >
            Enter the Laboratory
          </Link>
        </div>
        <div className="lg:col-span-5 relative flex justify-end animate-float">
          <div className="w-full max-w-sm">
            <HeroViewer />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-muted-foreground z-10">
        <span className="text-[9px] uppercase tracking-[0.4em]">Scroll</span>
        <span className="block h-10 w-px bg-foreground/30 animate-pulse" />
      </div>
    </header>
  );
}
