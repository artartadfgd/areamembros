"use client";

import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";

const LOCALE_LABEL: Record<string, string> = {
  en: "EN",
  pt: "PT",
  es: "ES",
};

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const rawParams = useParams();
  // `locale` isn't a route param that the pathnames config expects.
  const params = Object.fromEntries(
    Object.entries(rawParams).filter(([key]) => key !== "locale"),
  );

  return (
    <label className="relative flex items-center">
      <span className="sr-only">{t("label")}</span>
      <Globe
        className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-ink-faint"
        strokeWidth={1.75}
        aria-hidden
      />
      <select
        value={locale}
        onChange={(e) => {
          router.replace(
            // @ts-expect-error -- pathname vem tipado por rota conhecida
            { pathname, params },
            { locale: e.target.value },
          );
        }}
        className="appearance-none rounded-md border border-border bg-transparent py-2 pl-8 pr-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-border-strong hover:text-ink focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="bg-surface text-ink">
            {LOCALE_LABEL[l] ?? l.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
