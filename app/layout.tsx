import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
};

/**
 * True root layout — shared by the localized app under `[locale]/` and
 * the (English-only, not translated) `/admin` panel. Fonts and the
 * theme provider live here so both sides get them without duplicating
 * `<html>`/`<body>`; locale setup (NextIntlClientProvider, metadata)
 * lives one level down in `app/[locale]/layout.tsx`. Light is the
 * default look; dark is available via the header toggle — see
 * app/globals.css for both palettes.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
