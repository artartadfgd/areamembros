import { getTranslations } from "next-intl/server";
import { LogOut } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { siteConfig } from "@/lib/site-config";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/actions/logout";
import type { Locale } from "@/i18n/routing";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations("Nav");
  const session = await getSession();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-ink">
            {siteConfig.name.charAt(0)}
          </span>
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {session ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="max-w-[14rem] truncate text-sm text-ink-muted">
                {t("loggedInAs", { email: session.email })}
              </span>
              <form action={logoutAction.bind(null, locale)}>
                <button
                  type="submit"
                  aria-label={t("logOut")}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
                >
                  <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </form>
            </div>
          ) : null}
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
