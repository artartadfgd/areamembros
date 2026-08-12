import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/entrar"
            className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-border-strong sm:inline-flex"
          >
            Já comprei, entrar
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
