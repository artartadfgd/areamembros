import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/session";
import { adminLogoutAction } from "@/lib/actions/admin-auth";
import { siteConfig } from "@/lib/site-config";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <span className="font-display text-sm font-medium text-ink">
              {siteConfig.name} admin
            </span>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Products
              </Link>
              <Link
                href="/admin/access"
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Grant access
              </Link>
            </nav>
          </div>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="font-mono text-xs text-ink-muted transition-colors hover:text-ink"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">{children}</main>
    </div>
  );
}
