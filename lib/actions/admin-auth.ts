"use server";

import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession } from "@/lib/session";

export type AdminLoginState = { error: string | null };

export async function adminLoginAction(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return { error: "ADMIN_PASSWORD isn't set on the server yet." };
  }
  if (password !== expected) {
    return { error: "Wrong password." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function adminLogoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
