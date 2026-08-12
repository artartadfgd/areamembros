import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LoginPage");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-2xl font-medium text-ink">{t("title")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t("description")}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-border-strong"
        >
          {t("back")}
        </Link>
      </main>
    </div>
  );
}
