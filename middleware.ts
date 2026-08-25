import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Rutas internas que requieren sesión. Las vistas públicas de cotización
// (/q/*) y de onboarding (/onb/*), y el login, quedan fuera del matcher
// a propósito para que el cliente pueda abrir el link sin loguearse. El
// índice /portal tampoco requiere sesión (solo lista las herramientas).
export const config = {
  matcher: [
    "/portal/cotizador/:path*",
    "/portal/onboarding/:path*",
    "/portal/agentes/:path*",
    "/portal/usuarios/:path*",
  ],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL("/portal/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
