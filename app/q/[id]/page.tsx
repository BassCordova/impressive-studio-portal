import { notFound } from "next/navigation";
import { getQuote } from "@/lib/store";
import { calcularTotal, formatMoney } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function QuotePage({ params }: { params: { id: string } }) {
  const quote = await getQuote(params.id);
  if (!quote) notFound();

  const { subtotal, descuento, total } = calcularTotal(quote);
  const fechaEmision = new Date(quote.createdAt);
  const fechaVencimiento = new Date(fechaEmision);
  fechaVencimiento.setDate(fechaVencimiento.getDate() + quote.validezDias);

  return (
    <main className="min-h-screen px-6 py-14 md:px-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start justify-between border-b border-gris-medio pb-8">
          <div>
            <h1 className="font-display text-3xl tracking-wide">IMPRESSIVE STUDIO</h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-gris-suave">
              Cotización comercial
            </p>
          </div>
          <div className="text-right text-xs text-gris-suave">
            <p>Emitida: {fechaEmision.toLocaleDateString("es-CL")}</p>
            <p>Válida hasta: {fechaVencimiento.toLocaleDateString("es-CL")}</p>
            <p className="mt-1 text-gris-claro">#{quote.id}</p>
          </div>
        </div>

        <div className="mt-8 h-[2px] w-16 bg-rojo" />

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-gris-suave">Para</p>
            <p className="mt-1 text-lg text-blanco">{quote.cliente.nombre}</p>
            {quote.cliente.empresa && (
              <p className="text-sm text-gris-suave">{quote.cliente.empresa}</p>
            )}
            {quote.cliente.email && (
              <p className="text-sm text-gris-suave">{quote.cliente.email}</p>
            )}
          </div>
          <div className="md:text-right">
            <p className="text-xs uppercase tracking-widest text-gris-suave">De</p>
            <p className="mt-1 text-lg text-blanco">{quote.vendedor}</p>
            <p className="text-sm text-gris-suave">Impressive Studio</p>
          </div>
        </section>

        <section className="mt-10">
          <div className="overflow-hidden rounded-lg border border-gris-medio">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-rojo text-blanco">
                  <th className="px-4 py-3">Servicio</th>
                  <th className="px-4 py-3">Cant.</th>
                  <th className="px-4 py-3">Precio unit.</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-negro" : "bg-gris-oscuro"}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.nombre}</div>
                      {item.descripcion && (
                        <div className="text-xs text-gris-suave">{item.descripcion}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">{item.cantidad}</td>
                    <td className="px-4 py-3">{formatMoney(item.precioUnitario, quote.moneda)}</td>
                    <td className="px-4 py-3 text-right">
                      {formatMoney(item.cantidad * item.precioUnitario, quote.moneda)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between text-gris-suave">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal, quote.moneda)}</span>
              </div>
              {quote.descuentoPct ? (
                <div className="flex justify-between text-gris-suave">
                  <span>Descuento ({quote.descuentoPct}%)</span>
                  <span>- {formatMoney(descuento, quote.moneda)}</span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-gris-medio pt-2 font-display text-2xl tracking-wide">
                <span>Total</span>
                <span>{formatMoney(total, quote.moneda)}</span>
              </div>
            </div>
          </div>
        </section>

        {(quote.condicionesPago || quote.notas) && (
          <section className="mt-10 grid gap-6 md:grid-cols-2">
            {quote.condicionesPago && (
              <div className="rounded-lg border border-gris-medio bg-gris-oscuro p-5">
                <p className="text-xs uppercase tracking-widest text-gris-suave">
                  Condiciones de pago
                </p>
                <p className="mt-2 text-sm">{quote.condicionesPago}</p>
              </div>
            )}
            {quote.notas && (
              <div className="rounded-lg border border-gris-medio bg-gris-oscuro p-5">
                <p className="text-xs uppercase tracking-widest text-gris-suave">Notas</p>
                <p className="mt-2 text-sm">{quote.notas}</p>
              </div>
            )}
          </section>
        )}

        <footer className="mt-14 border-t border-gris-medio pt-6 text-center text-xs text-gris-claro">
          Impressive Studio · impressivestudio.cl
        </footer>
      </div>
    </main>
  );
}
