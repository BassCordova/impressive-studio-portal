import { NextRequest, NextResponse } from "next/server";
import { createUser, listUsers } from "@/lib/users-store";

export async function GET() {
  const existing = await listUsers();
  return NextResponse.json({ hasUsers: existing.length > 0 });
}

// Solo funciona una vez: crea el primer usuario admin cuando todavía no
// existe ningún usuario. Después de eso siempre devuelve 403, así que no
// hay riesgo de que alguien cree cuentas nuevas por esta vía.
export async function POST(req: NextRequest) {
  const existing = await listUsers();
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Ya existen usuarios. El bootstrap solo funciona una vez." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { email, name, password } = body;

  if (!email || !name || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Falta email, nombre, o la contraseña tiene menos de 8 caracteres" },
      { status: 400 }
    );
  }

  const user = await createUser({ email, name, password, role: "admin" });

  return NextResponse.json({ ok: true, email: user.email });
}
