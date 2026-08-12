"use client";

import { useActionState } from "react";
import { grantAccessAction, type GrantAccessState } from "@/lib/actions/access";
import type { Product } from "@/lib/types";

const initialState: GrantAccessState = { error: null, success: null };

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-accent";

export function GrantAccessForm({ products }: { products: Product[] }) {
  const [state, formAction, isPending] = useActionState(grantAccessAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="someone@example.com"
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="allProducts" className="h-4 w-4 accent-accent" />
        Grant every product (current and — if you add more later, run this again)
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Or pick specific products</span>
        <div className="flex flex-col gap-2 rounded-md border border-border p-3">
          {products.length === 0 && (
            <p className="text-sm text-ink-muted">No products yet — add one first.</p>
          )}
          {products.map((product) => (
            <label key={product.id} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="productIds"
                value={product.id}
                className="h-4 w-4 accent-accent"
              />
              {product.title}
            </label>
          ))}
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-accent" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm text-success" role="status">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-fit items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {isPending ? "Granting…" : "Grant access"}
      </button>
    </form>
  );
}
