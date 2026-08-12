"use client";

import { useActionState } from "react";
import { adminLoginAction, type AdminLoginState } from "@/lib/actions/admin-auth";

const initialState: AdminLoginState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(adminLoginAction, initialState);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <form action={formAction} className="flex w-full max-w-xs flex-col gap-3">
        <h1 className="font-display text-xl font-medium text-ink">Admin</h1>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoFocus
          className="rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-accent"
        />
        {state.error && (
          <p className="text-sm text-accent" role="alert">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
