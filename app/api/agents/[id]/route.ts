import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteAgent, getAgent, saveAgent } from "@/lib/agent-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const agent = await getAgent(params.id);
  if (!agent) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json({ agent });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const agent = await getAgent(params.id);
  if (!agent) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  const body = await req.json();
  const updated = {
    ...agent,
    nombre: body.nombre ?? agent.nombre,
    systemPrompt: body.systemPrompt ?? agent.systemPrompt,
    modelo: body.modelo ?? agent.modelo,
    temperatura: body.temperatura ?? agent.temperatura,
    updatedAt: new Date().toISOString(),
  };
  await saveAgent(updated);
  return NextResponse.json({ agent: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  await deleteAgent(params.id);
  return NextResponse.json({ ok: true });
}
