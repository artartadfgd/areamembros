# Acervo — área de membros

App de entrega de produtos digitais. Os pagamentos acontecem na Hotmart;
este app recebe o webhook da Hotmart, guarda quem comprou o quê (por
e-mail) e libera o acesso ao conteúdo.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (Postgres + Storage)
- Hotmart (checkout + webhook de compra aprovada)

## Como entrar funciona (sem senha, sem cadastro)

Não existe Supabase Auth tradicional aqui. O usuário digita o e-mail que
usou na compra da Hotmart; o backend confere se aquele e-mail tem uma
compra aprovada registrada (recebida via webhook) e, se tiver, cria a
sessão. Essa verificação é sempre feita no servidor — nunca só no
front-end. Essa parte (rota de login + webhook) ainda será implementada
na próxima etapa; por enquanto o catálogo usa dados mockados
(`lib/mock-data.ts`).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Banco de dados

O schema inicial está em `supabase/migrations/0001_init.sql`
(`products`, `customers`, `purchases`). Para aplicar num projeto
Supabase:

```bash
supabase link --project-ref <seu-project-ref>
supabase db push
```

Copie `.env.example` para `.env.local` e preencha com as credenciais do
seu projeto Supabase (Project Settings → API).

## Estrutura

```
app/
  page.tsx                 vitrine (catálogo) — todos os produtos, bloqueados ou não
  produtos/[slug]/page.tsx detalhe do produto + conteúdo (se liberado)
  entrar/page.tsx          placeholder do login por e-mail
components/                ProductCard, header, tema, etc.
lib/
  types.ts                 tipos espelhando o schema do banco
  mock-data.ts             catálogo mockado para esta primeira etapa
  supabase/                clientes Supabase (browser, server, admin)
supabase/migrations/       schema SQL
```
