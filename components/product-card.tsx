"use client";

import { useState, type KeyboardEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Lock, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { CatalogProduct } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { PRODUCT_TYPE_COLOR } from "@/lib/product-type-colors";
import { cn } from "@/lib/cn";
import { ProductCover } from "./product-cover";
import { LockedProductModal } from "./locked-product-modal";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const { isUnlocked } = product;
  const t = useTranslations("ProductCard");
  const tType = useTranslations("ProductType");
  const locale = useLocale();
  const [isModalOpen, setModalOpen] = useState(false);
  const typeColor = PRODUCT_TYPE_COLOR[product.type];

  const openModal = () => setModalOpen(true);
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal();
    }
  };

  return (
    <>
      <article
        {...(!isUnlocked && {
          role: "button",
          tabIndex: 0,
          onClick: openModal,
          onKeyDown,
        })}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_20px_36px_-18px_rgb(var(--shadow-color)/0.28)]",
          !isUnlocked && "cursor-pointer",
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <ProductCover
            type={product.type}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />

          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: typeColor.soft, color: typeColor.ink }}
          >
            {tType(product.type)}
          </span>

          {isUnlocked ? (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success-ink">
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
              {t("unlocked")}
            </span>
          ) : (
            <div className="overlay-scrim absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
              <Lock className="h-6 w-6 text-white" strokeWidth={1.5} />
              <span className="text-xs font-medium text-white/90">{t("lockedContent")}</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex-1">
            <h3 className="font-display text-lg font-medium leading-snug text-ink text-balance">
              {product.title}
            </h3>
            {product.shortDescription && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                {product.shortDescription}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="font-display text-base font-semibold tabular-nums text-ink">
              {formatPrice(product.priceCents, product.currency, locale)}
            </span>

            {isUnlocked ? (
              <Link
                href={{ pathname: "/products/[slug]", params: { slug: product.slug } }}
                className="inline-flex items-center gap-1 rounded-full bg-success px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
              >
                {t("access")}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-colors group-hover:bg-accent-hover">
                {t("buyNow")}
              </span>
            )}
          </div>
        </div>
      </article>

      {isModalOpen && (
        <LockedProductModal
          product={product}
          locale={locale}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
