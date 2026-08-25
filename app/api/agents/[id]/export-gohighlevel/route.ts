import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAgent } from "@/lib/agent-store";

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

  const ghlConfig = {
    name: agent.nombre,
    instructions: agent.systemPrompt,
    model: agent.modelo === "claude-sonnet-5"
      ? "gpt-4"
      : agent.modelo === "claude-opus-4-8"
      ? "gpt-4-turbo"
      : "gpt-3.5-turbo",
    temperature:
      agent.modelo.startsWith("claude-haiku") ? agent.temperatura : undefined,
    maxTokens: 2048,
    metadata: {
      source: "Impressive Studio Portal",
      sourceAgentId: agent.id,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      creadoPor: agent.creadoPor,
    },
  };

  const filename = `gohighlevel-${agent.id}.json`;

  return new NextResponse(JSON.stringify(ghlConfig, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
