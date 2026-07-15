import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteOnboarding, getOnboarding, saveOnboarding } from "@/lib/onboarding-store";
import { mergeOnboarding } from "@/lib/onboarding-types";

// GET y PATCH son públicos a propósito: el cliente completa el formulario
// desde /onb/[id] sin necesitar la contraseña del equipo.

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const onboarding = await getOnboarding(params.id);
  if (!onboarding) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json({ onboarding });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const onboarding = await getOnboarding(params.id);
  if (!onboarding) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  const body = await req.json();
  const updated = mergeOnboarding(onboarding, body);
  await saveOnboarding(updated);
  return NextResponse.json({ onboarding: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  await deleteOnboarding(params.id);
  return NextResponse.json({ ok: true });
}
