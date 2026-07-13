"use client";

import { useState } from "react";
import type { OnboardingData, FAQItem, AccesoItem } from "@/lib/onboarding-types";

type SectionKey =
  | "contacto"
  | "negocio"
  | "publico"
  | "objetivos"
  | "identidadMarca"
  | "flujoComercial"
  | "baseConocimientoAgente"
  | "accesos"
  | "adjuntos";

type FieldDef = { key: string; label: string; type: "text" | "textarea"; placeholder?: string };

type StepConfig = {
  section: SectionKey;
  title: string;
  intro: string;
  fields: FieldDef[];
};

const steps: StepConfig[] = [
  {
    section: "contacto",
    title: "Datos de contacto",
    intro: "Para saber a quién contactar y cómo.",
    fields: [
      { key: "empresa", label: "Nombre de la empresa", type: "text" },
      { key: "nombreContacto", label: "Nombre del contacto principal", type: "text" },
      { key: "cargo", label: "Cargo del contacto", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "telefono", label: "Teléfono / WhatsApp", type: "text" },
      { key: "sitioWeb", label: "Sitio web", type: "text" },
      { key: "instagram", label: "Instagram", type: "text" },
      { key: "otrasRedes", label: "Otras redes sociales", type: "text" },
    ],
  },
  {
    section: "negocio",
    title: "El negocio",
    intro: "Cuéntanos a qué se dedica la empresa.",
    fields: [
      { key: "rubro", label: "Rubro / industria", type: "text" },
      { key: "descripcionNegocio", label: "Descripción del negocio", type: "textarea" },
      { key: "aniosOperando", label: "Años operando", type: "text" },
      { key: "ubicacion", label: "Ubicación", type: "text" },
      { key: "productosServicios", label: "Productos / servicios que ofrecen", type: "textarea" },
      { key: "diferenciadorCompetitivo", label: "¿Qué los diferencia de la competencia?", type: "textarea" },
      { key: "principalesCompetidores", label: "Principales competidores", type: "text" },
    ],
  },
  {
    section: "publico",
    title: "Público objetivo",
    intro: "A quién le hablamos.",
    fields: [
      { key: "publicoObjetivo", label: "Describe a tu cliente ideal", type: "textarea" },
      { key: "rangoEdad", label: "Rango de edad", type: "text" },
      { key: "ubicacionGeografica", label: "Ubicación geográfica del público", type: "text" },
      { key: "problemasQueResuelve", label: "¿Qué problema le resuelve tu marca?", type: "textarea" },
      { key: "dondeEncuentraClientes", label: "¿Dónde encuentras clientes hoy?", type: "textarea" },
    ],
  },
  {
    section: "objetivos",
    title: "Objetivos del proyecto",
    intro: "Qué queremos lograr juntos.",
    fields: [
      { key: "objetivoPrincipalProyecto", label: "Objetivo principal de este proyecto", type: "textarea" },
      { key: "kpisImportantes", label: "KPIs / métricas que más te importan", type: "textarea" },
      { key: "resultadosEsperados90dias", label: "Resultados esperados en 90 días", type: "textarea" },
      { key: "presupuestoMensualAprox", label: "Presupuesto mensual aproximado", type: "text" },
      { key: "plazoLanzamiento", label: "Plazo de lanzamiento deseado", type: "text" },
    ],
  },
  {
    section: "identidadMarca",
    title: "Identidad de marca",
    intro: "La base para el manual de marca.",
    fields: [
      { key: "mision", label: "Misión", type: "textarea" },
      { key: "vision", label: "Visión", type: "textarea" },
      { key: "valores", label: "Valores de la marca", type: "textarea" },
      { key: "personalidadMarca", label: "Personalidad de marca (adjetivos)", type: "text" },
      { key: "tonoDeVoz", label: "Tono de voz (formal, cercano, divertido...)", type: "textarea" },
      { key: "queSiDiceLaMarca", label: "Qué SÍ dice / representa la marca", type: "textarea" },
      { key: "queNoDiceLaMarca", label: "Qué NO dice / evita la marca", type: "textarea" },
      { key: "coloresMarca", label: "Colores de marca (hex si los tienes)", type: "text" },
      { key: "tipografiaMarca", label: "Tipografía de marca", type: "text" },
      { key: "logoLink", label: "Link al logo (Drive, etc.)", type: "text" },
      { key: "manualMarcaLink", label: "Link a manual de marca existente (si hay)", type: "text" },
      { key: "referentesInspiracion", label: "Marcas / referentes de inspiración", type: "text" },
      { key: "palabrasProhibidas", label: "Palabras o temas prohibidos", type: "textarea" },
    ],
  },
  {
    section: "flujoComercial",
    title: "Flujo comercial",
    intro: "Cómo venden hoy, para que el agente lo replique.",
    fields: [
      { key: "comoLleganLeads", label: "¿Cómo llegan los leads hoy?", type: "textarea" },
      { key: "canalesAtencion", label: "Canales de atención (WhatsApp, IG, mail...)", type: "text" },
      { key: "procesoVentaPasoAPaso", label: "Proceso de venta, paso a paso", type: "textarea" },
      { key: "tiempoRespuestaEsperado", label: "Tiempo de respuesta esperado", type: "text" },
      { key: "objecionesComunes", label: "Objeciones comunes de clientes", type: "textarea" },
      { key: "politicaPrecios", label: "Política de precios", type: "textarea" },
      { key: "politicaGarantiasDevoluciones", label: "Política de garantías / devoluciones", type: "textarea" },
      { key: "metodosDePago", label: "Métodos de pago aceptados", type: "text" },
      { key: "tiemposEntrega", label: "Tiempos de entrega", type: "text" },
      { key: "procesoPostVenta", label: "Proceso post-venta", type: "textarea" },
    ],
  },
  {
    section: "baseConocimientoAgente",
    title: "Base de conocimiento para el agente",
    intro: "Lo que el agente de IA debe (y no debe) saber.",
    fields: [
      { key: "informacionQueDebeSaber", label: "Información clave que el agente debe saber", type: "textarea" },
      { key: "informacionQueNoDebeCompartir", label: "Información que NUNCA debe compartir", type: "textarea" },
      { key: "cuandoEscalarAHumano", label: "¿Cuándo debe derivar a un humano?", type: "textarea" },
      { key: "contactoEscalamiento", label: "Contacto para escalamiento", type: "text" },
      { key: "ejemplosConversacionesIdeales", label: "Ejemplos de respuestas o conversaciones ideales", type: "textarea" },
      { key: "restriccionesLegales", label: "Restricciones legales o regulatorias del rubro", type: "textarea" },
    ],
  },
  {
    section: "accesos",
    title: "Accesos y credenciales",
    intro: "Qué plataformas necesitamos y cómo nos las compartirás.",
    fields: [{ key: "notasAccesos", label: "Notas generales sobre accesos", type: "textarea" }],
  },
  {
    section: "adjuntos",
    title: "Adjuntos y notas finales",
    intro: "Últimos detalles antes de enviar.",
    fields: [
      { key: "brandGuidelineLink", label: "Link a manual/brand guideline", type: "text" },
      { key: "logosLink", label: "Link a logos", type: "text" },
      { key: "fotosLink", label: "Link a fotos / material visual", type: "text" },
      { key: "otrosLinks", label: "Otros links relevantes", type: "text" },
    ],
  },
];

export default function OnboardingWizard({ initial }: { initial: OnboardingData }) {
  const [data, setData] = useState<OnboardingData>(initial);
  const [step, setStep] = useState(initial.pasoActual || 0);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(initial.estado === "completado");
  const [error, setError] = useState("");

  const totalSteps = steps.length + 1; // + notas finales / FAQs se incluyen en pasos existentes
  const isLastStep = step === steps.length - 1;
  const current = steps[step];

  function updateField(section: SectionKey, key: string, value: string) {
    setData((prev) => ({
      ...prev,
      [section]: { ...(prev as any)[section], [key]: value },
    }));
  }

  function updateFaq(idx: number, patch: Partial<FAQItem>) {
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
      flujoComercial: {
        ...prev.flujoComercial,
        faqs: [...prev.flujoComercial.faqs, { pregunta: "", respuesta: "" }],
      },
    }));
  }

  function removeFaq(idx: number) {
    setData((prev) => ({
      ...prev,
      flujoComercial: {
        ...prev.flujoComercial,
        faqs: prev.flujoComercial.faqs.filter((_, i) => i !== idx),
      },
    }));
  }

  function updateAcceso(idx: number, patch: Partial<AccesoItem>) {
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
      accesos: {
        ...prev.accesos,
        plataformas: [...prev.accesos.plataformas, { plataforma: "", comoCompartir: "", notas: "" }],
      },
    }));
  }

  function removeAcceso(idx: number) {
    setData((prev) => ({
      ...prev,
      accesos: {
        ...prev.accesos,
        plataformas: prev.accesos.plataformas.filter((_, i) => i !== idx),
      },
    }));
  }

  async function persist(patch: Partial<OnboardingData>) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/onboarding/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
    } catch {
      setError("No se pudo guardar automáticamente. Revisa tu conexión.");
    } finally {
      setSaving(false);
    }
  }

  async function handleNext() {
    const nextStep = Math.min(step + 1, steps.length - 1);
    const patch: Partial<OnboardingData> = {
      [current.section]: (data as any)[current.section],
      estado: "en_progreso",
      pasoActual: nextStep,
    };
    await persist(patch);
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    const patch: Partial<OnboardingData> = {
      adjuntos: data.adjuntos,
      notasFinales: data.notasFinales,
      estado: "completado",
      pasoActual: steps.length,
    };
    await persist(patch);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-lg border border-rojo bg-gris-oscuro p-8 text-center">
          <h1 className="font-display text-3xl tracking-wide">¡Gracias!</h1>
          <p className="mt-3 text-sm text-gris-suave">
            Recibimos toda tu información. Nuestro equipo la usará para construir tus agentes y
            preparar tu manual de marca.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl tracking-wide">IMPRESSIVE STUDIO</h1>
        <p className="mt-1 text-xs uppercase tracking-widest text-gris-suave">
          Onboarding de cliente
        </p>
        <div className="mt-2 h-[2px] w-16 bg-rojo" />

        <div className="mt-6 flex items-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-rojo" : "bg-gris-medio"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-gris-suave">
          Paso {step + 1} de {steps.length}
        </p>

        <div className="mt-8">
          <h2 className="font-display text-2xl tracking-wide">{current.title}</h2>
          <p className="mt-1 text-sm text-gris-suave">{current.intro}</p>

          <div className="mt-6 space-y-4">
            {current.fields.map((f) => (
              <div key={f.key} className="field">
                <label>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={(data as any)[current.section][f.key]}
                    onChange={(e) => updateField(current.section, f.key, e.target.value)}
                  />
                ) : (
                  <input
                    value={(data as any)[current.section][f.key]}
                    onChange={(e) => updateField(current.section, f.key, e.target.value)}
                  />
                )}
              </div>
            ))}

            {current.section === "flujoComercial" && (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-gris-suave">
                    Preguntas frecuentes de clientes
                  </p>
                  <button type="button" onClick={addFaq} className="text-sm text-rojo-hover underline">
                    + Agregar
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {data.flujoComercial.faqs.map((f, idx) => (
                    <div key={idx} className="rounded-lg border border-gris-medio bg-gris-oscuro p-4">
                      <div className="field">
                        <label>Pregunta</label>
                        <input
                          value={f.pregunta}
                          onChange={(e) => updateFaq(idx, { pregunta: e.target.value })}
                        />
                      </div>
                      <div className="field mt-3">
                        <label>Respuesta</label>
                        <textarea
                          rows={2}
                          value={f.respuesta}
                          onChange={(e) => updateFaq(idx, { respuesta: e.target.value })}
                        />
                      </div>
                      {data.flujoComercial.faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          className="mt-2 text-xs text-gris-claro hover:text-rojo-hover"
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {current.section === "accesos" && (
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-gris-suave">
                    Plataformas a las que necesitaremos acceso
                  </p>
                  <button type="button" onClick={addAcceso} className="text-sm text-rojo-hover underline">
                    + Agregar
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {data.accesos.plataformas.map((a, idx) => (
                    <div key={idx} className="rounded-lg border border-gris-medio bg-gris-oscuro p-4">
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="field">
                          <label>Plataforma</label>
                          <input
                            placeholder="Ej: Instagram, Meta Business, dominio..."
                            value={a.plataforma}
                            onChange={(e) => updateAcceso(idx, { plataforma: e.target.value })}
                          />
                        </div>
                        <div className="field">
                          <label>¿Cómo la compartirás?</label>
                          <input
                            placeholder="Ej: agregar como admin, 1Password..."
                            value={a.comoCompartir}
                            onChange={(e) => updateAcceso(idx, { comoCompartir: e.target.value })}
                          />
                        </div>
                        <div className="field">
                          <label>Notas</label>
                          <input
                            value={a.notas}
                            onChange={(e) => updateAcceso(idx, { notas: e.target.value })}
                          />
                        </div>
                      </div>
                      {data.accesos.plataformas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAcceso(idx)}
                          className="mt-2 text-xs text-gris-claro hover:text-rojo-hover"
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {current.section === "adjuntos" && (
              <div className="field">
                <label>Notas finales para el equipo</label>
                <textarea
                  rows={4}
                  value={data.notasFinales}
                  onChange={(e) => setData((prev) => ({ ...prev, notasFinales: e.target.value }))}
                />
              </div>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-rojo-hover">{error}</p>}

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0 || saving}
              className="rounded-lg border border-gris-medio px-5 py-2.5 text-sm disabled:opacity-40"
            >
              Atrás
            </button>
            {isLastStep ? (
              <button type="button" onClick={handleSubmit} disabled={saving} className="btn-rojo disabled:opacity-50">
                {saving ? "Enviando..." : "Enviar onboarding"}
              </button>
            ) : (
              <button type="button" onClick={handleNext} disabled={saving} className="btn-rojo disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar y continuar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
