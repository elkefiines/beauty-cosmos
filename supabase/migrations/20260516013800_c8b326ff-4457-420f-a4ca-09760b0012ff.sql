
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('lipstick','foundation','skincare','fragrance')),
  description text not null default '',
  base_price numeric(10,2) not null,
  model_kind text not null check (model_kind in ('lipstick','foundation','serum','fragrance')),
  hero_image_url text,
  created_at timestamptz not null default now()
);

create table public.product_shades (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  hex text not null,
  sku text not null,
  sort_order int not null default 0
);

create index on public.product_shades(product_id);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  product_id uuid not null references public.products(id) on delete cascade,
  shade_id uuid references public.product_shades(id) on delete set null,
  qty int not null default 1 check (qty > 0),
  created_at timestamptz not null default now()
);

create index on public.cart_items(session_id);

alter table public.products enable row level security;
alter table public.product_shades enable row level security;
alter table public.cart_items enable row level security;

create policy "products are public" on public.products for select using (true);
create policy "shades are public" on public.product_shades for select using (true);

-- cart: scoped by session_id passed via PostgREST setting `request.header.x-session-id`
-- Since we're using the publishable key client-side without auth, allow anon all CRUD;
-- but restrict each row's session_id to a non-empty value. Filtering by session_id
-- happens in queries.
create policy "anon can read cart" on public.cart_items for select using (true);
create policy "anon can insert cart" on public.cart_items for insert with check (length(session_id) > 8);
create policy "anon can update cart" on public.cart_items for update using (true) with check (length(session_id) > 8);
create policy "anon can delete cart" on public.cart_items for delete using (true);

-- Seed products
with p as (
  insert into public.products (slug, name, category, description, base_price, model_kind) values
  ('velvet-monolith','The Velvet Monolith','lipstick','A sculptural satin lipstick. High-pigment suspension in a botanical wax base for a weightless, second-skin finish.', 42.00,'lipstick'),
  ('gloss-bloom','Gloss / Bloom','lipstick','Liquid gloss with a soft mirror finish. Cushioned application, non-sticky wear.', 38.00,'lipstick'),
  ('fluid-dimension','Fluid Dimension','foundation','Hydrating veil foundation. 10 calibrated tones, breathable medium coverage.', 72.00,'foundation'),
  ('silk-veil','Silk Veil','foundation','Soft-focus second-skin foundation with a luminous matte finish.', 58.00,'foundation'),
  ('lumina-serum-no-4','Lumina Serum No. 4','skincare','A bio-synthetic hybrid oil that mimics the skin''s natural lipid barrier. Engineered for deep cellular hydration.', 145.00,'serum'),
  ('molecular-repair','Molecular Repair','skincare','Overnight peptide complex. Resurfacing and quietly luminous by morning.', 96.00,'serum'),
  ('atmospheric-no-1','Atmospheric No. 1','fragrance','A linear composition of bergamot, white pepper, and Atlas cedar. Architectural sillage.', 160.00,'fragrance'),
  ('ether-01','Ether 01','fragrance','Soft musks, iris, and warm vetiver. Worn as a quiet daily signature.', 140.00,'fragrance')
  returning id, slug
)
insert into public.product_shades (product_id, name, hex, sku, sort_order)
select p.id, s.name, s.hex, p.slug || '-' || s.sku, s.sort_order
from p
join (values
  ('velvet-monolith','Bare','#cda88a','01',1),
  ('velvet-monolith','Clay','#b0664f','02',2),
  ('velvet-monolith','Wine','#6b2a2e','03',3),
  ('velvet-monolith','Noir','#3a1a1a','04',4),
  ('gloss-bloom','Petal','#e8b8b0','01',1),
  ('gloss-bloom','Rose','#c97a7a','02',2),
  ('gloss-bloom','Plum','#8a4a5e','03',3),
  ('fluid-dimension','Alabaster','#f3ece3','01',1),
  ('fluid-dimension','Porcelain','#ecdcc3','02',2),
  ('fluid-dimension','Linen','#e1c9a6','03',3),
  ('fluid-dimension','Sand','#d4b184','04',4),
  ('fluid-dimension','Honey','#bc936a','05',5),
  ('fluid-dimension','Caramel','#9c714c','06',6),
  ('fluid-dimension','Walnut','#7a5438','07',7),
  ('fluid-dimension','Cocoa','#5b3d2b','08',8),
  ('silk-veil','01','#f0e4d4','01',1),
  ('silk-veil','03','#d8b794','02',2),
  ('silk-veil','05','#a87b58','03',3),
  ('silk-veil','07','#6e4a32','04',4)
) as s(slug,name,hex,sku,sort_order)
  on s.slug = p.slug;
