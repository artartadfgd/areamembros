-- Área de Membros — schema inicial
--
-- Modelo de acesso: os pagamentos acontecem inteiramente na Hotmart.
-- Este banco nunca processa pagamento — ele apenas recebe notificações
-- (webhook) da Hotmart e guarda quem comprou o quê, pelo e-mail usado
-- na compra. Não existe Supabase Auth aqui: a "sessão" do usuário é
-- criada pelo backend (fora do escopo desta migration) depois de
-- confirmar que o e-mail informado tem ao menos uma compra aprovada.
--
-- Por isso as políticas de RLS abaixo são propositalmente restritivas:
-- somente "products" publicados podem ser lidos com a chave anônima
-- (para a vitrine). "customers" e "purchases" só podem ser lidos/
-- escritos com a service role key, a partir de rotas de servidor
-- (webhook da Hotmart e verificação de login) — nunca do browser.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type product_type as enum (
  'course',      -- curso em vídeo, com módulos/aulas
  'video',       -- vídeo único
  'ebook',       -- e-book / PDF principal
  'file_bundle', -- pacote de arquivos (templates, planilhas, etc.)
  'other'
);

create type purchase_status as enum (
  'approved',
  'refunded',
  'canceled',
  'chargeback',
  'expired'
);

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text,
  description text not null default '',
  cover_url text,
  price_cents integer not null default 0,
  currency text not null default 'USD',
  type product_type not null default 'course',

  -- id do produto na Hotmart, usado para casar as compras recebidas
  -- via webhook com o produto correto aqui dentro.
  hotmart_product_id text unique,

  -- link de checkout da Hotmart para o botão "Comprar agora".
  checkout_url text,

  -- amostra grátis opcional (ex.: vídeo de preview, capítulo de cortesia)
  preview_url text,

  -- quando preenchido, o conteúdo deste produto já vive em outro app seu
  -- (ou de terceiros): o botão de acesso só redireciona pra cá em vez de
  -- listar os itens de `content` abaixo.
  external_url text,

  -- conteúdo liberado após a compra: lista de itens (vídeo, pdf, link, etc.)
  -- formato: [{ "type": "video", "title": "Aula 1", "url": "...", "duration_minutes": 12 }, ...]
  content jsonb not null default '[]'::jsonb,

  is_published boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_sort_idx
  on products (is_published, sort_order);

-- ---------------------------------------------------------------------
-- customers
-- Um "cliente" existe apenas pelo e-mail — não há senha nem cadastro.
-- A linha é criada na primeira compra aprovada (via webhook) ou no
-- primeiro login bem-sucedido.
-- ---------------------------------------------------------------------
create table if not exists customers (
  email citext primary key,
  name text,
  first_seen_at timestamptz not null default now(),
  last_login_at timestamptz
);

-- ---------------------------------------------------------------------
-- purchases
-- Uma linha por transação aprovada/atualizada recebida da Hotmart.
-- ---------------------------------------------------------------------
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  email citext not null references customers (email) on delete cascade,
  product_id uuid references products (id) on delete set null,

  hotmart_transaction_id text not null,
  hotmart_product_id text,

  status purchase_status not null default 'approved',
  price_paid_cents integer,

  purchased_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- payload bruto do webhook, guardado para auditoria/depuração
  raw_payload jsonb,

  unique (hotmart_transaction_id)
);

create index if not exists purchases_email_idx on purchases (email);
create index if not exists purchases_product_id_idx on purchases (product_id);
create index if not exists purchases_status_idx on purchases (status);

-- Um e-mail só é considerado "dono" de um produto se existir ao menos
-- uma compra com status = 'approved' para aquele product_id.
create or replace view active_purchases as
select p.*
from purchases p
where p.status = 'approved';

-- ---------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists purchases_set_updated_at on purchases;
create trigger purchases_set_updated_at
  before update on purchases
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table products enable row level security;
alter table customers enable row level security;
alter table purchases enable row level security;

-- Vitrine pública: qualquer um (anon ou logado) pode listar produtos
-- publicados. Isso é o que permite mostrar TODOS os produtos, mesmo
-- os não comprados, com capa/título/descrição/preço.
create policy "Produtos publicados são públicos"
  on products for select
  using (is_published = true);

-- Nada de customers/purchases pelo cliente anônimo — essas tabelas só
-- são acessadas pela service role key, em rotas de servidor
-- (webhook da Hotmart e verificação de login por e-mail). A checagem
-- de "o produto X está liberado para este e-mail" também acontece no
-- servidor, nunca só no front-end.
