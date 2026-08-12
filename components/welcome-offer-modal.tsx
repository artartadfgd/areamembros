"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Sparkles, X } from "lucide-react";
import type { CatalogProduct } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { PRODUCT_TYPE_COLOR } from "@/lib/product-type-colors";

/** Self-contained: renders itself open and just disappears when
 * dismissed. The parent only decides *whether* to mount it (there's no
 * click to open it from — it shows up on its own after a first login). */
export function WelcomeOfferModal({
  product,
  locale,
}: {
  product: CatalogProduct;
  locale: string;
}) {
  const [open, setOpen] = useState(true);
  const t = useTranslations("WelcomeOffer");
  const tType = useTranslations("ProductType");
  const typeColor = PRODUCT_TYPE_COLOR[product.type];
  const onClose = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="overlay-scrim absolute inset-0" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-offer-title"
        className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-4 top-4 text-ink-faint transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft">
          <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.5} />
        </div>

        <span className="mt-4 block text-xs font-bold uppercase tracking-wide text-accent">
          {t("badge")}
        </span>

        <span
          className="mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
          style={{ backgroundColor: typeColor.soft, color: typeColor.ink }}
        >
          {tType(product.type)}
        </span>
        <h2 id="welcome-offer-title" className="mt-2 font-display text-xl font-medium text-ink">
          {product.title}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t("body")}</p>
        {product.shortDescription && (
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{product.shortDescription}</p>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="font-display text-lg font-semibold tabular-nums text-ink">
            {formatPrice(product.priceCents, product.currency, locale)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {t("dismiss")}
            </button>
            <a
              href={product.checkoutUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
            >
              {t("buyNow")}
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
