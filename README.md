# Cache — member area

A digital products membership app. Payments happen on Hotmart; this app
receives Hotmart's webhook, records who bought what (by email), and
unlocks the matching content.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- next-intl (i18n — English default, Portuguese, Spanish)
- Supabase (Postgres + Storage)
- Hotmart (checkout + purchase-approved webhook)

## How login works (no password, no sign-up)

There's no traditional Supabase Auth here. The user types the email they
used to buy on Hotmart; the backend checks whether that email has an
approved purchase on record (received via webhook) and, if so, creates
the session. That check always happens server-side — never only in the
front-end. The login route + webhook are still coming in the next step;
for now the catalog uses mock data (`lib/mock-data.ts`).

## Internationalization

Routes live under `app/[locale]/`. English (`en`) is the default and has
no URL prefix (`/`, `/products/x`); other locales are prefixed
(`/pt/produtos/x`, `/es/productos/x`) — see `i18n/routing.ts` for the
locale list and localized pathnames, and `messages/*.json` for the UI
copy. Adding a language means adding a locale to `i18n/routing.ts` and a
matching `messages/<locale>.json` file. Mock product content itself is
only in English for now — translating actual product catalog content is
a separate, later concern from translating the UI chrome.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

The initial schema lives in `supabase/migrations/0001_init.sql`
(`products`, `customers`, `purchases`). To apply it to a Supabase
project:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Copy `.env.example` to `.env.local` and fill it in with your Supabase
project's credentials (Project Settings → API).

For products whose content already lives in an existing app (yours or a
third party's) rather than in `content`, set `products.external_url`.
Once unlocked, the product page shows an "Open the app" button that
redirects there instead of listing content — no SSO, just a link; the
user logs into that app however it already handles login.

## Structure

```
app/[locale]/
  page.tsx                     catalog — every product, locked or not
  products/[slug]/page.tsx     product detail + content (if unlocked)
  login/page.tsx                placeholder for email login
  layout.tsx                    root layout: fonts, theme, i18n provider
i18n/                           next-intl routing/navigation/request config
messages/                       en.json (source of truth), pt.json, es.json
components/                     ProductCard, header, locale switcher, theme, etc.
lib/
  types.ts                      types mirroring the database schema
  mock-data.ts                  mock catalog for this stage
  supabase/                     Supabase clients (browser, server, admin)
supabase/migrations/            SQL schema
```
