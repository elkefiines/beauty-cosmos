import { useEffect, useRef, useState } from "react";
import { useScrollScene, mapRange } from "@/lib/useScrollScene";

const lines = [
  "Beauty is not applied —",
  "it is constructed,",
  "molecule by molecule,",
  "geometry by geometry.",
];

export function Manifesto() {
  const { ref, progress } = useScrollScene<HTMLDivElement>();
  const lift = mapRange(progress, 0, 0.6, 120, 0);
  const op = mapRange(progress, 0, 0.4, 0, 1);

  // Word-by-word flip-in tied to scroll progress
  const wordsPerLine = lines.map((l) => l.split(" "));
  const totalWords = wordsPerLine.flat().length;
  let counter = 0;

  return (
    <section
      ref={ref}
      className="relative py-40 px-6 md:px-12 overflow-hidden perspective-2000 bg-background"
    >
      <div
        className="max-w-6xl mx-auto preserve-3d"
        style={{
          transform: `translate3d(0, ${lift}px, 0)`,
          opacity: op,
          willChange: "transform, opacity",
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-accent block mb-10">
          Manifesto · IV
        </span>
        <h2 className="font-serif italic text-5xl md:text-8xl lg:text-9xl leading-[0.95]">
          {wordsPerLine.map((words, li) => (
            <span key={li} className="block">
              {words.map((w, wi) => {
                const idx = counter++;
                const start = 0.15 + (idx / totalWords) * 0.6;
                const end = start + 0.12;
                const p = mapRange(progress, start, end, 0, 1);
                const rotX = (1 - p) * 80;
                const yy = (1 - p) * 40;
                return (
                  <span key={wi} className="inline-block mr-[0.25em] preserve-3d">
                    <span
                      className="inline-block"
                      style={{
                        transform: `translate3d(0, ${yy}px, 0) rotateX(${rotX}deg)`,
                        opacity: p,
                        willChange: "transform, opacity",
                      }}
                    >
                      {w}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
