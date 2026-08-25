"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AgentConfig, ChatMessage } from "@/lib/agent-types";
import { AGENT_MODELS, modelSupportsTemperature } from "@/lib/agent-types";

export default function AgentDetail({
  initial,
  apiConfigured,
}: {
  initial: AgentConfig;
  apiConfigured: boolean;
}) {
  const router = useRouter();
  const [agent, setAgent] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState("");

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/agents/${agent.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: agent.nombre,
        systemPrompt: agent.systemPrompt,
        modelo: agent.modelo,
        temperatura: agent.temperatura,
      }),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  async function handleDelete() {
    if (!confirm("¿Borrar este agente?")) return;
    await fetch(`/api/agents/${agent.id}`, { method: "DELETE" });
    router.push("/agentes");
  }

  async function handleSend() {
    if (!input.trim() || sending) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: input }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    setChatError("");

    const res = await fetch(`/api/agents/${agent.id}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: nextMessages }),
    });

    setSending(false);

    if (!res.ok) {
      const data = await res.json();
      setChatError(data.error || "Error al hablar con el agente");
      return;
    }

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gris-medio pb-6">
        <div>
          <Link href="/portal/agentes" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
            ← Portal de agentes
          </Link>
          <h1 className="mt-2 font-display text-4xl tracking-wide">{agent.nombre || "Agente"}</h1>
        </div>
        <button onClick={handleDelete} className="text-xs text-gris-claro hover:text-rojo-hover">
          Borrar agente
        </button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-lg border border-gris-medio bg-gris-oscuro p-6">
          <h2 className="font-display text-2xl tracking-wide">Configuración</h2>

          <div className="mt-4 space-y-4">
            <div className="field">
              <label>Nombre</label>
              <input
                value={agent.nombre}
                onChange={(e) => {
                  setSaved(false);
                  setAgent((a) => ({ ...a, nombre: e.target.value }));
                }}
              />
            </div>
            <div className="field">
              <label>Modelo</label>
              <select
                value={agent.modelo}
                onChange={(e) => {
                  setSaved(false);
                  setAgent((a) => ({ ...a, modelo: e.target.value }));
                }}
              >
                {AGENT_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            {modelSupportsTemperature(agent.modelo) ? (
              <div className="field">
                <label>Temperatura ({agent.temperatura.toFixed(1)})</label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={agent.temperatura}
                  onChange={(e) => {
                    setSaved(false);
                    setAgent((a) => ({ ...a, temperatura: Number(e.target.value) }));
                  }}
                />
              </div>
            ) : (
              <p className="text-xs text-gris-claro">
                Este modelo no usa temperatura; el comportamiento se ajusta desde el system prompt.
              </p>
            )}
            <div className="field">
              <label>System prompt</label>
              <textarea
                rows={16}
                value={agent.systemPrompt}
                onChange={(e) => {
                  setSaved(false);
                  setAgent((a) => ({ ...a, systemPrompt: e.target.value }));
                }}
              />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-rojo mt-4 disabled:opacity-50">
            {saving ? "Guardando..." : saved ? "Guardado ✓" : "Guardar cambios"}
          </button>
        </section>

        <section className="flex flex-col rounded-lg border border-gris-medio bg-gris-oscuro p-6">
          <h2 className="font-display text-2xl tracking-wide">Chat de prueba</h2>

          {!apiConfigured ? (
            <p className="mt-4 text-sm text-gris-suave">
              Falta configurar <code className="text-rojo-hover">ANTHROPIC_API_KEY</code> en Vercel
              para poder probar este agente en vivo. El resto del portal funciona igual mientras
              tanto.
            </p>
          ) : (
            <>
              <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-md bg-negro p-4" style={{ minHeight: 320, maxHeight: 480 }}>
                {messages.length === 0 && (
                  <p className="text-sm text-gris-claro">Escribe un mensaje para probar el agente.</p>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "ml-auto bg-rojo text-blanco"
                        : "bg-gris-medio text-blanco"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                {sending && <p className="text-xs text-gris-claro">Pensando...</p>}
              </div>

              {chatError && <p className="mt-2 text-sm text-rojo-hover">{chatError}</p>}

              <div className="mt-4 flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-gris-medio bg-gris-oscuro px-3 py-2 text-sm text-blanco outline-none focus:border-rojo"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribe como si fueras un cliente..."
                />
                <button onClick={handleSend} disabled={sending} className="btn-rojo disabled:opacity-50">
                  Enviar
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="rounded-lg border border-gris-medio bg-gris-oscuro p-6">
          <h2 className="font-display text-xl tracking-wide">Exportar</h2>
          <div className="mt-4 space-y-2">
            <a
              href={`/api/agents/${agent.id}/export-gohighlevel`}
              className="block text-center rounded-lg bg-rojo px-4 py-2 text-sm font-medium text-blanco hover:bg-rojo-hover disabled:opacity-50"
            >
              GoHighLevel JSON
            </a>
          </div>
        </section>

        <section className="rounded-lg border border-gris-medio bg-gris-oscuro p-6">
          <h2 className="font-display text-xl tracking-wide">Versiones</h2>
          <div className="mt-4">
            {agent.promptVersions.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {agent.promptVersions.map((v, i) => (
                  <div key={i} className="text-xs bg-negro p-2 rounded">
                    <div className="text-gris-claro">{new Date(v.savedAt).toLocaleDateString("es-ES")}</div>
                    <div className="text-gris-suave truncate">{v.savedBy}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gris-suave">Sin versiones previas guardadas aún.</p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-gris-medio bg-gris-oscuro p-6">
          <h2 className="font-display text-xl tracking-wide">Información</h2>
          <div className="mt-4 space-y-2 text-xs">
            <div>
              <span className="text-gris-suave">ID:</span>
              <span className="ml-2 font-mono text-gris-claro">{agent.id}</span>
            </div>
            <div>
              <span className="text-gris-suave">Creado:</span>
              <span className="ml-2 text-gris-claro">{new Date(agent.createdAt).toLocaleDateString("es-ES")}</span>
            </div>
            <div>
              <span className="text-gris-suave">Actualizado:</span>
              <span className="ml-2 text-gris-claro">{new Date(agent.updatedAt).toLocaleDateString("es-ES")}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
