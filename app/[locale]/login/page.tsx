import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";
import { LoginForm } from "@/components/login-form";
import type { Locale } from "@/i18n/routing";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LoginPage");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} />
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-2xl font-medium text-ink">{t("title")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t("description")}</p>

        <LoginForm locale={locale} />

        <Link
          href="/"
          className="mt-6 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          ← {t("back")}
        </Link>
      </main>
    </div>
  );
}
