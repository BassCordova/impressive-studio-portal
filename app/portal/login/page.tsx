"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/portal/cotizador";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, next }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al iniciar sesión");
      return;
    }
    const data = await res.json();
    router.push(data.next);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gris-medio bg-gris-oscuro p-8"
      >
        <h1 className="font-display text-3xl tracking-wide text-blanco">
          IMPRESSIVE STUDIO
        </h1>
        <div className="mt-1 h-[2px] w-12 bg-rojo" />
        <p className="mt-4 text-sm text-gris-suave">
          Acceso interno del equipo.
        </p>

        <div className="field mt-6">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
        </div>

        {error && <p className="mt-3 text-sm text-rojo-hover">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-rojo mt-6 w-full disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
