import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "./lib/auth";

// Rutas internas que requieren password. Las vistas públicas de cotización (/q/*)
// y de onboarding (/onb/*) quedan fuera para que el cliente pueda abrir el link
// sin loguearse. El índice /portal tampoco requiere login (solo lista las
// herramientas); cada herramienta sí lo exige al entrar.
export const config = {
  matcher: ["/portal/cotizador/:path*", "/portal/onboarding/:path*", "/portal/agentes/:path*"],
};

export function middleware(req: NextRequest) {
  const authed = req.cookies.get(AUTH_COOKIE)?.value === "ok";
  if (!authed) {
    const loginUrl = new URL("/portal/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
