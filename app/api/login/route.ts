import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, checkPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password, next } = await req.json();

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, next: next || "/cotizador" });
  res.cookies.set(AUTH_COOKIE, "ok", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
