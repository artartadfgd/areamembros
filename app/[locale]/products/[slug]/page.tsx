import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, CheckCircle2, FileText, Link as LinkIcon, Lock, PlayCircle } from "lucide-react";
import { Link, redirect } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProductCover } from "@/components/product-cover";
import { TrackView } from "@/components/track-view";
import { TrackedCheckoutLink } from "@/components/tracked-checkout-link";
import { getCatalogProduct } from "@/lib/get-catalog";
import { getSession } from "@/lib/session";
import { formatPrice } from "@/lib/format";
import { PRODUCT_TYPE_COLOR } from "@/lib/product-type-colors";
import type { ContentItem } from "@/lib/types";
import type { Locale } from "@/i18n/routing";

const CONTENT_ICON: Record<ContentItem["type"], typeof PlayCircle> = {
  video: PlayCircle,
  pdf: FileText,
  file: FileText,
  link: LinkIcon,
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session) redirect({ href: "/", locale });

  const t = await getTranslations("ProductPage");
  const tType = await getTranslations("ProductType");

  const product = await getCatalogProduct(slug);

  if (!product) notFound();

  const { isUnlocked } = product;
  const typeColor = PRODUCT_TYPE_COLOR[product.type];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} />
      <TrackView productId={product.id} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <Link href="/" className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">
          ← {t("back")}
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <ProductCover
            type={product.type}
            coverUrl={product.coverUrl}
            className="h-56 w-full sm:h-72"
          />
        </div>

        <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <span
              className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
              style={{ backgroundColor: typeColor.soft, color: typeColor.ink }}
            >
              {tType(product.type)}
            </span>
            <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-ink text-balance sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              {product.description}
            </p>
          </div>

          <div className="flex min-w-[220px] flex-1 flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-none">
            <span className="font-display text-2xl font-semibold tabular-nums text-ink">
              {formatPrice(product.priceCents, product.currency, locale)}
            </span>

            {isUnlocked ? (
              <>
                <div className="flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-sm font-semibold text-success-ink">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                  {t("youHaveAccess")}
                </div>
                {product.externalUrl && (
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-success px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                  >
                    {t("openApp")}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </a>
                )}
              </>
            ) : (
              <>
                <TrackedCheckoutLink
                  productId={product.id}
                  href={product.checkoutUrl ?? "#"}
                  className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
                >
                  {t("buyNow")}
                </TrackedCheckoutLink>
                {product.previewUrl && (
                  <a
                    href={product.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-border-strong"
                  >
                    {t("viewFreeSample")}
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {(!isUnlocked || product.content.length > 0 || !product.externalUrl) && (
          <div className="mt-10 border-t border-border pt-8">
            <h2 className="font-display text-xl font-medium text-ink">{t("contentTitle")}</h2>

            {isUnlocked ? (
              product.content.length > 0 ? (
                <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border">
                  {product.content.map((item, i) => {
                    const Icon = CONTENT_ICON[item.type];
                    return (
                      <li key={i}>
                        <a
                          href={item.url}
                          className="flex items-center gap-3 bg-surface px-4 py-3.5 transition-colors hover:bg-surface-hover"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
                          <span className="flex-1 text-sm font-medium text-ink">{item.title}</span>
                          {item.durationMinutes && (
                            <span className="text-xs tabular-nums text-ink-faint">
                              {t("minutes", { count: item.durationMinutes })}
                            </span>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink-muted">{t("contentEmpty")}</p>
              )
            ) : (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-border p-5 text-sm text-ink-muted">
                <Lock className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                {t("contentLocked")}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
