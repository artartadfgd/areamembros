# Teacher Jessica Miller — member area

A digital products membership app. Payments happen on Hotmart; this app
receives Hotmart's webhook, records who bought what (by email), and
unlocks the matching content. No passwords, no sign-up — a customer
just types the email they bought with.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- next-intl (i18n — English default, Portuguese, Spanish)
- Supabase (Postgres) — data only, not Supabase Auth
- Hotmart (checkout + purchase-approved webhook)

## How it works

- **`/` is the gate**: signed out, it's just the email login screen —
  nothing else is visible until the customer enters the email they
  bought with. The server checks for an approved purchase for that
  email and, if found, sets a signed session cookie — no password, no
  account creation (`lib/session.ts`, `lib/actions/login.ts`). Setting
  `ALLOW_ANY_EMAIL_LOGIN=true` skips that purchase check entirely — any
  email gets in (products still only unlock for emails with a real
  purchase). It's a temporary escape hatch, not meant to stay on.
- **Catalog** (also `/`, once signed in): every published product,
  unlocked or not. Locked cards open a popup with a short description
  and a "Buy now" link instead of navigating away. Product detail pages
  (`/products/[slug]`) require the same session and bounce back to `/`
  if it's missing.
- **Hotmart webhook** (`/api/webhooks/hotmart`): Hotmart calls this on
  every purchase event. It's matched to a product by
  `hotmart_product_id` and stored in `purchases`, keyed by the buyer's
  email (`app/api/webhooks/hotmart/route.ts`).
- **Admin panel** (`/admin`): a single password (`ADMIN_PASSWORD`) gates
  a small dashboard to add/edit/delete products — this is how you enter
  each product's price, description, Hotmart product ID, and checkout
  link, without touching code.
- **Analytics** (`/admin/analytics`): per-product view/checkout-click
  counts plus a recent-activity feed (who looked at what, who clicked
  "Buy now", and when). Events are recorded by `/api/track` whenever a
  signed-in customer opens a product page, opens the locked-product
  popup, or clicks a checkout link.

None of this needs Supabase Auth: "customers" are just email addresses
that show up in `purchases`.

## Go-live checklist

1. **Create a Supabase project** (free tier is fine) at
   [supabase.com](https://supabase.com).
2. **Apply the schema**: in the Supabase dashboard, open the SQL editor
   and run the contents of `supabase/migrations/0001_init.sql`, then
   `0002_storage.sql` (creates the public `product-covers` bucket used
   for cover photos), then `0003_product_events.sql` (analytics) — or
   use the CLI: `supabase link --project-ref <ref> && supabase db push`.
3. **Set environment variables** — copy `.env.example` to `.env.local`
   for local dev, and add the same keys in Vercel (Project Settings →
   Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
     `SUPABASE_SERVICE_ROLE_KEY` — Supabase → Project Settings → API.
   - `SESSION_SECRET` — any long random string, e.g.
     `openssl rand -base64 32`.
   - `ADMIN_PASSWORD` — the password for `/admin`. Pick something long;
     there's no username, just this password.
   - `HOTMART_WEBHOOK_TOKEN` — see step 5.
   - `HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET`, `HOTMART_BASIC_TOKEN`
     (optional but recommended) — see step 6.
   - Redeploy after adding these (Vercel only picks up env vars on a new
     build).
4. **Add your products** at `/admin` (log in with `ADMIN_PASSWORD`).
   For each of the 5 products, you'll need from Hotmart: the product's
   ID (Hotmart product page → it's in the URL/settings) and its
   checkout link. Price, description, and an optional cover photo come
   from you — upload a JPG/PNG in the product form and it's stored in
   Supabase Storage; leave it empty and the catalog shows a colored
   icon instead.
5. **Configure the Hotmart webhook**: in Hotmart, per product (or
   account-wide) → Webhook/Postback settings → set the URL to
   `https://<your-domain>/api/webhooks/hotmart`, and copy the "Hottok"
   value Hotmart shows you into `HOTMART_WEBHOOK_TOKEN`. Make sure the
   `hotmart_product_id` you set in `/admin` for each product matches
   the real Hotmart product ID exactly.
6. **(Recommended) Set up the Hotmart API as a login fallback**: the
   webhook only records purchases made *after* it's configured — if a
   customer's login gets rejected even though they really bought, it's
   usually because their purchase predates the webhook, or a webhook
   delivery didn't arrive. To cover that, in Hotmart go to
   Tools → Developer Tools → Credentials → create a new credential set,
   and set `HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET`, and
   `HOTMART_BASIC_TOKEN` from the values shown there. With these set,
   whenever someone logs in with no local purchase on file, the app asks
   Hotmart's API directly before rejecting them — and if it finds an
   approved purchase, it saves it locally so future logins are instant.
   This needs to be the same Hotmart account/producer that sells the
   products in `/admin`.
7. **Test end to end**: make a real (or Hotmart sandbox) purchase →
   confirm a row appears in `purchases` with `status = approved` →
   go to `/`, enter that email → the matching product should show
   unlocked on the catalog.

Until steps 1–3 are done, the site keeps running on mock data
(`lib/mock-data.ts`) so the current Vercel deployment doesn't break —
`getCatalog()` in `lib/get-catalog.ts` falls back to it automatically
whenever Supabase env vars are missing.

For a product whose content already lives in an app you built
separately, set its **External app URL** in `/admin` instead of adding
content items — the unlocked "Access"/"Open the app" button then just
redirects there. There's no SSO between this app and that one; the
customer logs into that app however it already handles login.

## Internationalization

Routes live under `app/[locale]/`. English (`en`) is the default and has
no URL prefix (`/`, `/products/x`); other locales are prefixed
(`/pt/produtos/x`, `/es/productos/x`) — see `i18n/routing.ts` for the
locale list and localized pathnames, and `messages/*.json` for the UI
copy. Adding a language means adding a locale to `i18n/routing.ts` and a
matching `messages/<locale>.json` file. Product content itself (title,
description) isn't translated — only the UI chrome is.

The `/admin` panel is intentionally not localized (English only,
owner-facing) and lives outside `app/[locale]/`.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
app/[locale]/
  page.tsx                     the gate: login screen if signed out, catalog if signed in
  products/[slug]/page.tsx     product detail + content (requires a session)
  layout.tsx                    locale validation + i18n provider
app/
  layout.tsx                    true root layout: fonts, theme
  admin/                         password-gated admin panel (not localized)
  api/webhooks/hotmart/         Hotmart purchase webhook
  api/track/                     records catalog view/checkout-click events
i18n/                           next-intl routing/navigation/request config
messages/                       en.json (source of truth), pt.json, es.json
components/                     ProductCard, header, locale switcher, theme, etc.
components/admin/                admin panel form + delete button
lib/
  types.ts                      types mirroring the database schema
  site-config.ts                 brand name + header initials — edit this to rebrand
  product-type-colors.ts        the color per product type (badges, covers)
  mock-data.ts                  mock catalog fallback (no Supabase configured)
  get-catalog.ts                real catalog + unlock status from Supabase
  session.ts                    signed cookies for customer + admin sessions
  hotmart.ts                    Hotmart webhook payload/status mapping
  hotmart-api.ts                 live Hotmart Sales API fallback for login
  hotmart-sync.ts                shared purchase-upsert logic (webhook + login fallback)
  track-client.ts                fire-and-forget analytics event helper (browser)
  actions/                      Server Actions (login, logout, admin auth, products)
  supabase/                     Supabase clients (browser, server, admin)
supabase/migrations/            SQL schema (0001 tables, 0002 storage bucket, 0003 analytics)
```
