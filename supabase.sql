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
