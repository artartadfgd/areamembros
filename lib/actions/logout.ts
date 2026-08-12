"use server";

import { redirect } from "@/i18n/navigation";
import { destroySession } from "@/lib/session";
import type { Locale } from "@/i18n/routing";

export async function logoutAction(locale: Locale) {
  await destroySession();
  return redirect({ href: "/", locale });
}
