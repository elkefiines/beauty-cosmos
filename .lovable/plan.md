## Goal

Turn `/product/$slug` into a real 3D **image showcase** built from real DB data, and sweep every other page for broken bits, empty states, and content that isn't coming from the backend.

---

## Part 1 — 3D product detail page (real images, real data)

Rebuild `src/routes/product.$slug.tsx` around the actual hero + gallery photos instead of the parametric lipstick/bottle mesh.

**New 3D showcase (`ProductShowcase3D`)**
- Full-bleed stage using Three.js (already installed via `@react-three/fiber` + `drei`).
- The hero image is loaded as a **texture on a floating plane** with:
  - Subtle idle rotation + mouse-parallax tilt (pointer moves camera target, not the mesh — feels like the photo levitates).
  - Soft studio lighting + `ContactShadows` beneath, `Environment preset="studio"` for reflections.
  - Shade selection re-tints an accent rim-light (real per-shade `hex` from DB) so the object still responds to shade taps.
- A thin animated ring / dust-motes layer behind the plane for the "vitrine" feel already used elsewhere.
- Below the canvas: a horizontal **real-image gallery carousel** driven by `gallery_urls` (falls back to `[hero_image_url]` when empty). Click a thumbnail → the 3D plane cross-fades to that texture.
- Zoom-on-click opens a lightbox with the raw high-res image.
- Everything is `<Suspense>`-wrapped with a skeleton; the 3D canvas is `lazy()`-imported (already the pattern) so SSR is safe.

**Real data wiring**
- Continue using `useProduct(slug)` — it already returns product + shades from Supabase.
- Populate `gallery_urls` in the DB for all 8 products (currently NULL) via a data insert so the carousel has 3–4 real images each. Use the existing hero image plus category-appropriate lifestyle stills that already live in `src/assets/*` (botanical-1..4, etc.). No new image generation — reuse what's shipped.
- Keep the existing right-column detail block (price, shades, add-to-bag, volume, origin, ingredients, ritual, related) since it's already fully DB-backed.

**Files touched**
- `src/routes/product.$slug.tsx` — swap `ProductViewer` for `ProductShowcase3D`, add gallery + lightbox.
- `src/components/viewer/ProductShowcase3D.tsx` — **new** (textured floating plane, shade rim-light, parallax, cross-fade).
- `src/components/ProductGallery.tsx` — **new** (thumbnail rail + lightbox).
- Data insert: fill `products.gallery_urls` for all 8 rows.
- The old `Models.tsx` / parametric `ProductViewer.tsx` can stay for the cart drawer / small previews.

---

## Part 2 — Full-site sweep (fix every broken/incomplete surface)

Audit results — items I'll fix in this pass:

1. **Home `Specimen` section** — static hardcoded "Amber Vial · 30ml" card. Re-wire to pull a real featured product from DB (`useProducts()` first row) so the name/volume/hero image come from the backend, matching the rest of the site.
2. **Home `PhotoReel`** — currently local image asset only. Verify it renders the same real product photos used by cards (no data change needed if it already does; otherwise switch it to `useProducts()`).
3. **Cart empty-state background** — hardcoded CDN URL to a specific serum. Swap for a randomly chosen real product hero from DB so it always matches what's shippable.
4. **CartDrawer** — re-verify it uses `useCart` (it does). Add missing "View bag" link if absent.
5. **Checkout** — the `useEffect`-based auth redirect race can leave the form flashing. Move the route under `_authenticated/` OR keep the current pattern but render nothing until `checked`. Also add empty-cart guard that redirects to `/shop`.
6. **Checkout success** — confirm it fetches the real order by `order` search param (via `getOrderById` server fn); add fetch + render of items/total if missing.
7. **Journal index + `$slug`** — verify pagination/empty states; ensure `head()` uses the post title/excerpt/cover from DB (real OG per post).
8. **Stockists** — confirm rows come from DB; add empty state.
9. **Contact** — verify form insert into `contact_messages` succeeds with RLS (anon insert policy). Add success toast + reset.
10. **About** — currently short placeholder; expand to real brand copy consistent with the site voice (small edit, no data).
11. **Nav** — mobile menu drawer, active-link styling, ensure every route in the tree is reachable.
12. **Footer** — verify newsletter subscribe writes to `newsletter_subscribers` and shows toast.
13. **Account / Account orders** — verify orders list is user-scoped via `requireSupabaseAuth`; add empty state.
14. **Admin (index/orders/journal/messages)** — verify each list loads via `requireSupabaseAuth` + `has_role('admin')`; add row actions (mark shipped, publish/unpublish post, mark message read). Currently read-only; add the minimal mutations.
15. **Sitemap `/sitemap.xml`** — regenerate from real DB (products + journal posts) so it's not stale.
16. **404 / errorComponent** — confirm every route with a loader defines `errorComponent` + `notFoundComponent`; add where missing.
17. **Head metadata** — every leaf route gets its own real `title` / `description` / `og:*`. Product + journal detail routes derive OG from loader data (real image URL).

---

## Part 3 — Verification before handing back

- `bun run build` (typecheck + prod build must be clean).
- `supabase--linter` — resolve any new warnings from the gallery insert.
- Playwright smoke against localhost: `/`, `/shop`, `/product/velvet-monolith` (3D loads, gallery swaps, add-to-bag works), `/cart`, `/checkout` (auth gate), `/journal`, `/contact` (submit succeeds), `/account` (with session).
- Screenshot the new 3D showcase to confirm the real image is visibly the hero of the page.

## Out of scope

- Real payments (checkout stays simulated).
- Google OAuth (email/password only, as previously chosen).
- New product photography / regenerating hero images.
