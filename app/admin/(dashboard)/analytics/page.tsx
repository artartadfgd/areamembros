import { Eye, MousePointerClick } from "lucide-react";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

type ProductRow = { id: string; title: string };
type EventCountRow = { product_id: string | null; event_type: "view" | "checkout_click"; event_count: number };
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw Supabase row with an embedded relation
type RecentEventRow = any;

export default async function AdminAnalyticsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-sm text-ink-muted">
        Supabase isn&apos;t configured yet — set{" "}
        <code className="text-ink">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
        <code className="text-ink">SUPABASE_SERVICE_ROLE_KEY</code> as environment
        variables before analytics can be tracked.
      </div>
    );
  }

  const supabase = createAdminClient();

  const [{ data: products }, { data: counts }, { data: recentEvents }] = await Promise.all([
    supabase.from("products").select("id, title").order("sort_order", { ascending: true }),
    supabase.from("product_event_counts").select("*"),
    supabase
      .from("product_events")
      .select("id, event_type, email, created_at, products(title)")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const statsByProduct = new Map<string, { views: number; clicks: number }>();
  for (const row of (counts ?? []) as EventCountRow[]) {
    if (!row.product_id) continue;
    const entry = statsByProduct.get(row.product_id) ?? { views: 0, clicks: 0 };
    if (row.event_type === "view") entry.views = row.event_count;
    if (row.event_type === "checkout_click") entry.clicks = row.event_count;
    statsByProduct.set(row.product_id, entry);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink">Analytics</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Who&apos;s looking at what, and who clicked &quot;Buy now&quot; — fills in as
          customers browse the catalog.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-subtle text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3 text-right">Views</th>
              <th className="px-4 py-3 text-right">Checkout clicks</th>
              <th className="px-4 py-3 text-right">Click rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {((products ?? []) as ProductRow[]).map((product) => {
              const stats = statsByProduct.get(product.id) ?? { views: 0, clicks: 0 };
              const rate = stats.views > 0 ? Math.round((stats.clicks / stats.views) * 100) : null;
              return (
                <tr key={product.id}>
                  <td className="px-4 py-3 font-medium text-ink">{product.title}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink-muted">{stats.views}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink-muted">{stats.clicks}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink-muted">
                    {rate === null ? "—" : `${rate}%`}
                  </td>
                </tr>
              );
            })}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-ink-muted">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="font-display text-lg font-medium text-ink">Recent activity</h2>
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {((recentEvents ?? []) as RecentEventRow[]).map((event) => (
            <li key={event.id} className="flex items-center gap-3 bg-surface px-4 py-3 text-sm">
              {event.event_type === "checkout_click" ? (
                <MousePointerClick className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
              ) : (
                <Eye className="h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.75} />
              )}
              <span className="min-w-0 flex-1 truncate text-ink">
                <span className="font-medium">{event.email ?? "—"}</span>{" "}
                {event.event_type === "checkout_click" ? "clicked Buy now on" : "viewed"}{" "}
                <span className="font-medium">{event.products?.title ?? "a deleted product"}</span>
              </span>
              <span className="shrink-0 text-xs tabular-nums text-ink-faint">
                {new Date(event.created_at).toLocaleString()}
              </span>
            </li>
          ))}
          {(!recentEvents || recentEvents.length === 0) && (
            <li className="bg-surface px-4 py-6 text-center text-sm text-ink-muted">
              No activity yet — this fills in as customers browse the catalog.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
