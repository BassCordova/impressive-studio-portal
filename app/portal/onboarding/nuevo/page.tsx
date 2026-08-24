"use client";

import { useState } from "react";
import Link from "next/link";

export default function NuevaInvitacionPage() {
  const [empresa, setEmpresa] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ empresa, nombreContacto, email }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al crear la invitación");
      return;
    }

    const data = await res.json();
    setResultUrl(`${window.location.origin}/onb/${data.onboarding.id}`);
  }

  if (resultUrl) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-lg border border-rojo bg-gris-oscuro p-8 text-center">
          <h1 className="font-display text-3xl tracking-wide">¡Invitación creada!</h1>
          <p className="mt-3 text-sm text-gris-suave">
            Comparte este link con tu cliente para que complete el onboarding:
          </p>
          <div className="mt-4 break-all rounded-md bg-negro p-3 text-rojo-hover">
            {resultUrl}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              className="btn-rojo"
              onClick={() => navigator.clipboard.writeText(resultUrl)}
            >
              Copiar link
            </button>
            <Link href="/portal/onboarding" className="rounded-lg border border-gris-medio px-5 py-2.5 text-sm">
              Volver al listado
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <Link href="/portal/onboarding" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
        ← Onboarding
      </Link>
      <h1 className="mt-2 font-display text-4xl tracking-wide">Nueva invitación</h1>
      <div className="mt-2 h-[2px] w-16 bg-rojo" />
      <p className="mt-4 max-w-xl text-sm text-gris-suave">
        Estos datos son opcionales — el cliente puede completarlos o corregirlos él mismo en el
        formulario. Solo sirven para identificar la invitación en el listado.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-4">
        <div className="field">
          <label>Empresa</label>
          <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
        </div>
        <div className="field">
          <label>Nombre de contacto</label>
          <input value={nombreContacto} onChange={(e) => setNombreContacto(e.target.value)} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {error && <p className="text-sm text-rojo-hover">{error}</p>}

        <button type="submit" disabled={loading} className="btn-rojo disabled:opacity-50">
          {loading ? "Creando..." : "Crear invitación"}
        </button>
      </form>
    </main>
  );
}
