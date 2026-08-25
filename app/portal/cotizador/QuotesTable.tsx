"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Quote, QuoteStatus } from "@/lib/types";
import { calcularTotal, formatMoney } from "@/lib/types";

const estadoColor: Record<string, string> = {
  enviada: "bg-gris-medio text-gris-suave",
  aceptada: "bg-rojo/20 text-rojo-hover border border-rojo",
  rechazada: "bg-gris-medio text-gris-claro line-through",
};

export default function QuotesTable({ quotes }: { quotes: Quote[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateEstado(id: string, estado: QuoteStatus) {
    setBusyId(id);
    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Borrar esta cotización? No se puede deshacer.")) return;
    setBusyId(id);
    await fetch(`/api/quotes/${id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  return (
    <table className="w-full min-w-[820px] text-left text-sm">
      <thead>
        <tr className="bg-rojo text-blanco">
          <th className="px-4 py-3">Cliente</th>
          <th className="px-4 py-3">Fecha</th>
          <th className="px-4 py-3">Total</th>
          <th className="px-4 py-3">Estado</th>
          <th className="px-4 py-3">Link</th>
          <th className="px-4 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {quotes.length === 0 && (
          <tr>
            <td colSpan={6} className="px-4 py-8 text-center text-gris-suave">
              Aún no hay cotizaciones. Crea la primera.
            </td>
          </tr>
        )}
        {quotes.map((q, idx) => {
          const { total } = calcularTotal(q);
          const busy = busyId === q.id;
          return (
            <tr key={q.id} className={idx % 2 === 0 ? "bg-negro" : "bg-gris-oscuro"}>
              <td className="px-4 py-3">
                <div className="font-medium text-blanco">{q.cliente.nombre}</div>
                {q.cliente.empresa && (
                  <div className="text-xs text-gris-suave">{q.cliente.empresa}</div>
                )}
              </td>
              <td className="px-4 py-3 text-gris-suave">
                {new Date(q.createdAt).toLocaleDateString("es-CL")}
              </td>
              <td className="px-4 py-3 font-display text-lg tracking-wide">
                {formatMoney(total, q.moneda)}
              </td>
              <td className="px-4 py-3">
                <select
                  value={q.estado}
                  disabled={busy}
                  onChange={(e) => updateEstado(q.id, e.target.value as QuoteStatus)}
                  className={`rounded-full border-0 px-3 py-1 text-xs uppercase tracking-wide outline-none ${estadoColor[q.estado]}`}
                >
                  <option value="enviada">Enviada</option>
                  <option value="aceptada">Aceptada</option>
                  <option value="rechazada">Rechazada</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/q/${q.id}`}
                  target="_blank"
                  className="text-rojo-hover underline underline-offset-2"
                >
                  Ver / compartir
                </Link>
              </td>
              <td className="px-4 py-3">
                <button
                  disabled={busy}
                  onClick={() => handleDelete(q.id)}
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
