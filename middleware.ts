import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Rutas internas que requieren sesión. Las vistas públicas de cotización
// (/q/*) y de onboarding (/onb/*), y el login, quedan fuera del matcher
// a propósito para que el cliente pueda abrir el link sin loguearse.
export const config = {
  matcher: ["/cotizador/:path*", "/onboarding/:path*", "/agentes/:path*", "/usuarios/:path*"],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
