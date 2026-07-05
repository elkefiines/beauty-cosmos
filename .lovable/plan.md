# Plan — Complete the site & prepare for launch

Goal: turn the current cinematic demo into a working commerce site with real content, auth, checkout, order persistence, editorial pages, working footer, SEO, and a green security scan.

---

## 1. Auth (email + Google)

- Enable Google provider (`supabase--configure_social_auth`) + email/password.
- Create `public.profiles` (id → auth.users, display_name, avatar_url, marketing_opt_in) with RLS "own row" and auto-create trigger on signup.
- New public route `src/routes/auth.tsx` — sign in / sign up tabs, Google button via `lovable.auth.signInWithOAuth` (redirect to `${origin}/auth/callback`).
- Public `src/routes/auth.callback.tsx` — waits for session then routes to saved `from` path.
- `_authenticated/` layout is already provided by the integration; use it for `/account` and `/account/orders`.
- Nav shows "Sign in" or account avatar; cart still works signed-out (session_id).

## 2. Checkout & orders

Two paths, user picks in Q1 below. Default = Stripe (via `payments--enable_stripe_payments`).

- Schema migration:
  - `orders` (user_id nullable, email, status, subtotal, shipping, tax, total, currency, stripe_session_id, shipping_address jsonb, created_at)
  - `order_items` (order_id, product_id, shade_id, name_snapshot, price_snapshot, qty)
  - GRANTs + RLS: user reads own orders; service_role full.
- Server function `createCheckoutSession` — builds Stripe line items from cart, returns URL.
- Server route `src/routes/api/public/stripe-webhook.ts` — verifies signature, inserts order + items, clears cart.
- New route `src/routes/checkout.success.tsx` — reads `?session_id`, shows order summary.
- `cart.tsx` "Proceed to Checkout" wires to the server fn (currently `alert("coming soon")`).

## 3. Account area (`_authenticated/`)

- `/account` — profile edit (display_name, avatar, marketing opt-in).
- `/account/orders` — list of past orders with items and status.
- Sign-out button in Nav dropdown.

## 4. Content pages (match home cinematic language, wrapped in `<Stage>`)

- `/journal` — editorial index. New table `journal_posts` (slug, title, excerpt, cover_url, body_md, published_at, published bool) + public SELECT policy filtered to published. Owner-read via `requireSupabaseAuth`+has_role('admin') if we need drafts later — otherwise skip.
- `/journal/$slug` — post detail, head() reads title/excerpt/cover for OG.
- `/about` — atelier story, one hero image, manifesto typography.
- `/contact` — form → `contact_messages` table (anon INSERT allowed, admin-only SELECT). Sends toast on submit.
- `/stockists` — static list (no DB) with map-less location cards.

Seed 3 journal posts + 2 stockists via migration/insert tool.

## 5. Footer + Nav fixes

- Replace all `href="#"` in `Footer.tsx` with real `<Link>`s: Collections→/shop, The Lab→/journal, Stockists→/stockists, Sustainability→/about#sustainability, Shipping→/journal/shipping, Contact→/contact.
- Newsletter form → `newsletter_subscribers` table (anon INSERT, unique email). Toast on submit, disabled if already subscribed.
- Nav: add Journal + Account links; hide "Collections" hash link that currently mis-points.

## 6. Shop / product polish (leftovers from prior plan)

- Confirm all 8 products have `hero_image_url`, `gallery_urls`, `ingredients`, `volume`, `origin` populated (spot-check with `supabase--read_query`); backfill any nulls.
- `ProductCard` — ensure hero image renders (fallback gradient only if URL null).
- Add `/shop?sort=` (price asc/desc, newest) and search input debounced against `name/tagline`.

## 7. SEO & metadata

- Per-route `head()` with unique title/description/og for `/`, `/shop`, `/product/$slug`, `/journal`, `/journal/$slug`, `/about`, `/contact`, `/cart`, `/auth`, `/account`. Product + journal pull og:image from loader data.
- Add `src/routes/sitemap[.]xml.ts` — static routes + dynamic products + published journal posts.
- Add `public/robots.txt` with `Sitemap:` line.
- Root route: verify title/description are app-specific (already are).

## 8. Legal + trust

- `/privacy` and `/terms` — static markdown, linked from Footer.
- Cookie banner only if we add analytics; skip for now.

## 9. Pre-publish gates

- Run `supabase--linter` and fix any RLS/grant warnings introduced by new tables.
- Run `security--run_security_scan`; resolve criticals.
- Run build; fix any typecheck errors.
- Verify anon vs authenticated flows in Playwright: browse → add to cart → sign in → checkout (Stripe test mode) → order appears in `/account/orders`.
- Publish via `preview_ui--publish` after scan is green.

---

## Delivery order

1. Auth (routes + Google + profiles)
2. Content tables + `/journal`, `/about`, `/contact`, `/stockists`, footer fixes
3. Orders schema + Stripe checkout + webhook + success page + `/account/orders`
4. Shop/product polish + search/sort
5. SEO (per-route heads, sitemap, robots) + legal pages
6. Linter + security scan + publish

---

## Questions before I start

1. **Payments**: Stripe (recommended, needs your Stripe secret key later) or Paddle, or skip real checkout and just simulate an order record?
2. **Google sign-in**: enable now, or email/password only for launch?
3. **Journal + Contact**: build with real DB tables now, or keep static placeholder pages until you have content?
4. **Admin**: do you need an admin UI to manage products/journal, or will you edit via the DB tool?
