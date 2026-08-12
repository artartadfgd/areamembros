import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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
