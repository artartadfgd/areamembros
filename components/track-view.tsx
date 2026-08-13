"use client";

import { useEffect } from "react";
import { trackProductEvent } from "@/lib/track-client";

/** Renders nothing — just fires a "view" event once when a product page
 *  or the locked-product popup is opened. */
export function TrackView({ productId }: { productId: string }) {
  useEffect(() => {
    trackProductEvent(productId, "view");
  }, [productId]);

  return null;
}
