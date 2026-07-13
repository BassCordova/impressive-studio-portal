import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAuthenticated } from "@/lib/auth";
import { listOnboardings, saveOnboarding } from "@/lib/onboarding-store";
import { emptyOnboarding } from "@/lib/onboarding-types";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const onboardings = await listOnboardings();
  return NextResponse.json({ onboardings });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const id = randomUUID().slice(0, 8);
  const data = emptyOnboarding(id, body.invitadoPor || "Impressive Studio");

  if (body.empresa) data.contacto.empresa = body.empresa;
  if (body.nombreContacto) data.contacto.nombreContacto = body.nombreContacto;
  if (body.email) data.contacto.email = body.email;

  await saveOnboarding(data);

  return NextResponse.json({ onboarding: data });
}
