import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PurchaseStatus } from "./types";

/** Upserts one purchase row, matching it to our internal product via
 *  `hotmart_product_id`. Shared by the webhook (Hotmart pushes it to us)
 *  and the login fallback (we pull it from Hotmart's API) so both paths
 *  write purchases the same way. */
export async function upsertHotmartPurchase(
  supabase: SupabaseClient,
  params: {
    email: string;
    hotmartProductId: string;
    transactionId: string;
    status: PurchaseStatus;
    priceCents: number | null;
    rawPayload?: unknown;
  },
) {
  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("hotmart_product_id", params.hotmartProductId)
    .maybeSingle();

  return supabase.from("purchases").upsert(
    {
      email: params.email,
      product_id: product?.id ?? null,
      hotmart_product_id: params.hotmartProductId,
      hotmart_transaction_id: params.transactionId,
      status: params.status,
      price_paid_cents: params.priceCents,
      raw_payload: params.rawPayload ?? null,
    },
    { onConflict: "hotmart_transaction_id" },
  );
}
