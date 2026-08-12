import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-2xl font-medium text-ink">
          Login por e-mail — em breve
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Nesta etapa você vai digitar o e-mail usado na compra na Hotmart
          e, se ele tiver uma compra aprovada, entrar direto — sem senha e
          sem cadastro. Essa parte ainda está sendo construída.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-border-strong"
        >
          Voltar ao acervo
        </Link>
      </main>
    </div>
  );
}
