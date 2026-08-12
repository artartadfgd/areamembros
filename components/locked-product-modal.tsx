"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Lock, X } from "lucide-react";
import type { CatalogProduct } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function LockedProductModal({
  product,
  locale,
  onClose,
}: {
  product: CatalogProduct;
  locale: string;
  onClose: () => void;
}) {
  const t = useTranslations("ProductCard");
  const tType = useTranslations("ProductType");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="overlay-scrim absolute inset-0" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="locked-product-title"
        className="relative w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-4 top-4 text-ink-faint transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-bg-subtle">
          <Lock className="h-4 w-4 text-ink-muted" strokeWidth={1.5} />
        </div>

        <span className="mt-4 block font-mono text-xs uppercase tracking-wide text-ink-faint">
          {tType(product.type)}
        </span>
        <h2 id="locked-product-title" className="mt-1 font-display text-xl font-medium text-ink">
          {product.title}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t("modalBody")}</p>
        {product.shortDescription && (
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{product.shortDescription}</p>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="font-mono text-lg font-medium text-ink">
            {formatPrice(product.priceCents, product.currency, locale)}
          </span>
          <a
            href={product.checkoutUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover"
          >
            {t("buyNow")}
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
