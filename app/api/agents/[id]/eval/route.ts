import { NextRequest, NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { isAuthenticated } from "@/lib/auth";
import { getAgent } from "@/lib/agent-store";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type EvalScenario = {
  name: string;
  userMessage: string;
  expectedBehaviors: string[];
};

export type EvalResult = {
  scenario: string;
  response: string;
  score: number;
  feedback: string;
  passedCriteria: string[];
  failedCriteria: string[];
};

export async function POST(
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API no configurada" },
      { status: 500 }
    );
  }

  const body = await req.json() as { scenarios: EvalScenario[] };
  if (!Array.isArray(body.scenarios)) {
    return NextResponse.json(
      { error: "Se requiere array de scenarios" },
      { status: 400 }
    );
  }

  const results: EvalResult[] = [];

  for (const scenario of body.scenarios) {
    try {
      const agentResponse = await client.messages.create({
        model: agent.modelo,
        max_tokens: 1024,
        system: agent.systemPrompt,
        messages: [{ role: "user", content: scenario.userMessage }],
      });

      const responseText =
        agentResponse.content[0]?.type === "text"
          ? agentResponse.content[0].text
          : "";

      const evalPrompt = `
Evalúa la siguiente respuesta de un agente de ventas/soporte en base a los comportamientos esperados.

Comportamientos esperados:
${scenario.expectedBehaviors.map((b) => `- ${b}`).join("\n")}

Respuesta del agente:
"${responseText}"

Responde en formato JSON con:
{
  "score": <número 0-100>,
  "passedCriteria": [lista de criterios que cumplió],
  "failedCriteria": [lista de criterios que no cumplió],
  "feedback": "Una evaluación breve de la calidad de la respuesta"
}
`;

      const evalResponse = await client.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 512,
        messages: [{ role: "user", content: evalPrompt }],
      });

      const evalText =
        evalResponse.content[0]?.type === "text"
          ? evalResponse.content[0].text
          : "{}";

      const parsed = JSON.parse(evalText.replace(/```json\n?|\n?```/g, ""));

      results.push({
        scenario: scenario.name,
        response: responseText,
        score: parsed.score || 0,
        feedback: parsed.feedback || "",
        passedCriteria: parsed.passedCriteria || [],
        failedCriteria: parsed.failedCriteria || [],
      });
    } catch (error) {
      results.push({
        scenario: scenario.name,
        response: "",
        score: 0,
        feedback: error instanceof Error ? error.message : "Error desconocido",
        passedCriteria: [],
        failedCriteria: [],
      });
    }
  }

  const overallScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0;

  return NextResponse.json({
    agentId: agent.id,
    results,
    overallScore,
  });
}
