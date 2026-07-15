import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getCurrentUser } from "@/lib/auth";
import { deleteUser } from "@/lib/users-store";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const current = await getCurrentUser();
  if (current?.id === params.id) {
    return NextResponse.json(
      { error: "No puedes borrar tu propia cuenta" },
      { status: 400 }
    );
  }
  await deleteUser(params.id);
  return NextResponse.json({ ok: true });
}
