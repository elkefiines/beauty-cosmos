## Aetheria — 3D Cosmetics Marketplace (Storefront)

A premium beauty storefront in the "Sculpted Minimalism v2" direction: editorial typography (Cormorant Garamond + Montserrat), warm canvas palette (#FCFAF7 / #1C1C1C / #A67C52), generous whitespace, and a hero 3D product viewer on detail pages.

### Pages (TanStack routes)

- `/` — Home: sticky-depth hero, floating product, "Elemental Forms" categories grid, featured 3D specimen section, footer
- `/shop` — Catalog grid with category filter (Lipstick, Foundation, Skincare, Fragrance) and shade swatches
- `/product/$slug` — Detail page with **rotatable 3D viewer** (react-three-fiber), shade selector, description, add to cart
- `/cart` — Cart line items, quantities, subtotal, checkout placeholder

Cart drawer accessible from nav on every page. No auth, no payments (per scope).

### 3D Viewer

- `@react-three/fiber` + `@react-three/drei` for `<Canvas>`, `OrbitControls`, `Environment`, `ContactShadows`
- Procedural GLSL-free meshes per category (lipstick: capsule + cylinder; foundation: rounded box + cap; serum dropper: cylinder + sphere; fragrance: extruded prism) — colored by selected shade, lit with studio HDRI preset
- Subtle auto-rotate until user interacts; affordance pill: "Drag to rotate"
- Lazy-loaded behind `<Suspense>` so the rest of the page is instant

### Data (Lovable Cloud)

Tables:
- `products` — id, slug, name, category, description, base_price, model_kind ('lipstick'|'foundation'|'serum'|'fragrance'), hero_image_url
- `product_shades` — id, product_id, name, hex, sku
- `cart_items` — id, session_id (anon UUID in localStorage), product_id, shade_id, qty

RLS: products + shades public read; cart_items scoped by `session_id` (anonymous cart, no auth needed).
Seed ~8 products across the 4 categories.

### State & utilities

- TanStack Query for product fetching via server functions in `src/lib/*.functions.ts`
- Anonymous `sessionId` in localStorage; cart hook (`useCart`) wraps add/update/remove + line totals
- Toast on add-to-cart (sonner)

### Design tokens (src/styles.css)

Replace tokens with: `--background` #FCFAF7, `--foreground` #1C1C1C, `--primary` #1C1C1C, `--accent` #A67C52, `--surface/muted` #F2EFE9. Add `--font-serif` Cormorant Garamond, `--font-sans` Montserrat. Convert to oklch for token block.

### Generated images

Use `imagegen` for category tiles and hero atmospheric shots from the prototype's `data-prompt` placeholders, stored in `src/assets/`.

### Technical notes

```text
src/
  routes/
    __root.tsx        (nav + cart drawer + footer wrapper)
    index.tsx         (home)
    shop.tsx
    product.$slug.tsx
    cart.tsx
  components/
    Nav.tsx, Footer.tsx, CartDrawer.tsx
    ProductCard.tsx, ShadeSelector.tsx
    viewer/ProductViewer.tsx + meshes/{Lipstick,Foundation,Serum,Fragrance}.tsx
  lib/
    products.functions.ts, cart.functions.ts
    useCart.ts, sessionId.ts
```

Packages to add: `three`, `@react-three/fiber`, `@react-three/drei`.

### Out of scope (future)

Auth, payments/checkout, vendor onboarding, AR try-on, reviews, search.
