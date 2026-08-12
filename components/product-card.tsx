import { useTranslations, useLocale } from "next-intl";
import { Lock, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { CatalogProduct } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductCover } from "./product-cover";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const { isUnlocked } = product;
  const t = useTranslations("ProductCard");
  const tType = useTranslations("ProductType");
  const locale = useLocale();

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_16px_32px_-16px_rgb(var(--shadow-color)/0.35)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <ProductCover
          type={product.type}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-md bg-black/50 px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-white backdrop-blur-sm">
          {tType(product.type)}
        </span>

        {isUnlocked ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md border border-border-strong bg-surface/90 px-2 py-1 text-xs font-medium text-ink backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" strokeWidth={2} />
            {t("unlocked")}
          </span>
        ) : (
          <div className="overlay-scrim absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
            <Lock className="h-6 w-6 text-white" strokeWidth={1.5} />
            <span className="font-mono text-xs text-white/80">{t("lockedContent")}</span>
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
          <span className="font-mono text-base font-medium text-ink">
            {formatPrice(product.priceCents, product.currency, locale)}
          </span>

          {isUnlocked ? (
            <Link
              href={{ pathname: "/products/[slug]", params: { slug: product.slug } }}
              className="inline-flex items-center gap-1 rounded-md bg-ink px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-ink/85"
            >
              {t("access")}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          ) : (
            <Link
              href={{ pathname: "/products/[slug]", params: { slug: product.slug } }}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover"
            >
              {t("buyNow")}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
