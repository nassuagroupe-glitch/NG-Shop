-- À exécuter une fois dans l'éditeur SQL de Supabase (Project → SQL Editor → New query)

create extension if not exists pgcrypto;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'Nouvelle',
  customer jsonb not null,
  items jsonb not null,
  payment_method text not null,
  subtotal_ht numeric not null,
  tva numeric not null,
  delivery_fee numeric not null,
  total numeric not null
);

alter table orders enable row level security;

-- Le gérant connecté peut tout lire, modifier, supprimer
create policy "authenticated can select orders" on orders
  for select to authenticated using (true);

create policy "authenticated can update orders" on orders
  for update to authenticated using (true);

create policy "authenticated can delete orders" on orders
  for delete to authenticated using (true);

-- N'importe qui peut créer une nouvelle commande (statut initial obligatoire)
create policy "anyone can insert new orders" on orders
  for insert to anon, authenticated with check (status = 'Nouvelle');

-- Suivi client : récupérer UNE commande par référence exacte, sans exposer la liste complète
create or replace function get_order_by_id(order_id uuid)
returns setof orders
language sql
security definer
set search_path = public
as $$
  select * from orders where id = order_id;
$$;

grant execute on function get_order_by_id(uuid) to anon, authenticated;

-- Active les mises à jour en temps réel du tableau de bord
alter publication supabase_realtime add table orders;

-- Création de commande : la policy d'insert seule ne suffit pas car le
-- client a besoin de relire l'id généré juste après (createOrder fait un
-- .select('id') après l'insert), et il n'y a pas de policy select pour les
-- clients anonymes. On passe donc par une fonction security definer.
create or replace function create_order(
  customer jsonb,
  items jsonb,
  payment_method text,
  subtotal_ht numeric,
  tva numeric,
  delivery_fee numeric,
  total numeric
)
returns uuid
language sql
security definer
set search_path = public
as $$
  insert into orders (customer, items, payment_method, subtotal_ht, tva, delivery_fee, total)
  values (customer, items, payment_method, subtotal_ht, tva, delivery_fee, total)
  returning id;
$$;

grant execute on function create_order(jsonb, jsonb, text, numeric, numeric, numeric, numeric) to anon, authenticated;

-- Avis clients (notes produits)

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_id text not null,
  customer_name text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  approved boolean not null default false
);

alter table reviews enable row level security;

-- Le public ne voit que les avis validés par le gérant
create policy "anyone can select approved reviews" on reviews
  for select to anon, authenticated using (approved = true);

-- Le gérant connecté voit aussi les avis en attente (modération)
create policy "authenticated can select all reviews" on reviews
  for select to authenticated using (true);

create policy "authenticated can update reviews" on reviews
  for update to authenticated using (true);

create policy "authenticated can delete reviews" on reviews
  for delete to authenticated using (true);

-- Dépôt d'avis : passe par une fonction security definer (même raison que
-- create_order) pour forcer approved = false quel que soit l'appelant anonyme.
create or replace function submit_review(
  product_id text,
  customer_name text,
  rating smallint,
  comment text
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into reviews (product_id, customer_name, rating, comment, approved)
  values (product_id, customer_name, rating, nullif(trim(comment), ''), false);
$$;

grant execute on function submit_review(text, text, smallint, text) to anon, authenticated;

-- Mises à jour en temps réel pour la file de modération du tableau de bord
alter publication supabase_realtime add table reviews;
