import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import { listAgents, saveAgent } from "@/lib/agent-store";
import { emptyAgent } from "@/lib/agent-types";
import { getOnboarding } from "@/lib/onboarding-store";
import { buildAgentSystemPrompt } from "@/lib/onboarding-types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const agents = await listAgents();
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const user = await getCurrentUser();
  const id = randomUUID().slice(0, 8);
  const agent = emptyAgent(id, user?.name || "Impressive Studio");

  agent.nombre = body.nombre || "Agente sin nombre";
  agent.modelo = body.modelo || agent.modelo;

  if (body.onboardingId) {
    const onboarding = await getOnboarding(body.onboardingId);
    if (onboarding) {
      agent.onboardingId = onboarding.id;
      agent.systemPrompt = buildAgentSystemPrompt(onboarding);
    }
  }
  if (body.systemPrompt) {
    agent.systemPrompt = body.systemPrompt;
  }

  await saveAgent(agent);

  return NextResponse.json({ agent });
}
