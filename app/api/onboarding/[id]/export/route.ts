import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getOnboarding } from "@/lib/onboarding-store";
import { toMarkdown } from "@/lib/onboarding-types";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const onboarding = await getOnboarding(params.id);
  if (!onboarding) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const markdown = toMarkdown(onboarding);
  const empresa = onboarding.contacto.empresa || "cliente";
  const filename = `onboarding-${empresa.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${onboarding.id}.md`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
