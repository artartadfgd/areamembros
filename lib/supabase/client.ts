import { createBrowserClient } from "@supabase/ssr";

/** Cliente Supabase para uso em componentes client-side. Só enxerga o
 * que a policy de RLS libera para a chave anônima (ex.: produtos
 * publicados). Nunca use este cliente para ler `purchases`. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
