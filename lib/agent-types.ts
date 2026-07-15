export const AGENT_MODELS = [
  { id: "claude-sonnet-5", label: "Claude Sonnet 5 (recomendado)" },
  { id: "claude-opus-4-8", label: "Claude Opus 4.8 (más capaz, más lento)" },
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 (rápido y económico)" },
] as const;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AgentConfig = {
  id: string;
  createdAt: string;
  updatedAt: string;
  nombre: string;
  onboardingId: string;
  systemPrompt: string;
  modelo: string;
  temperatura: number;
  creadoPor: string;
};

export function emptyAgent(id: string, creadoPor: string): AgentConfig {
  const now = new Date().toISOString();
  return {
    id,
    createdAt: now,
    updatedAt: now,
    nombre: "",
    onboardingId: "",
    systemPrompt: "",
    modelo: AGENT_MODELS[0].id,
    temperatura: 0.7,
    creadoPor,
  };
}
