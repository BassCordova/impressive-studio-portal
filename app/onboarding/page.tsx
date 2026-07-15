import Link from "next/link";
import { listOnboardings } from "@/lib/onboarding-store";
import UserBar from "@/app/components/UserBar";
import OnboardingTable from "./OnboardingTable";

export const dynamic = "force-dynamic";

export default async function OnboardingDashboard() {
  const onboardings = await listOnboardings();

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gris-medio pb-6">
        <div>
          <Link href="/" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
            ← Portal
          </Link>
          <h1 className="mt-2 font-display text-4xl tracking-wide">Onboarding de clientes</h1>
        </div>
        <div className="flex items-center gap-4">
          <UserBar />
          <Link href="/onboarding/nuevo" className="btn-rojo">
            + Nueva invitación
          </Link>
        </div>
      </div>

      <div className="mt-10 overflow-x-auto rounded-lg border border-gris-medio">
        <OnboardingTable onboardings={onboardings} />
      </div>
    </main>
  );
}
