"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AGENT_MODELS } from "@/lib/agent-types";
import type { OnboardingData } from "@/lib/onboarding-types";

export default function NuevoAgentePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [modelo, setModelo] = useState<string>(AGENT_MODELS[0].id);
  const [onboardingId, setOnboardingId] = useState("");
  const [onboardings, setOnboardings] = useState<OnboardingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/onboarding")
      .then((res) => res.json())
      .then((data) => setOnboardings(data.onboardings || []))
      .catch(() => setOnboardings([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, modelo, onboardingId }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al crear el agente");
      return;
    }

    const data = await res.json();
    router.push(`/agentes/${data.agent.id}`);
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <Link href="/portal/agentes" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
        ← Portal de agentes
      </Link>
      <h1 className="mt-2 font-display text-4xl tracking-wide">Nuevo agente</h1>
      <div className="mt-2 h-[2px] w-16 bg-rojo" />

      <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-4">
        <div className="field">
          <label>Nombre del agente</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="field">
          <label>Modelo</label>
          <select value={modelo} onChange={(e) => setModelo(e.target.value)}>
            {AGENT_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Basar en onboarding de cliente (opcional)</label>
          <select value={onboardingId} onChange={(e) => setOnboardingId(e.target.value)}>
            <option value="">— Empezar en blanco —</option>
            {onboardings.map((o) => (
              <option key={o.id} value={o.id}>
                {o.contacto.empresa || "Sin nombre"} ({o.estado})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gris-claro">
            Si eliges un cliente, el system prompt se genera automáticamente con su base de
            conocimiento (marca, flujo comercial, FAQs). Lo podrás editar después.
          </p>
        </div>

        {error && <p className="text-sm text-rojo-hover">{error}</p>}

        <button type="submit" disabled={loading} className="btn-rojo disabled:opacity-50">
          {loading ? "Creando..." : "Crear agente"}
        </button>
      </form>
    </main>
  );
}
