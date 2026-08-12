import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/** True once the three Supabase env vars this app needs are set. Check
 *  this before calling createAdminClient() anywhere the app might run
 *  before they're configured (e.g. right after deploying). */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/**
 * Cliente Supabase com a service role key — ignora RLS.
 *
 * Uso exclusivo em código de servidor que precisa ler/escrever
 * `customers` e `purchases`: o webhook da Hotmart e a verificação de
 * login por e-mail. `import "server-only"` garante um erro de build se
 * algum dia isso for importado por engano num componente de cliente.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
