"use client";

import { deleteProductAction } from "@/lib/actions/products";

export function DeleteProductButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProductAction.bind(null, id)}
      onSubmit={(event) => {
        if (!confirm("Delete this product? This can't be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="font-mono text-xs text-ink-muted transition-colors hover:text-accent"
      >
        Delete
      </button>
    </form>
  );
}
