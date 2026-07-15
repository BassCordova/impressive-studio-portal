import { notFound } from "next/navigation";
import { getAgent } from "@/lib/agent-store";
import AgentDetail from "./AgentDetail";

export const dynamic = "force-dynamic";

export default async function AgentPage({ params }: { params: { id: string } }) {
  const agent = await getAgent(params.id);
  if (!agent) notFound();

  return <AgentDetail initial={agent} apiConfigured={!!process.env.ANTHROPIC_API_KEY} />;
}
