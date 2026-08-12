import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/** Cliente Supabase para Server Components / Route Handlers, usando a
 * chave anônima — respeita as mesmas policies de RLS do client.ts. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado a partir de um Server Component sem permissão de
            // escrita — ok ignorar, o middleware cuida do refresh.
          }
        },
      },
    },
  );
}
