import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getCurrentUser } from "@/lib/auth";
import { createUser, listUsers, toSafeUser } from "@/lib/users-store";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const users = await listUsers();
  return NextResponse.json({ users: users.map(toSafeUser) });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { email, name, password, role } = body;

  if (!email || !name || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Falta email, nombre, o la contraseña tiene menos de 8 caracteres" },
      { status: 400 }
    );
  }

  try {
    const user = await createUser({
      email,
      name,
      password,
      role: role === "admin" ? "admin" : "vendedor",
    });
    return NextResponse.json({ user: toSafeUser(user) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error al crear usuario" }, { status: 400 });
  }
}
