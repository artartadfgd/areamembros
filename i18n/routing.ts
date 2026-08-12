import { defineRouting } from "next-intl/routing";

export const locales = ["en", "pt", "es"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // Idioma padrão sem prefixo (/, /products/x); os demais levam prefixo
  // (/pt, /pt/produtos/x, /es, /es/productos/x).
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/login": {
      en: "/login",
      pt: "/entrar",
      es: "/iniciar-sesion",
    },
    "/products/[slug]": {
      en: "/products/[slug]",
      pt: "/produtos/[slug]",
      es: "/productos/[slug]",
    },
  },
});
