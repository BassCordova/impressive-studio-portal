import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "./lib/auth";

// Rutas internas que requieren password. Las vistas públicas de cotización (/q/*)
// y el login quedan fuera para que el cliente pueda abrir el link sin loguearse.
export const config = {
  matcher: ["/cotizador/:path*", "/onboarding/:path*", "/agentes/:path*"],
};

export function middleware(req: NextRequest) {
  const authed = req.cookies.get(AUTH_COOKIE)?.value === "ok";
  if (!authed) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
