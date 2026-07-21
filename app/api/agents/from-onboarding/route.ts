import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAuthenticated } from "@/lib/auth";
import { saveAgent } from "@/lib/agent-store";
import { getOnboarding } from "@/lib/onboarding-store";
import { buildAgentSystemPrompt } from "@/lib/onboarding-types";
import { emptyAgent } from "@/lib/agent-types";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json() as { onboardingId: string; nombre?: string };

  if (!body.onboardingId) {
    return NextResponse.json(
      { error: "Se requiere onboardingId" },
      { status: 400 }
    );
  }

  const onboarding = await getOnboarding(body.onboardingId);
  if (!onboarding) {
    return NextResponse.json(
      { error: "Onboarding no encontrado" },
      { status: 404 }
    );
  }

  const agentId = randomUUID().slice(0, 12);
  const agent = emptyAgent(agentId, onboarding.invitadoPor);

  agent.onboardingId = body.onboardingId;
  agent.nombre = body.nombre || `Agente - ${onboarding.contacto.empresa}`;
  agent.systemPrompt = buildAgentSystemPrompt(onboarding);

  await saveAgent(agent);

  return NextResponse.json({ agent }, { status: 201 });
}
