import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { LoginForm } from "@/components/login-form";
import { getCatalog } from "@/lib/get-catalog";
import { getSession } from "@/lib/session";
import { siteConfig } from "@/lib/site-config";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();

  if (!session) {
    const t = await getTranslations("LoginPage");

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader locale={locale} />
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-5 text-center">
          <h1 className="font-display text-2xl font-medium text-ink">{t("title")}</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t("description")}</p>
          <LoginForm locale={locale} />
        </main>
      </div>
    );
  }

  const t = await getTranslations("Catalog");
  const tFooter = await getTranslations("Footer");

  const products = await getCatalog();
  const unlockedCount = products.filter((p) => p.isUnlocked).length;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink text-balance sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        {products.length > 0 && (
          <div className="mt-10 flex items-center gap-2 text-sm font-medium text-ink-muted">
            <span className="inline-flex h-2 w-2 rounded-full bg-success" />
            {t("unlockedCount", { unlocked: unlockedCount, total: products.length })}
          </div>
        )}

        <div className="mt-8">
          {products.length === 0 ? (
            <EmptyState
              title={t("emptyTitle")}
              description={t("emptyDescription")}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-bg-subtle py-8 text-center text-sm text-ink-faint">
        {siteConfig.name} · {tFooter("tagline")}
      </footer>
    </div>
  );
}
