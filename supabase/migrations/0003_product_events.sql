-- Eventos de comportamento no catálogo: quando um cliente logado abre um
-- produto (ou o popup de bloqueado) e quando clica em "Comprar agora".
-- Guardado só pra alimentar o painel de analytics em /admin/analytics —
-- nunca usado pra decidir liberação de acesso.

create type product_event_type as enum ('view', 'checkout_click');

create table if not exists product_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products (id) on delete cascade,
  email citext references customers (email) on delete set null,
  event_type product_event_type not null,
  created_at timestamptz not null default now()
);

create index if not exists product_events_product_id_idx on product_events (product_id);
create index if not exists product_events_event_type_idx on product_events (event_type);
create index if not exists product_events_created_at_idx on product_events (created_at desc);

-- Totais por produto/tipo de evento, agregados no banco em vez de no
-- código — fica correto mesmo com muitas linhas em product_events.
create or replace view product_event_counts as
select product_id, event_type, count(*) as event_count
from product_events
group by product_id, event_type;

alter table product_events enable row level security;

-- Sem policy pública: só a service role (rota de tracking e painel
-- admin) lê/escreve aqui, nunca o browser direto.
