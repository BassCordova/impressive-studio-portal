"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { OnboardingData } from "@/lib/onboarding-types";

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

export default function OnboardingTable({ onboardings }: { onboardings: OnboardingData[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("¿Borrar esta invitación y todas sus respuestas? No se puede deshacer.")) return;
    setBusyId(id);
    await fetch(`/api/onboarding/${id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  return (
    <table className="w-full min-w-[820px] text-left text-sm">
      <thead>
        <tr className="bg-rojo text-blanco">
          <th className="px-4 py-3">Empresa / contacto</th>
          <th className="px-4 py-3">Creado</th>
          <th className="px-4 py-3">Estado</th>
          <th className="px-4 py-3">Link para el cliente</th>
          <th className="px-4 py-3">Detalle</th>
          <th className="px-4 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {onboardings.length === 0 && (
          <tr>
            <td colSpan={6} className="px-4 py-8 text-center text-gris-suave">
              Aún no hay onboardings. Crea una invitación para un cliente nuevo.
            </td>
          </tr>
        )}
        {onboardings.map((o, idx) => {
          const esNuevo = o.estado === "completado" && !o.vistoPorEquipo;
          return (
            <tr key={o.id} className={idx % 2 === 0 ? "bg-negro" : "bg-gris-oscuro"}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blanco">
                    {o.contacto.empresa || "Sin nombre aún"}
                  </span>
                  {esNuevo && (
                    <span className="rounded-full bg-rojo px-2 py-0.5 text-[10px] uppercase tracking-widest text-blanco">
                      Nuevo
                    </span>
                  )}
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
                  href={`/onboarding/${o.id}`}
                  className="text-gris-suave underline underline-offset-2 hover:text-blanco"
                >
                  Ver / editar
                </Link>
              </td>
              <td className="px-4 py-3">
                <button
                  disabled={busyId === o.id}
                  onClick={() => handleDelete(o.id)}
                  className="text-xs text-gris-claro hover:text-rojo-hover disabled:opacity-40"
                >
                  Borrar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
