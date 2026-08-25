import Link from "next/link";
import { listAgents } from "@/lib/agent-store";
import UserBar from "@/app/components/UserBar";

export const dynamic = "force-dynamic";

export default async function AgentesPage() {
  const agents = await listAgents();
  const apiConfigured = !!process.env.ANTHROPIC_API_KEY;

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gris-medio pb-6">
        <div>
          <Link href="/portal" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
            ← Portal
          </Link>
          <h1 className="mt-2 font-display text-4xl tracking-wide">Portal de agentes</h1>
        </div>
        <div className="flex items-center gap-4">
          <UserBar />
          <Link href="/portal/agentes/nuevo" className="btn-rojo">
            + Nuevo agente
          </Link>
        </div>
      </div>

      {!apiConfigured && (
        <div className="mt-6 rounded-lg border border-rojo bg-gris-oscuro p-4 text-sm text-gris-suave">
          Falta configurar <code className="text-rojo-hover">ANTHROPIC_API_KEY</code> en Vercel →
          Settings → Environment Variables. Puedes crear y configurar agentes igual, pero el chat de
          prueba quedará deshabilitado hasta que la agregues.
        </div>
      )}

      <div className="mt-10 overflow-x-auto rounded-lg border border-gris-medio">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="bg-rojo text-blanco">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Modelo</th>
              <th className="px-4 py-3">Basado en onboarding</th>
              <th className="px-4 py-3">Creado</th>
              <th className="px-4 py-3">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gris-suave">
                  Aún no hay agentes. Crea el primero.
                </td>
              </tr>
            )}
            {agents.map((a, idx) => (
              <tr key={a.id} className={idx % 2 === 0 ? "bg-negro" : "bg-gris-oscuro"}>
                <td className="px-4 py-3 font-medium text-blanco">{a.nombre}</td>
                <td className="px-4 py-3 text-gris-suave">{a.modelo}</td>
                <td className="px-4 py-3 text-gris-suave">{a.onboardingId ? "Sí" : "—"}</td>
                <td className="px-4 py-3 text-gris-suave">
                  {new Date(a.createdAt).toLocaleDateString("es-CL")}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/portal/agentes/${a.id}`} className="text-rojo-hover underline underline-offset-2">
                    Abrir
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
