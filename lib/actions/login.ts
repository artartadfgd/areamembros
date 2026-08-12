"use server";

import { redirect } from "@/i18n/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSession } from "@/lib/session";
import { fetchApprovedHotmartPurchases } from "@/lib/hotmart-api";
import { upsertHotmartPurchase } from "@/lib/hotmart-sync";
import type { Locale } from "@/i18n/routing";

export type LoginState = {
  error: "invalidEmail" | "noPurchase" | "unexpected" | null;
};

export async function loginAction(
  locale: Locale,
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return { error: "invalidEmail" };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[login] Supabase isn't configured yet");
    return { error: "unexpected" };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("purchases")
    .select("id")
    .eq("email", email)
    .eq("status", "approved")
    .limit(1);

  if (error) {
    console.error("[login] failed to check purchases", error);
    return { error: "unexpected" };
  }

  let hasApprovedPurchase = Boolean(data && data.length > 0);

  // No local record — ask Hotmart directly before giving up. Covers
  // purchases made before the webhook was set up, or a delivery it missed.
  if (!hasApprovedPurchase) {
    const liveSales = await fetchApprovedHotmartPurchases(email);
    if (liveSales.length > 0) {
      await supabase.from("customers").upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
      for (const sale of liveSales) {
        await upsertHotmartPurchase(supabase, {
          email,
          hotmartProductId: sale.hotmartProductId,
          transactionId: sale.transactionId,
          status: "approved",
          priceCents: sale.priceCents,
        });
      }
      hasApprovedPurchase = true;
    }
  }

  if (!hasApprovedPurchase) {
    return { error: "noPurchase" };
  }

  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("last_login_at")
    .eq("email", email)
    .maybeSingle();
  const isFirstLogin = !existingCustomer?.last_login_at;

  await supabase
    .from("customers")
    .upsert({ email, last_login_at: new Date().toISOString() }, { onConflict: "email" });

  await createSession(email);
  return redirect({
    href: { pathname: "/", query: isFirstLogin ? { welcome: "1" } : undefined },
    locale,
  });
}
