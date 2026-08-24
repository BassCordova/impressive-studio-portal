import Link from "next/link";
import { listOnboardings } from "@/lib/onboarding-store";

export const dynamic = "force-dynamic";

const estadoColor: Record<string, string> = {
  pendiente: "bg-gris-medio text-gris-suave",
  en_progreso: "bg-rojo/20 text-rojo-hover border border-rojo",
  completado: "bg-rojo text-blanco",
};

const estadoLabel: Record<string, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completado: "Completado",
};

export default async function OnboardingDashboard() {
  const onboardings = await listOnboardings();

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gris-medio pb-6">
        <div>
          <Link href="/portal" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
            ← Portal
          </Link>
          <h1 className="mt-2 font-display text-4xl tracking-wide">Onboarding de clientes</h1>
        </div>
        <Link href="/portal/onboarding/nuevo" className="btn-rojo">
          + Nueva invitación
        </Link>
      </div>

      <div className="mt-10 overflow-x-auto rounded-lg border border-gris-medio">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="bg-rojo text-blanco">
              <th className="px-4 py-3">Empresa / contacto</th>
              <th className="px-4 py-3">Creado</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Link para el cliente</th>
              <th className="px-4 py-3">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {onboardings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gris-suave">
                  Aún no hay onboardings. Crea una invitación para un cliente nuevo.
                </td>
              </tr>
            )}
            {onboardings.map((o, idx) => (
              <tr key={o.id} className={idx % 2 === 0 ? "bg-negro" : "bg-gris-oscuro"}>
                <td className="px-4 py-3">
                  <div className="font-medium text-blanco">
                    {o.contacto.empresa || "Sin nombre aún"}
                  </div>
                  {o.contacto.nombreContacto && (
                    <div className="text-xs text-gris-suave">{o.contacto.nombreContacto}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-gris-suave">
                  {new Date(o.createdAt).toLocaleDateString("es-CL")}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide ${estadoColor[o.estado]}`}>
                    {estadoLabel[o.estado]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/onb/${o.id}`}
                    target="_blank"
                    className="text-rojo-hover underline underline-offset-2"
                  >
                    Abrir formulario
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/portal/onboarding/${o.id}`}
                    className="text-gris-suave underline underline-offset-2 hover:text-blanco"
                  >
                    Ver respuestas
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
