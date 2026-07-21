"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { OnboardingData, FAQItem, AccesoItem } from "@/lib/onboarding-types";
import { steps } from "@/lib/onboarding-form-config";

export default function OnboardingEditor({ initial }: { initial: OnboardingData }) {
  const router = useRouter();
  const [data, setData] = useState<OnboardingData>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [creatingAgent, setCreatingAgent] = useState(false);

  function updateField(section: string, key: string, value: string) {
    setSaved(false);
    setData((prev) => ({
      ...prev,
      [section]: { ...(prev as any)[section], [key]: value },
    }));
  }

  function updateFaq(idx: number, patch: Partial<FAQItem>) {
    setSaved(false);
    setData((prev) => ({
      ...prev,
      flujoComercial: {
        ...prev.flujoComercial,
        faqs: prev.flujoComercial.faqs.map((f, i) => (i === idx ? { ...f, ...patch } : f)),
      },
    }));
  }

  function addFaq() {
    setData((prev) => ({
      ...prev,
      flujoComercial: { ...prev.flujoComercial, faqs: [...prev.flujoComercial.faqs, { pregunta: "", respuesta: "" }] },
    }));
  }

  function removeFaq(idx: number) {
    setData((prev) => ({
      ...prev,
      flujoComercial: { ...prev.flujoComercial, faqs: prev.flujoComercial.faqs.filter((_, i) => i !== idx) },
    }));
  }

  function updateAcceso(idx: number, patch: Partial<AccesoItem>) {
    setSaved(false);
    setData((prev) => ({
      ...prev,
      accesos: {
        ...prev.accesos,
        plataformas: prev.accesos.plataformas.map((a, i) => (i === idx ? { ...a, ...patch } : a)),
      },
    }));
  }

  function addAcceso() {
    setData((prev) => ({
      ...prev,
      accesos: { ...prev.accesos, plataformas: [...prev.accesos.plataformas, { plataforma: "", comoCompartir: "", notas: "" }] },
    }));
  }

  function removeAcceso(idx: number) {
    setData((prev) => ({
      ...prev,
      accesos: { ...prev.accesos, plataformas: prev.accesos.plataformas.filter((_, i) => i !== idx) },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/onboarding/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
    } catch {
      setError("No se pudo guardar. Revisa tu conexión.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateAgent() {
    setCreatingAgent(true);
    try {
      const res = await fetch("/api/agents/from-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          onboardingId: data.id,
          nombre: `Agente - ${data.contacto.empresa}`,
        }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      router.push(`/agentes/${result.agent.id}`);
    } catch {
      setError("No se pudo crear el agente. Revisa tu conexión.");
    } finally {
      setCreatingAgent(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gris-medio pb-6">
        <div>
          <Link href="/onboarding" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
            ← Onboarding
          </Link>
          <h1 className="mt-2 font-display text-4xl tracking-wide">
            {data.contacto.empresa || "Cliente sin nombre"}
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-gris-suave">
            Estado: {data.estado} · ID {data.id}
          </p>
        </div>
        <div className="flex gap-3">
          <a href={`/api/onboarding/${data.id}/export`} className="rounded-lg border border-gris-medio px-5 py-2.5 text-sm">
            .md
          </a>
          <a href={`/api/onboarding/${data.id}/manual-de-marca`} className="rounded-lg border border-gris-medio px-5 py-2.5 text-sm">
            Manual (HTML)
          </a>
          <a href={`/onb/${data.id}`} target="_blank" className="rounded-lg border border-gris-medio px-5 py-2.5 text-sm">
            Formulario
          </a>
          {data.estado === "completado" && (
            <button
              onClick={handleCreateAgent}
              disabled={creatingAgent || saving}
              className="btn-rojo disabled:opacity-50"
            >
              {creatingAgent ? "Creando..." : "+ Crear agente"}
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="btn-rojo disabled:opacity-50">
            {saving ? "Guardando..." : saved ? "Guardado ✓" : "Guardar"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rojo-hover">{error}</p>}

      <div className="mt-10 space-y-10">
        {steps.map((step) => (
          <section key={step.section} className="rounded-lg border border-gris-medio bg-gris-oscuro p-6">
            <h2 className="font-display text-2xl tracking-wide">{step.title}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {step.fields.map((f) => (
                <div key={f.key} className={`field ${f.type === "textarea" ? "md:col-span-2" : ""}`}>
                  <label>{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={(data as any)[step.section][f.key]}
                      onChange={(e) => updateField(step.section, f.key, e.target.value)}
                    />
                  ) : (
                    <input
                      value={(data as any)[step.section][f.key]}
                      onChange={(e) => updateField(step.section, f.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            {step.section === "flujoComercial" && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-gris-suave">Preguntas frecuentes</p>
                  <button type="button" onClick={addFaq} className="text-sm text-rojo-hover underline">
                    + Agregar
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {data.flujoComercial.faqs.map((f, idx) => (
                    <div key={idx} className="rounded-lg border border-gris-medio bg-negro p-4">
                      <div className="field">
                        <label>Pregunta</label>
                        <input value={f.pregunta} onChange={(e) => updateFaq(idx, { pregunta: e.target.value })} />
                      </div>
                      <div className="field mt-3">
                        <label>Respuesta</label>
                        <textarea rows={2} value={f.respuesta} onChange={(e) => updateFaq(idx, { respuesta: e.target.value })} />
                      </div>
                      {data.flujoComercial.faqs.length > 1 && (
                        <button type="button" onClick={() => removeFaq(idx)} className="mt-2 text-xs text-gris-claro hover:text-rojo-hover">
                          Quitar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.section === "accesos" && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-gris-suave">Plataformas a las que se necesita acceso</p>
                  <button type="button" onClick={addAcceso} className="text-sm text-rojo-hover underline">
                    + Agregar
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {data.accesos.plataformas.map((a, idx) => (
                    <div key={idx} className="rounded-lg border border-gris-medio bg-negro p-4">
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="field">
                          <label>Plataforma</label>
                          <input value={a.plataforma} onChange={(e) => updateAcceso(idx, { plataforma: e.target.value })} />
                        </div>
                        <div className="field">
                          <label>Cómo compartir</label>
                          <input value={a.comoCompartir} onChange={(e) => updateAcceso(idx, { comoCompartir: e.target.value })} />
                        </div>
                        <div className="field">
                          <label>Notas</label>
                          <input value={a.notas} onChange={(e) => updateAcceso(idx, { notas: e.target.value })} />
                        </div>
                      </div>
                      {data.accesos.plataformas.length > 1 && (
                        <button type="button" onClick={() => removeAcceso(idx)} className="mt-2 text-xs text-gris-claro hover:text-rojo-hover">
                          Quitar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.section === "adjuntos" && (
              <div className="mt-6 field">
                <label>Notas finales</label>
                <textarea
                  rows={4}
                  value={data.notasFinales}
                  onChange={(e) => {
                    setSaved(false);
                    setData((prev) => ({ ...prev, notasFinales: e.target.value }));
                  }}
                />
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-rojo disabled:opacity-50">
          {saving ? "Guardando..." : saved ? "Guardado ✓" : "Guardar cambios"}
        </button>
      </div>
    </main>
  );
}
