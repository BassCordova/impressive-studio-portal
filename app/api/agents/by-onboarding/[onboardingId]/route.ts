import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listAgents } from "@/lib/agent-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { onboardingId: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const allAgents = await listAgents();
  const agents = allAgents.filter((a) => a.onboardingId === params.onboardingId);

  return NextResponse.json({ agents });
}
