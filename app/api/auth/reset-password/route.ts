import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getUserByEmail, updatePassword } from "@/lib/users-store";

// Reset de contraseña protegido por un secreto de administración separado
// (ADMIN_RESET_SECRET), no por la clave de ningún usuario. Pensado para uso
// manual por quien administra el deploy en Vercel cuando alguien pierde su
// clave y no hay ningún otro admin con sesión activa para recrearla.
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_RESET_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_RESET_SECRET no está configurado en el entorno" },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { email, newPassword, resetSecret } = body;

  if (!email || !newPassword || !resetSecret) {
    return NextResponse.json(
      { error: "Falta email, newPassword, o resetSecret" },
      { status: 400 }
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 8 caracteres" },
      { status: 400 }
    );
  }
  if (!secretMatches(resetSecret, expected)) {
    return NextResponse.json({ error: "Secreto inválido" }, { status: 401 });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "No existe un usuario con ese email" }, { status: 404 });
  }

  await updatePassword(user.id, newPassword);
  return NextResponse.json({ ok: true, email: user.email });
}
