import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "cache_session";
const ADMIN_COOKIE = "cache_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days
const ADMIN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Add it to your environment variables.",
    );
  }
  return new TextEncoder().encode(secret);
}

/** Customer session: just the purchase email, nothing else. */
export async function createSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getSession(): Promise<{ email: string } | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    return typeof payload.email === "string" ? { email: payload.email } : null;
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Admin session: just a flag — this is for the site owner, not customers. */
export async function createAdminSession() {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_MAX_AGE_SECONDS}s`)
    .sign(secretKey());

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_MAX_AGE_SECONDS,
  });
}

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function destroyAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}
