import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isAuthenticated } from "@/lib/auth";
import { getAgent } from "@/lib/agent-store";
import type { ChatMessage } from "@/lib/agent-types";
import { CHAT_MAX_TOKENS, modelSupportsTemperature } from "@/lib/agent-types";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Falta ANTHROPIC_API_KEY en las variables de entorno de Vercel. Agrégala en Settings → Environment Variables para poder probar agentes.",
      },
      { status: 501 }
    );
  }

  const agent = await getAgent(params.id);
  if (!agent) {
    return NextResponse.json({ error: "Agente no encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "Falta el mensaje" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await anthropic.messages.create({
      model: agent.modelo,
      max_tokens: CHAT_MAX_TOKENS,
      // Sonnet 5 / Opus 4.8 rechazan `temperature` (400). Solo la enviamos a
      // modelos que la aceptan (Haiku); en el resto se guía por el system prompt.
      ...(modelSupportsTemperature(agent.modelo)
        ? { temperature: agent.temperatura }
        : {}),
      system: agent.systemPrompt || undefined,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ reply: text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Error al llamar a la API de Claude" },
      { status: 502 }
    );
  }
}
