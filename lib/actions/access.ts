"use server";

import { randomUUID } from "crypto";
import { isAdmin } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";

export type GrantAccessState = {
  error: string | null;
  success: string | null;
};

/** Manually marks an email as having "purchased" one or more products —
 *  used to comp access (testing, support, an email that's yours) without
 *  a real Hotmart transaction behind it. */
export async function grantAccessAction(
  _prevState: GrantAccessState,
  formData: FormData,
): Promise<GrantAccessState> {
  if (!(await isAdmin())) {
    return { error: "Not authorized.", success: null };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address.", success: null };
  }

  const supabase = createAdminClient();
  const grantAll = formData.get("allProducts") === "on";

  let productIds = formData.getAll("productIds").map(String).filter(Boolean);

  if (grantAll) {
    const { data, error } = await supabase.from("products").select("id");
    if (error) return { error: error.message, success: null };
    productIds = (data ?? []).map((p) => p.id);
  }

  if (productIds.length === 0) {
    return { error: "Select at least one product (or check “Grant every product”).", success: null };
  }

  const { error: customerError } = await supabase
    .from("customers")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  if (customerError) {
    return { error: customerError.message, success: null };
  }

  const rows = productIds.map((productId) => ({
    email,
    product_id: productId,
    hotmart_transaction_id: `manual-grant-${randomUUID()}`,
    status: "approved" as const,
  }));

  const { error: purchaseError } = await supabase.from("purchases").insert(rows);

  if (purchaseError) {
    return { error: purchaseError.message, success: null };
  }

  return {
    error: null,
    success: `Granted ${email} access to ${productIds.length} product${productIds.length === 1 ? "" : "s"}.`,
  };
}
