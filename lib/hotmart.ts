import type { PurchaseStatus } from "./types";

const EVENT_STATUS: Record<string, PurchaseStatus> = {
  PURCHASE_APPROVED: "approved",
  PURCHASE_COMPLETE: "approved",
  PURCHASE_CANCELED: "canceled",
  PURCHASE_REFUNDED: "refunded",
  PURCHASE_CHARGEBACK: "chargeback",
  PURCHASE_PROTEST: "chargeback",
  PURCHASE_EXPIRED: "expired",
  PURCHASE_DELAYED: "expired",
};

/** Maps a Hotmart webhook `event` name to our internal purchase status.
 *  Unknown events default to "approved" rather than silently dropping
 *  the purchase — better to unlock and review later than to lose a sale. */
export function mapHotmartStatus(event: string | undefined): PurchaseStatus {
  if (!event) return "approved";
  return EVENT_STATUS[event] ?? "approved";
}

/** Shape of the fields we actually read from Hotmart's webhook payload.
 *  Hotmart sends more fields than this; we only type what we use. */
export type HotmartWebhookPayload = {
  event?: string;
  hottok?: string;
  data?: {
    product?: { id?: number | string };
    buyer?: { email?: string };
    purchase?: {
      transaction?: string;
      price?: { value?: number };
    };
  };
};
