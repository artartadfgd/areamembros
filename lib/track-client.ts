/** Fire-and-forget event tracking from client components. Uses
 *  sendBeacon so it survives the browser navigating away right after
 *  (e.g. clicking a checkout link that opens a new tab). */
export function trackProductEvent(productId: string, eventType: "view" | "checkout_click") {
  const body = JSON.stringify({ productId, eventType });

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    return;
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
