import Link from "next/link";
import { Lock, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { CatalogProduct } from "@/lib/types";
import { PRODUCT_TYPE_LABEL } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductCover } from "./product-cover";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const { isUnlocked } = product;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgb(var(--shadow-color)/0.22)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <ProductCover
          slug={product.slug}
          type={product.type}
          className="flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {PRODUCT_TYPE_LABEL[product.type]}
        </span>

        {isUnlocked ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success-ink">
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
            Liberado
          </span>
        ) : (
          <div className="overlay-scrim absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
            <Lock className="h-6 w-6 text-white" strokeWidth={1.5} />
            <span className="text-xs font-medium text-white/90">Conteúdo bloqueado</span>
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
          <span className="font-display text-base font-medium text-ink">
            {formatPrice(product.priceCents, product.currency)}
          </span>

          {isUnlocked ? (
            <Link
              href={`/produtos/${product.slug}`}
              className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-ink/85"
            >
              Acessar
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          ) : (
            <Link
              href={`/produtos/${product.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover"
            >
              Comprar agora
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
