
# Home page → cinematic 3D film

Inspired by award-winning beauty/luxury sites (Aesop, Tom Ford, Diptyque editorial, Active Theory case studies, Resn, Locke & Key, Igloo Inc). The whole page reads as one 3D space the viewer travels through — every section sits on a Z-axis, images and short looping videos are the medium, and scroll acts as the camera.

## Reference language

- **Scroll-as-camera** (à la Active Theory / Igloo Inc): one continuous space, sections enter from depth, not just from below.
- **Editorial reel + product specimen** (Aesop / Diptyque): muted palette, serif italic, generous whitespace, hover lifts.
- **Looping micro-videos** (Tom Ford, Byredo): 4-8 sec silent loops as "living photography" — pour shots, swatches, texture macros — autoplay, muted, loop, playsInline.
- **3D product hero** (current viewer kept) framed inside a "vitrine" with depth.

## New page structure (top → bottom)

```text
[1] Cinematic hero        — 3D viewer + looping background video + parallax headline planes
[2] Living reel           — alternating image/video cards on dual marquee, hover lifts in Z
[3] Ritual film strip     — 3 short videos as 3D film frames sliding past camera
[4] Elemental forms       — product grid on a 3D shelf (staggered Z, tilt on cursor)
[5] Specimen pitch        — orbiting rings + 3D product viewer
[6] Manifesto             — oversized serif assembling word-by-word with rotateX flips
[7] Footer entrance       — footer rises from depth with accent line sweep
```

## Motion system (one coherent camera)

- **Shared perspective wrapper** on the page (`perspective: 2400px`) so depth reads continuously.
- **Scroll engine** (`useScrollScene` hook): per-section progress drives `translateZ`, `rotateX`, opacity, and parallax offsets.
- **Entrance default**: `translateZ(-280px) rotateX(6deg) opacity 0` → settle to flat at section center.
- **Per-layer parallax**: each section has 3 depth layers (bg orbs/video, mid content, fg accent) moving at different Z speeds.
- **Section seams**: a thin bronze line sweeps horizontally between sections; next section folds in from depth (~700ms cubic-bezier).
- **Cursor tilt** on the hero viewer and product cards (kept).
- **Marquee reel** with hover-pause + 3D row tilt tied to scroll.

## Imagery + video plan

Generate locally (no external CDN) and reuse `src/assets/`:

- **Hero loop**: 1 short macro video (serum drop, ~6s, 1280×720, h264, muted loop) → upload via `lovable-assets`.
- **Ritual film strip**: 3 short loops (pour, swatch on skin, fragrance mist) → upload via `lovable-assets`.
- **Reel**: keep existing 6 reel images, add 2 more macro stills generated with imagegen.
- All `<video>` tags: `autoPlay muted loop playsInline preload="metadata"` + `poster` (first-frame jpg) so SSR/preview never shows a black box.

Sources: prefer `videogen--generate_video` for the 4 short loops (each ≤6s). If unavailable, fall back to high-quality static images with subtle CSS Ken-Burns + grain to simulate motion.

## Files

- `src/lib/useScrollScene.ts` — new scroll-progress hook (rAF + IntersectionObserver).
- `src/components/sections/CinematicHero.tsx` — replaces inline hero; adds background loop video layer behind the 3D viewer.
- `src/components/sections/LivingReel.tsx` — refactor of `PhotoReel` mixing `<img>` and `<video>` cards.
- `src/components/sections/RitualFilmStrip.tsx` — new horizontal film-frame section.
- `src/components/sections/ElementalForms.tsx` — extract from index, add 3D shelf staggering.
- `src/components/sections/Specimen.tsx` — extract from index.
- `src/components/sections/Manifesto.tsx` — new word-by-word reveal.
- `src/components/SectionSeam.tsx` — shared seam transition between sections.
- `src/styles.css` — add scroll-scene utilities, reduced-motion overrides, video poster styles.
- `src/routes/index.tsx` — recompose into the 7 sections above inside a single perspective wrapper.
- `src/assets/` — new `.asset.json` pointers for hero + 3 ritual videos + 2 macro stills.

## Performance, accessibility, mobile

- Videos: muted, looped, `playsInline`, `preload="metadata"`, lazy-mounted via IntersectionObserver; paused when offscreen.
- `prefers-reduced-motion`: disable Z transforms, parallax, marquee, video autoplay → fall back to posters + fades only.
- Mobile (<768px): reduce Z ranges ~40%, drop cursor tilt, swap hero video for poster, single-row reel.
- All transforms on `transform`/`opacity` only; `will-change` added on enter, removed on settle.
- 3D viewer stays lazy-loaded; no extra WebGL added.

## Scope

Presentation only — no schema, routing, auth, or data changes. Existing product data + cart flow untouched.
