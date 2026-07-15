import { put, list, del, get } from "@vercel/blob";
import type { AgentConfig } from "./agent-types";

const PREFIX = "agents/";

export async function saveAgent(agent: AgentConfig) {
  await put(`${PREFIX}${agent.id}.json`, JSON.stringify(agent, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return agent;
}

export async function getAgent(id: string): Promise<AgentConfig | null> {
  const result = await get(`${PREFIX}${id}.json`, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as AgentConfig;
}

export async function listAgents(): Promise<AgentConfig[]> {
  const { blobs } = await list({ prefix: PREFIX });
  const agents = await Promise.all(
    blobs.map(async (b) => {
      const result = await get(b.pathname, { access: "private", useCache: false });
      if (!result || result.statusCode !== 200) return null;
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as AgentConfig;
    })
  );
  return agents
    .filter((a): a is AgentConfig => a !== null)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function deleteAgent(id: string) {
  await del(`${PREFIX}${id}.json`);
}
