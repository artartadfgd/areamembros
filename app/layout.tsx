import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Space_Grotesk } from "next/font/google";
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

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
};

/**
 * True root layout — shared by the localized app under `[locale]/` and
 * the (English-only, not translated) `/admin` panel. Fonts and the
 * theme provider live here so both sides get them without duplicating
 * `<html>`/`<body>`; locale setup (NextIntlClientProvider, metadata)
 * lives one level down in `app/[locale]/layout.tsx`.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
