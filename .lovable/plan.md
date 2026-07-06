## Analysis

I ran a full sweep: **typecheck passes, production build passes, no runtime errors, no console errors, and all core routes render**. Data is fully seeded (8 products with hero images + 19 shades, 3 journal posts published, 3 stockists). Auth, cart, checkout, orders, admin, journal, contact, and newsletter are all wired to the DB.

There is nothing actively broken. The remaining gaps are launch-readiness items, not errors:

| Area | Status |
|---|---|
| Build / typecheck / runtime | ✅ clean |
| Products, shades, journal, stockists | ✅ seeded |
| Auth (email/password) + `_authenticated` gate | ✅ working |
| Checkout (simulated) → orders + order_items | ✅ working |
| Admin CRUD (journal, messages, orders) | ✅ working, but **no admin user exists yet** |
| Password reset | ❌ missing `/reset-password` route + "Forgot password?" link |
| First-admin bootstrap | ❌ requires manual DB insert today |
| Legal / privacy / terms copy | ⚠️ present but very short |
| SEO: sitemap.xml, robots.txt | ✅ present |
| Security scan | ⏳ not yet run |

## Plan — finish the missing pieces

### 1. Password reset flow (required by rules)
- Add "Forgot password?" link on `/auth` → calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: ${origin}/reset-password })`.
- New public route `src/routes/reset-password.tsx` — detects `type=recovery` in URL hash, shows "new password" form, calls `supabase.auth.updateUser({ password })`, then redirects to `/account`.

### 2. First-admin bootstrap
- Migration: SECURITY DEFINER function `public.claim_first_admin()` that grants the caller `admin` **only if no admin exists yet**. After that, it's a no-op.
- Small UI on `/account`: if user is signed in and no admin exists, show a one-time "Claim atelier admin" button that calls the RPC. Removes the need for the user to open a DB tool.

### 3. Flesh out legal + about copy
- Expand `/privacy` and `/terms` to real, non-placeholder copy (data collected, cookies, contact, jurisdiction, returns, shipping, IP).
- Add a short "Sustainability" anchor section on `/about` so the footer link resolves.

### 4. Small UX polish
- `Nav`: add "Journal" link on mobile menu (currently desktop-only via hidden md:flex — verify mobile).
- `/cart`: guard "Proceed to Checkout" so it disables when cart is empty (already does; verify).
- `/checkout/success`: after a few seconds, prefetch `/account/orders` so the "View orders" click is instant.

### 5. Pre-publish gates
- Run `supabase--linter`; fix any new warnings from the reset-password/claim-admin migration.
- Run `security--run_security_scan`; resolve criticals, document the rest in security memory.
- Final production `vite build` confirmation.
- Then surface the Publish action.

### Technical notes
- `claim_first_admin()` uses `SECURITY DEFINER SET search_path = public` and checks `NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role='admin')` inside a single transaction to prevent race conditions.
- `/reset-password` must be a **public** route (not under `_authenticated/`), because the recovery link lands there before the session is fully established.
- No schema changes to existing tables — only a new function + grant `EXECUTE ... TO authenticated`.

### Out of scope (explicitly not doing, per prior decisions)
- Real payments (you chose simulated).
- Google OAuth (you chose email/password only).
- Additional admin CRUD (products/stockists) — you chose "minimal admin".

Approve and I'll ship 1–5 in one pass.