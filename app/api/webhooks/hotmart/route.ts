import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertHotmartPurchase } from "@/lib/hotmart-sync";
import { mapHotmartStatus, type HotmartWebhookPayload } from "@/lib/hotmart";

/**
 * Receives Hotmart's purchase webhook (Postback). Configure this URL —
 * https://<your-domain>/api/webhooks/hotmart — in Hotmart's product
 * settings, and set HOTMART_WEBHOOK_TOKEN to the "Hottok" Hotmart gives
 * you there so we can tell real requests from forged ones.
 *
 * Approved purchases unlock the matching product for that buyer's
 * email; the match happens by `hotmart_product_id`, so make sure each
 * product in the admin panel has the right Hotmart product ID set.
 */
export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as HotmartWebhookPayload | null;
  if (!payload) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const expectedToken = process.env.HOTMART_WEBHOOK_TOKEN;
  if (!expectedToken || payload.hottok !== expectedToken) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const email = payload.data?.buyer?.email?.trim().toLowerCase();
  const hotmartProductId = payload.data?.product?.id != null ? String(payload.data.product.id) : null;
  const transactionId = payload.data?.purchase?.transaction;
  const priceValue = payload.data?.purchase?.price?.value;

  if (!email || !hotmartProductId || !transactionId) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }

  const status = mapHotmartStatus(payload.event);
  const supabase = createAdminClient();

  await supabase.from("customers").upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  const { error } = await upsertHotmartPurchase(supabase, {
    email,
    hotmartProductId,
    transactionId,
    status,
    priceCents: typeof priceValue === "number" ? Math.round(priceValue * 100) : null,
    rawPayload: payload,
  });

  if (error) {
    console.error("[hotmart webhook] failed to store purchase", error);
    return NextResponse.json({ error: "failed to store purchase" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
