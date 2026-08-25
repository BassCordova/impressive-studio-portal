export const AGENT_MODELS = [
  { id: "claude-sonnet-5", label: "Claude Sonnet 5 (recomendado)" },
  { id: "claude-opus-4-8", label: "Claude Opus 4.8 (más capaz, más lento)" },
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 (rápido y económico)" },
] as const;

// En Sonnet 5 y Opus 4.8 el parámetro `temperature` fue eliminado de la API y
// devuelve 400. Solo los modelos Haiku 4.x/anteriores lo aceptan. Usamos esto
// para no mandar temperature a modelos que la rechazan.
export function modelSupportsTemperature(modelo: string): boolean {
  return modelo.startsWith("claude-haiku");
}

export const CHAT_MAX_TOKENS = 2048;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type PromptVersion = {
  prompt: string;
  savedAt: string;
  savedBy: string;
};

export const MAX_PROMPT_VERSIONS = 15;

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
  promptVersions: PromptVersion[];
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
    promptVersions: [],
  };
}

/** Rellena campos nuevos en agentes guardados con un esquema previo. */
export function normalizeAgent(raw: any): AgentConfig {
  return {
    ...emptyAgent(raw?.id ?? "", raw?.creadoPor ?? "Impressive Studio"),
    ...raw,
    promptVersions: Array.isArray(raw?.promptVersions) ? raw.promptVersions : [],
  };
}
