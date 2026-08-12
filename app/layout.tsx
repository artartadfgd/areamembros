import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
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
 * the (English-only, not translated) `/admin` panel. Fonts live here so
 * both sides get them without duplicating `<html>`/`<body>`; locale
 * setup (NextIntlClientProvider, metadata) lives one level down in
 * `app/[locale]/layout.tsx`. The look is fixed (no dark mode) —
 * see app/globals.css for the palette.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={`${spaceGrotesk.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
