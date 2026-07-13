import { cookies } from "next/headers";

export const AUTH_COOKIE = "is_portal_auth";

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  return cookieStore.get(AUTH_COOKIE)?.value === "ok";
}

export function checkPassword(password: string): boolean {
  const expected = process.env.PORTAL_PASSWORD;
  if (!expected) return false;
  return password === expected;
}
