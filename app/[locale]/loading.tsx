export default function CatalogLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-16 border-b border-border" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <div className="h-4 w-32 animate-pulse rounded-md bg-bg-subtle" />
        <div className="mt-4 h-10 w-3/4 max-w-lg animate-pulse rounded-lg bg-bg-subtle" />
        <div className="mt-3 h-5 w-full max-w-md animate-pulse rounded-lg bg-bg-subtle" />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="aspect-[16/10] animate-pulse bg-bg-subtle" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-4/5 animate-pulse rounded bg-bg-subtle" />
                <div className="h-4 w-full animate-pulse rounded bg-bg-subtle" />
                <div className="mt-2 flex items-center justify-between">
                  <div className="h-5 w-16 animate-pulse rounded bg-bg-subtle" />
                  <div className="h-9 w-28 animate-pulse rounded-full bg-bg-subtle" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
