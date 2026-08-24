"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ItemForm = {
  nombre: string;
  descripcion: string;
  cantidad: string;
  precioUnitario: string;
};

const emptyItem = (): ItemForm => ({
  nombre: "",
  descripcion: "",
  cantidad: "1",
  precioUnitario: "",
});

export default function NuevaCotizacionPage() {
  const router = useRouter();
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteEmpresa, setClienteEmpresa] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [moneda, setMoneda] = useState<"CLP" | "USD">("CLP");
  const [items, setItems] = useState<ItemForm[]>([emptyItem()]);
  const [descuentoPct, setDescuentoPct] = useState("0");
  const [validezDias, setValidezDias] = useState("15");
  const [condicionesPago, setCondicionesPago] = useState("50% al iniciar, 50% contra entrega");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState("");

  function updateItem(idx: number, patch: Partial<ItemForm>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente: {
          nombre: clienteNombre,
          empresa: clienteEmpresa,
          email: clienteEmail,
        },
        moneda,
        items,
        descuentoPct,
        validezDias,
        condicionesPago,
        notas,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al crear la cotización");
      return;
    }

    const data = await res.json();
    setResultUrl(`${window.location.origin}/q/${data.quote.id}`);
  }

  if (resultUrl) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-lg border border-rojo bg-gris-oscuro p-8 text-center">
          <h1 className="font-display text-3xl tracking-wide">¡Cotización creada!</h1>
          <p className="mt-3 text-sm text-gris-suave">
            Comparte este link con tu cliente:
          </p>
          <div className="mt-4 break-all rounded-md bg-negro p-3 text-rojo-hover">
            {resultUrl}
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <button
              className="btn-rojo"
              onClick={() => navigator.clipboard.writeText(resultUrl)}
            >
              Copiar link
            </button>
            <Link href="/portal/cotizador" className="rounded-lg border border-gris-medio px-5 py-2.5 text-sm">
              Volver al listado
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <Link href="/portal/cotizador" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
        ← Cotizador
      </Link>
      <h1 className="mt-2 font-display text-4xl tracking-wide">Nueva cotización</h1>
      <div className="mt-2 h-[2px] w-16 bg-rojo" />

      <form onSubmit={handleSubmit} className="mt-10 max-w-3xl space-y-10">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="field">
            <label>Nombre cliente</label>
            <input required value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} />
          </div>
          <div className="field">
            <label>Empresa</label>
            <input value={clienteEmpresa} onChange={(e) => setClienteEmpresa(e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={clienteEmail} onChange={(e) => setClienteEmail(e.target.value)} />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl tracking-wide">Servicios</h2>
            <button type="button" onClick={addItem} className="text-sm text-rojo-hover underline">
              + Agregar item
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-gris-medio bg-gris-oscuro p-4">
                <div className="grid gap-3 md:grid-cols-[2fr_3fr_1fr_1fr_auto]">
                  <div className="field">
                    <label>Servicio</label>
                    <input
                      required
                      value={item.nombre}
                      onChange={(e) => updateItem(idx, { nombre: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Descripción</label>
                    <input
                      value={item.descripcion}
                      onChange={(e) => updateItem(idx, { descripcion: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Cantidad</label>
                    <input
                      type="number"
                      min={1}
                      value={item.cantidad}
                      onChange={(e) => updateItem(idx, { cantidad: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Precio unit.</label>
                    <input
                      type="number"
                      min={0}
                      value={item.precioUnitario}
                      onChange={(e) => updateItem(idx, { precioUnitario: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-xs text-gris-claro hover:text-rojo-hover"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="field">
            <label>Moneda</label>
            <select value={moneda} onChange={(e) => setMoneda(e.target.value as "CLP" | "USD")}>
              <option value="CLP">CLP</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="field">
            <label>Descuento (%)</label>
            <input type="number" min={0} max={100} value={descuentoPct} onChange={(e) => setDescuentoPct(e.target.value)} />
          </div>
          <div className="field">
            <label>Validez (días)</label>
            <input type="number" min={1} value={validezDias} onChange={(e) => setValidezDias(e.target.value)} />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="field">
            <label>Condiciones de pago</label>
            <input value={condicionesPago} onChange={(e) => setCondicionesPago(e.target.value)} />
          </div>
          <div className="field">
            <label>Notas</label>
            <textarea rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} />
          </div>
        </section>

        {error && <p className="text-sm text-rojo-hover">{error}</p>}

        <button type="submit" disabled={loading} className="btn-rojo disabled:opacity-50">
          {loading ? "Creando..." : "Crear cotización"}
        </button>
      </form>
    </main>
  );
}
