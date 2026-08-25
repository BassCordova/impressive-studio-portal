import { notFound } from "next/navigation";
import { getOnboarding, saveOnboarding } from "@/lib/onboarding-store";
import OnboardingEditor from "./OnboardingEditor";

export const dynamic = "force-dynamic";

export default async function OnboardingDetailPage({ params }: { params: { id: string } }) {
  const o = await getOnboarding(params.id);
  if (!o) notFound();

  if (o.estado === "completado" && !o.vistoPorEquipo) {
    o.vistoPorEquipo = true;
    await saveOnboarding(o);
  }

  return <OnboardingEditor initial={o} />;
}
