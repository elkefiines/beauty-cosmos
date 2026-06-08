## Direction

Warm botanical apothecary, video-led. Palette locked to `#1a140e` (ink), `#3d2a1a` (bark), `#b97a4a` (copper), `#e8d9c2` (cream). The page reads as a single continuous film: the camera (scroll) glides through 7 sealed rooms in an apothecary, each room a 3D stage with looping video at its core. No static frames anywhere — even idle sections breathe.

## New page structure (top → bottom)

1. **Atelier Hero** — full-bleed looping video of slow-pouring oil through warm light; 3D headline planes (`Botanica · Apothecary · Est.`) float at three Z-depths, parting as scroll begins; 3D product viewer slides in from behind the video plane.
2. **Living Index** — twin counter-marquees of 8 cards (4 video loops + 4 macro stills); cards tilt to cursor, lift in Z on hover, blur neighbors.
3. **Ritual Film Strip** — 3 cinematic video loops (pour, swatch on skin, mist) mounted as 3D film cells with sprocket holes; the strip pans horizontally as the user scrolls vertically (scroll-to-pan).
4. **Elemental Forms** — product grid on a curved 3D shelf; each card has its own micro-loop video on hover (steam, drop, petal fall); staggered Z-depth, cursor-driven shelf tilt.
5. **Specimen** — single hero product framed by an orbiting bronze ring + a second counter-rotating ring; background video loop of botanical macro behind a frosted vitrine.
6. **Manifesto** — text assembles word-by-word with `rotateX` flips synced to scroll; a slow ambient video loop drifts behind at 20% opacity.
7. **Footer Entrance** — footer rises from depth as the camera dollies down; copper hairline sweeps across; final ambient loop fades to ink.

Section seams: animated copper hairlines sweep across as each section enters.

## Media plan (all generated locally, served via Lovable Assets)

Generate fresh assets — discard the previous set since the look changes:
- 1 hero video (10s, 1080p, 16:9) — slow pour of amber oil, warm rim light, shallow depth
- 3 ritual videos (5s each, 1080p) — pour close-up, swatch on skin, fine mist
- 4 reel videos (5s each, 1080p, 4:3) — petals falling, steam curl, drop hitting water, hand on jar
- 1 specimen background video (10s, 1080p) — botanical macro drift
- 1 manifesto ambient video (10s, 1080p) — out-of-focus warm bokeh
- 4 macro stills (1280×1280 jpg) — texture closeups for reel + grid posters

All videos: `muted`, `loop`, `playsInline`, `preload="metadata"`, lazy-mounted via IntersectionObserver, with poster jpg for SSR + reduced-motion.

## Design tokens (locked, written into `src/styles.css`)

```text
--ink:          oklch from #1a140e
--bark:         oklch from #3d2a1a
--copper:       oklch from #b97a4a
--cream:        oklch from #e8d9c2
--copper-glow:  oklch(lighter copper)
--gradient-warm: linear-gradient(180deg, ink → bark)
--gradient-copper: linear-gradient(135deg, copper → copper-glow)
--shadow-vitrine: layered warm shadow + copper inner glow
```

Typography: Cormorant Garamond italic display (`h1`, `h2`), Inter for body — already aligns with apothecary editorial register.

## Motion system

- Shared `perspective: 2400px` wrapper on `<main>`; every section a `transform-style: preserve-3d` stage.
- `useScrollScene(sectionRef)` (already exists) returns `{ progress, enter, exit, center }` — extended to expose `translateZ`, `rotateX`, `opacity` mappings via CSS vars; one RAF loop, IntersectionObserver-gated.
- Per-section choreography:
  - Hero: stage `translateZ(0 → -600px)` + `rotateX(0 → 8deg)` + opacity 1 → 0.4 as scroll progresses
  - Reel: rows counter-translate X; cards tilt on cursor (`rotateY ±10deg`, `rotateX ±6deg`)
  - Film Strip: horizontal pan `translateX(0 → -60%)` tied to scroll progress
  - Elemental Forms: shelf `rotateX(6deg → 0)`, cards Z-stagger -120 → 0 on enter
  - Specimen: rings rotate continuously + offset by scroll
  - Manifesto: each word `rotateX(-90 → 0)` + `opacity 0 → 1` mapped to its slice of progress
  - Footer: `translateY(60px → 0)` + `translateZ(-200 → 0)` + copper line `scaleX(0 → 1)`
- Section seams: copper hairline `scaleX` sweep + small `translateZ` parallax.
- `prefers-reduced-motion`: disables all Z transforms, parallax, marquees, video autoplay → falls back to posters + simple fades.
- Mobile (<768px): Z ranges reduced ~40%, cursor tilt off, hero video swapped for poster, single-row reel, film strip becomes vertical stack.

## Files

**Create**
- `src/components/sections/AtelierHero.tsx` (replaces CinematicHero)
- `src/components/sections/LivingIndex.tsx` (replaces PhotoReel usage on home)
- `src/components/sections/ElementalForms.tsx`
- `src/components/sections/Specimen.tsx`
- `src/components/sections/FooterStage.tsx`
- `src/components/VitrineCard.tsx` — reusable tilt-card with video/image swap
- `src/components/OrbitRing.tsx` — SVG/CSS bronze rings for Specimen
- New asset pointers: `hero-atelier.mp4.asset.json`, `ritual-pour-v2.mp4.asset.json`, `ritual-swatch-v2.mp4.asset.json`, `ritual-mist-v2.mp4.asset.json`, `reel-petal.mp4.asset.json`, `reel-steam.mp4.asset.json`, `reel-drop.mp4.asset.json`, `reel-hand.mp4.asset.json`, `specimen-bg.mp4.asset.json`, `manifesto-ambient.mp4.asset.json`, 4 macro `.jpg`

**Edit**
- `src/routes/index.tsx` — recompose into the 7 new sections, shared perspective wrapper
- `src/styles.css` — repaint tokens to warm botanical palette, add gradients/shadows, vitrine + sprocket + orbit utilities, reduced-motion + mobile overrides
- `src/lib/useScrollScene.ts` — expose progress as CSS vars on the element
- `src/components/LoopVideo.tsx` — add `poster` prop, defensive play() catch
- `src/components/SectionSeam.tsx` — restyle in copper

**Remove from home use** (files kept, just unused on `/`)
- `src/components/sections/CinematicHero.tsx`, `RitualFilmStrip.tsx`, `Manifesto.tsx`, `PhotoReel.tsx` — superseded by new sections (RitualFilmStrip kept, restyled to copper; Manifesto kept, restyled).

## Out of scope

No routing, schema, auth, cart, or product-data changes. Header/nav and CartDrawer untouched. Other routes untouched.

## Verification

After build: open `/` in preview at mobile (411) and desktop (1440), scroll top→bottom, confirm no 500s, no console errors, videos autoplay and loop, reduced-motion fallback works (toggle OS setting check via class hook).