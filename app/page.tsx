import { SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { mockCatalog } from "@/lib/mock-data";
import { siteConfig } from "@/lib/site-config";

export default function CatalogPage() {
  // TODO(auth): quando o login por e-mail existir, buscar o catálogo real
  // do Supabase já combinado com as compras aprovadas deste e-mail.
  const products = mockCatalog;
  const unlockedCount = products.filter((p) => p.isUnlocked).length;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
            {siteConfig.tagline}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink text-balance sm:text-5xl">
            Todo o seu acervo, em um só lugar.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
            Os produtos que você já comprou estão liberados abaixo. Os
            demais continuam visíveis — compre quando quiser, sem sair da
            sua conta.
          </p>
        </div>

        {products.length > 0 && (
          <div className="mt-10 flex items-center gap-2 text-sm text-ink-muted">
            <span className="inline-flex h-2 w-2 rounded-full bg-success" />
            {unlockedCount} de {products.length} produtos liberados para você
          </div>
        )}

        <div className="mt-8">
          {products.length === 0 ? (
            <EmptyState
              title="Nenhum produto disponível ainda"
              description="Assim que novos produtos forem publicados, eles aparecem aqui automaticamente."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-ink-faint">
        {siteConfig.name} · área de membros
      </footer>
    </div>
  );
}
