## 1. Remove the floating "3D" button

Delete `<MotionControls />` from `src/routes/__root.tsx` and remove the import. Keep the `MotionProvider` (the presets/snap/reduced-motion still power the home scroll scenes) — only the visible control chip + debug overlay go away. `src/components/MotionControls.tsx` becomes unused; delete it too.

## 2. Real product imagery + data

Right now products render as radial-gradient blobs (`ProductCard`) and cart thumbs are flat color swatches (`cart.tsx`). Home reel and hero already use real photography — the catalog does not.

**Data layer**
- Add columns to `products`: `hero_image_url` (already exists, currently null), `gallery_urls text[]`, `tagline text`, `ingredients text[]`, `volume text`, `origin text`.
- Migration to backfill all 8 seeded products with:
  - real name, tagline, long-form description, price, volume, origin, 4–6 ingredients
  - `hero_image_url` + 3 `gallery_urls` per product, sourced as Lovable Assets (studio-style bottles / lipstick / serum / fragrance imagery generated via `imagegen` at premium quality, one hero + 3 lifestyle per product, saved under `src/assets/products/<slug>-*.jpg` and uploaded via `lovable-assets create` so URLs are CDN-stable).
- Extend `Product` type in `src/lib/useProducts.ts` with the new fields.

## 3. Shop page — match the home cinematic language

Rewrite `src/routes/shop.tsx` to feel like a continuation of the home film:

- Wrap the page contents in the same `<Stage label="Shop Header">` / `<Stage label="Catalog Grid">` primitives so scroll-depth, tilt, and copper seams carry over.
- Header: oversized serif italic title, small copper eyebrow, thin animated seam beneath — identical treatment to home section headings.
- Category filter row rendered as recessed pill nav with the same border/tracking as the home nav.
- Product grid: replace `ProductCard`'s gradient blob with a real `hero_image_url` `<img>` inside the same `aspect-[3/4] bg-surface` frame; add a mouse-tracked 3D tilt on hover (reusing the pattern from `HeroViewer`), a slow zoom-in on the image, and the existing giant italic index number sliding up from behind.
- Add a short editorial intro block above the grid (one line of manifesto copy + a hairline).
- Footer already wrapped by `FooterStage` in `__root.tsx` — nothing extra needed.

## 4. Product detail page

`src/routes/product.$slug.tsx` keeps the 3D viewer (per your earlier instruction), and gains real editorial content around it:

- Two-column layout stays. Left column becomes a **stacked media column**: 3D viewer on top, then a vertical scroll gallery of the real `gallery_urls` images (each in `<Stage>` so they enter with depth as you scroll).
- Right column gains: tagline under the title, longer description, ingredients list styled as bordered rows, `volume` + `origin` in the existing two-up block (currently hardcoded "Cold-blended / Brussels" — read from data).
- Add a "The Ritual" strip below the fold — 3 numbered steps + one real lifestyle photo, wrapped in `<Stage>` for the same recession animation used on home.
- Add a "You may also love" 4-up mini-grid at the bottom using `ProductCard` (same category, excluding current).

## 5. Cart page

`src/routes/cart.tsx` polish:

- Replace the flat colored square thumbnail with the product's real `hero_image_url` and a small shade dot overlaid at the bottom-right when a shade is chosen.
- Wrap the header and the line-items block in `<Stage>` for the same scroll-in choreography as home.
- Empty state: use one lifestyle image behind the "Your bag is empty" panel with a subtle Ken Burns drift.
- Summary panel: keep sticky, add a thin copper hairline seam at the top matching `SectionSeam`.

## 6. Nav consistency

Verify `src/components/Nav.tsx` matches home aesthetic on all inner routes (transparent over hero, solid-blur on scroll). No structural change unless it doesn't.

## Technical notes

- All new images generated via `imagegen--generate_image` (premium for hero shots, standard for gallery) and uploaded through `lovable-assets create` so they live on CDN, not in the repo bundle.
- One SQL migration adds columns + backfills all 8 products. `GRANT`s already exist on `products`; no policy changes.
- No new dependencies. All motion reuses `Stage`, `FooterStage`, `useScrollScene`, `useReveal`.
- Deliverable order: (1) remove button, (2) migration + assets, (3) shop, (4) product, (5) cart.
