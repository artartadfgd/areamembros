"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { loginAction, type LoginState } from "@/lib/actions/login";
import type { Locale } from "@/i18n/routing";

const initialState: LoginState = { error: null };

export function LoginForm({ locale }: { locale: Locale }) {
  const t = useTranslations("LoginPage");
  const [state, formAction, isPending] = useActionState(
    loginAction.bind(null, locale),
    initialState,
  );

  return (
    <form action={formAction} className="mt-6 flex w-full flex-col gap-3">
      <label htmlFor="email" className="sr-only">
        {t("emailLabel")}
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder={t("emailPlaceholder")}
        autoComplete="email"
        className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent"
      />

      {state.error && (
        <p className="text-left text-sm text-accent" role="alert">
          {t(
            state.error === "invalidEmail"
              ? "errorInvalidEmail"
              : state.error === "noPurchase"
                ? "errorNoPurchase"
                : "errorUnexpected",
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {isPending ? t("submitPending") : t("submit")}
      </button>
    </form>
  );
}
