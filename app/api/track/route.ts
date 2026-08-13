import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { getSession } from "@/lib/session";

const EVENT_TYPES = new Set(["view", "checkout_click"]);

/**
 * Records a catalog interaction (product viewed, "Buy now" clicked) for
 * the /admin/analytics dashboard. The email always comes from the
 * server-side session, never from the request body, so a customer can't
 * spoof events under someone else's email.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const productId = body?.productId;
  const eventType = body?.eventType;

  if (typeof productId !== "string" || !productId || !EVENT_TYPES.has(eventType)) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("product_events").insert({
    product_id: productId,
    email: session.email,
    event_type: eventType,
  });

  if (error) {
    // Most likely productId doesn't match a real product (FK violation) —
    // not worth failing the request over, the button click still worked.
    console.error("[track] failed to record event", error);
  }

  return NextResponse.json({ ok: true });
}
