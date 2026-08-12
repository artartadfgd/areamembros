import "server-only";
import { createAdminClient, isSupabaseConfigured } from "./supabase/admin";
import { getSession } from "./session";
import { mockCatalog } from "./mock-data";
import type { CatalogProduct, Product } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw Supabase row, shape guaranteed by the migration
export function mapProductRow(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    coverUrl: row.cover_url,
    priceCents: row.price_cents,
    currency: row.currency,
    type: row.type,
    hotmartProductId: row.hotmart_product_id,
    checkoutUrl: row.checkout_url,
    previewUrl: row.preview_url,
    externalUrl: row.external_url,
    content: row.content ?? [],
    isPublished: row.is_published,
    sortOrder: row.sort_order,
  };
}

/**
 * The real catalog: published products from Supabase, combined with
 * whether the current session's email has an approved purchase for
 * each one. Falls back to the mock catalog when Supabase isn't
 * configured yet, so the deployed app keeps working while you wire up
 * real credentials.
 */
export async function getCatalog(): Promise<CatalogProduct[]> {
  if (!isSupabaseConfigured()) {
    return mockCatalog;
  }

  const supabase = createAdminClient();
  const { data: rows, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !rows) {
    console.error("[get-catalog] failed to load products", error);
    return mockCatalog;
  }

  const session = await getSession();
  const unlockedProductIds = new Set<string>();
  const unlockedHotmartIds = new Set<string>();

  if (session) {
    const { data: purchases } = await supabase
      .from("purchases")
      .select("product_id, hotmart_product_id")
      .eq("email", session.email)
      .eq("status", "approved");

    for (const purchase of purchases ?? []) {
      if (purchase.product_id) unlockedProductIds.add(purchase.product_id);
      if (purchase.hotmart_product_id) unlockedHotmartIds.add(purchase.hotmart_product_id);
    }
  }

  const catalog = rows.map((row) => {
    const product = mapProductRow(row);
    const isUnlocked =
      unlockedProductIds.has(product.id) ||
      (product.hotmartProductId != null &&
        unlockedHotmartIds.has(product.hotmartProductId));
    return { ...product, isUnlocked };
  });

  // Owned products first, so a customer immediately sees what they
  // bought — locked ones still follow in their normal catalog order.
  return catalog.sort((a, b) => Number(b.isUnlocked) - Number(a.isUnlocked));
}

export async function getCatalogProduct(slug: string): Promise<CatalogProduct | null> {
  const catalog = await getCatalog();
  return catalog.find((product) => product.slug === slug) ?? null;
}

/**
 * Picks one product to offer a customer right after their first login:
 * prefers a locked product that shares a type with something they
 * already own (similar/complementary), falling back to the next
 * locked product in catalog order. Returns null once everything is
 * unlocked — nothing left to offer.
 */
export function getRecommendedProduct(catalog: CatalogProduct[]): CatalogProduct | null {
  const owned = catalog.filter((p) => p.isUnlocked);
  const locked = catalog.filter((p) => !p.isUnlocked);

  if (locked.length === 0) return null;

  const ownedTypes = new Set(owned.map((p) => p.type));
  return locked.find((p) => ownedTypes.has(p.type)) ?? locked[0];
}
