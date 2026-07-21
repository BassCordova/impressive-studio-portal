import { createBlobStore } from "./blob-store";
import type { AgentConfig } from "./agent-types";
import { normalizeAgent } from "./agent-types";

const store = createBlobStore<AgentConfig>("agents/", normalizeAgent);

export const saveAgent = (agent: AgentConfig) => store.save(agent);
export const getAgent = (id: string) => store.get(id);
export const listAgents = () => store.list();
export const deleteAgent = (id: string) => store.delete(id);
