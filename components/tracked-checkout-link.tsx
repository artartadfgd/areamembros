"use client";

import type { ReactNode } from "react";
import { trackProductEvent } from "@/lib/track-client";

export function TrackedCheckoutLink({
  productId,
  href,
  className,
  children,
}: {
  productId: string;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackProductEvent(productId, "checkout_click")}
    >
      {children}
    </a>
  );
}
