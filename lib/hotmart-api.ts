import "server-only";

/**
 * Live fallback for the login check, using Hotmart's Sales API instead of
 * waiting for a webhook. Covers two cases the webhook alone can't:
 *  - purchases made before the webhook was configured
 *  - a webhook delivery that never arrived (wrong URL, downtime, etc.)
 *
 * Requires an "Application" created under Hotmart → Tools → Developer
 * Tools → Credentials, which gives you HOTMART_CLIENT_ID,
 * HOTMART_CLIENT_SECRET and HOTMART_BASIC_TOKEN. If those aren't set,
 * every function here is a no-op — the local `purchases` table (fed by
 * the webhook) remains the only source of truth.
 */

const TOKEN_URL = "https://api-sec-vlc.hotmart.com/security/oauth/token";
const SALES_HISTORY_URL = "https://developers.hotmart.com/payments/api/v1/sales/history";

type HotmartTokenResponse = {
  access_token?: string;
};

type HotmartSaleItem = {
  product?: { id?: number | string };
  purchase?: {
    transaction?: string;
    price?: { value?: number };
  };
};

type HotmartSalesHistoryResponse = {
  items?: HotmartSaleItem[];
};

export function isHotmartApiConfigured() {
  return Boolean(
    process.env.HOTMART_CLIENT_ID &&
      process.env.HOTMART_CLIENT_SECRET &&
      process.env.HOTMART_BASIC_TOKEN,
  );
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.HOTMART_CLIENT_ID;
  const clientSecret = process.env.HOTMART_CLIENT_SECRET;
  const basicToken = process.env.HOTMART_BASIC_TOKEN;
  if (!clientId || !clientSecret || !basicToken) return null;

  const url = new URL(TOKEN_URL);
  url.searchParams.set("grant_type", "client_credentials");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("client_secret", clientSecret);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: basicToken.startsWith("Basic") ? basicToken : `Basic ${basicToken}`,
    },
  });

  if (!response.ok) {
    console.error("[hotmart api] failed to get access token", response.status, await response.text());
    return null;
  }

  const data = (await response.json()) as HotmartTokenResponse;
  return data.access_token ?? null;
}

export type LiveHotmartSale = {
  hotmartProductId: string;
  transactionId: string;
  priceCents: number | null;
};

/** Approved purchases Hotmart has on file for this email right now. */
export async function fetchApprovedHotmartPurchases(email: string): Promise<LiveHotmartSale[]> {
  if (!isHotmartApiConfigured()) return [];

  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  const url = new URL(SALES_HISTORY_URL);
  url.searchParams.set("buyer_email", email);
  url.searchParams.set("transaction_status", "APPROVED");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error("[hotmart api] sales history request failed", response.status, await response.text());
    return [];
  }

  const data = (await response.json()) as HotmartSalesHistoryResponse;
  return (data.items ?? [])
    .filter((item) => item.product?.id != null && item.purchase?.transaction)
    .map((item) => ({
      hotmartProductId: String(item.product!.id),
      transactionId: item.purchase!.transaction!,
      priceCents:
        typeof item.purchase?.price?.value === "number"
          ? Math.round(item.purchase.price.value * 100)
          : null,
    }));
}
