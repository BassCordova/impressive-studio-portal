import { notFound } from "next/navigation";
import { getOnboarding } from "@/lib/onboarding-store";
import OnboardingWizard from "./OnboardingWizard";

export const dynamic = "force-dynamic";

// Ruta pública a propósito: el cliente accede con este link sin contraseña
// del equipo, igual que /q/[id] para las cotizaciones.
export default async function OnboardingFormPage({ params }: { params: { id: string } }) {
  const onboarding = await getOnboarding(params.id);
  if (!onboarding) notFound();

  return <OnboardingWizard initial={onboarding} />;
}
