import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import { siteConfig } from "@/lib/site-config";

export async function SiteHeader() {
  const t = await getTranslations("Nav");

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent font-mono text-xs font-bold text-accent-ink">
            {siteConfig.name.charAt(0)}
          </span>
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden rounded-md border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-border-strong sm:inline-flex"
          >
            {t("login")}
          </Link>
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
