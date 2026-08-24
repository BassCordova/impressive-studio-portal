import Link from "next/link";
import { listQuotes } from "@/lib/store";
import { calcularTotal, formatMoney } from "@/lib/types";

export const dynamic = "force-dynamic";

const estadoColor: Record<string, string> = {
  enviada: "bg-gris-medio text-gris-suave",
  aceptada: "bg-rojo/20 text-rojo-hover border border-rojo",
  rechazada: "bg-gris-medio text-gris-claro line-through",
};

export default async function CotizadorPage() {
  const quotes = await listQuotes();

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gris-medio pb-6">
        <div>
          <Link href="/portal" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
            ← Portal
          </Link>
          <h1 className="mt-2 font-display text-4xl tracking-wide">Cotizador</h1>
        </div>
        <Link href="/portal/cotizador/nueva" className="btn-rojo">
          + Nueva cotización
        </Link>
      </div>

      <div className="mt-10 overflow-x-auto rounded-lg border border-gris-medio">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="bg-rojo text-blanco">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Link</th>
            </tr>
          </thead>
          <tbody>
            {quotes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gris-suave">
                  Aún no hay cotizaciones. Crea la primera.
                </td>
              </tr>
            )}
            {quotes.map((q, idx) => {
              const { total } = calcularTotal(q);
              return (
                <tr
                  key={q.id}
                  className={idx % 2 === 0 ? "bg-negro" : "bg-gris-oscuro"}
                >
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
                    <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide ${estadoColor[q.estado]}`}>
                      {q.estado}
                    </span>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
