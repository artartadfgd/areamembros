import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";

export default async function AdminProductsPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  if (!configured) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-sm text-ink-muted">
        Supabase isn&apos;t configured yet — set{" "}
        <code className="font-mono text-ink">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="font-mono text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
        <code className="font-mono text-ink">SUPABASE_SERVICE_ROLE_KEY</code> as environment
        variables before adding products here.
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover"
        >
          Add product
        </Link>
      </div>

      {error && <p className="text-sm text-accent">Failed to load products: {error.message}</p>}

      {products && products.length === 0 && (
        <p className="text-sm text-ink-muted">No products yet — add your first one above.</p>
      )}

      {products && products.length > 0 && (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/admin/products/${product.id}`}
                className="flex items-center justify-between gap-3 bg-surface px-4 py-3.5 transition-colors hover:bg-surface-hover"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{product.title}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink-faint">
                    {product.slug} · {product.type}
                    {!product.is_published && " · unpublished"}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-sm text-ink-muted">
                  {formatPrice(product.price_cents, product.currency)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
