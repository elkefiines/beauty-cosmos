# Fix Product 3D — switch to a true 3D product model

## Diagnosis
The current hero viewer on `/product/$slug` is `ProductShowcase3D`, which puts the real product photo on a flat `planeGeometry` inside a Canvas. That's why it "looks flat/wrong": there is no actual geometry — it's a textured billboard with a subtle sine wobble and pointer parallax. No orbit, no volume, no material response.

A real geometric viewer already exists (`ProductViewer` + `Models.tsx` with `LipstickModel` / `FoundationModel` / `SerumModel` / `FragranceModel`), keyed off `product.model_kind`, but the detail route stopped using it when the photo-plane was introduced.

## Fix strategy
Bring the geometric 3D model back as the hero, tinted by the selected shade, with proper orbit controls. Keep all real product photos accessible in the existing `ProductGallery` + large image below (no data changes, no DB changes).

## Changes

### 1. `src/components/viewer/ProductViewer.tsx` — upgrade to a real product hero
- Add `enableZoom` (with sensible `minDistance`/`maxDistance`) so users can inspect.
- Widen polar limits so the model can be tilted top-down a bit.
- Add a soft rim `pointLight` tinted with the shade `color` for material feedback.
- Keep `autoRotate` slow by default; pause on pointer interaction.
- Keep the beige studio background so it matches the page.

### 2. `src/components/viewer/Models.tsx` — small polish
- Stop the constant `useFrame` y-rotation inside each model (OrbitControls' `autoRotate` handles it) so dragging doesn't fight the model.
- Ensure the selected `color` is applied to the "product surface" mesh only (bullet/liquid), not the caps/bands — already mostly correct; verify per kind.

### 3. `src/routes/product.$slug.tsx` — swap the hero viewer
- Replace the lazy `ProductShowcase3D` import with a lazy `ProductViewer` import.
- Render `<ProductViewer kind={product.model_kind} color={color} className="absolute inset-0" />` in the hero slot.
- Update the caption pill to "Drag to rotate · scroll to zoom".
- Delete the `imageIdx`-driven `activeIndex` prop wiring for the 3D (no longer needed by the hero); `ProductGallery` + the large `<img>` below still use `imageIdx` unchanged, so real photos remain fully visible and clickable.

### 4. `src/components/ProductShowcase3D.tsx` — remove
- No longer referenced after step 3; delete the file to prevent drift.

## What stays the same
- Data source: `useProduct(slug)` → `products` + `product_shades`. No schema, no seed, no gallery changes.
- `ProductGallery` thumbnails, lightbox, and the large hero photo section below the 3D remain — real product images are still front-and-center.
- Shade selector, Add-to-bag, Ingredients, Ritual, Related sections untouched.

## Technical notes
- `ProductViewer` already uses `@react-three/fiber` + `@react-three/drei` (`OrbitControls`, `Environment`, `ContactShadows`) — no new deps.
- SSR is safe: viewer is loaded via `React.lazy` + `Suspense`, same pattern as today.
- `model_kind` is already an enum on `products` (`lipstick | foundation | serum | fragrance`) so every product resolves to a model with a sensible fallback.

## Verification
- Load `/product/gloss-bloom` (lipstick): bullet rotates, drag orbits, shade change re-tints the bullet, scroll zooms within limits.
- Load one product per `model_kind` and confirm each geometry appears.
- Playwright screenshot the hero at rest and after a drag to confirm true 3D depth (shadows/highlights shift), not a flat plane.
