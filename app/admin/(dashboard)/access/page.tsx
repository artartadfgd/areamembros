import { GrantAccessForm } from "@/components/admin/grant-access-form";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { mapProductRow } from "@/lib/get-catalog";

export default async function GrantAccessPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-sm text-ink-muted">
        Supabase isn&apos;t configured yet — set{" "}
        <code className="text-ink">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
        <code className="text-ink">SUPABASE_SERVICE_ROLE_KEY</code> as environment
        variables before granting access here.
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: rows } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  const products = (rows ?? []).map(mapProductRow);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink">Grant access</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Mark an email as having bought one or more products, without a real
          Hotmart purchase behind it — for testing, support, or your own account.
        </p>
      </div>
      <GrantAccessForm products={products} />
    </div>
  );
}
