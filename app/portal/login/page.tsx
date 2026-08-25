"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginGate />
    </Suspense>
  );
}

function LoginGate() {
  const [checking, setChecking] = useState(true);
  const [hasUsers, setHasUsers] = useState(true);

  useEffect(() => {
    fetch("/api/auth/bootstrap")
      .then((res) => res.json())
      .then((data) => setHasUsers(!!data.hasUsers))
      .catch(() => setHasUsers(true))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return null;

  return hasUsers ? <LoginForm /> : <BootstrapForm />;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/portal/cotizador";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Email o contraseña incorrectos");
      return;
    }

    router.push(callbackUrl);
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
        <p className="mt-4 text-sm text-gris-suave">Acceso interno del equipo.</p>

        <div className="field mt-6">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="field mt-4">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

function BootstrapForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/bootstrap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "No se pudo crear la cuenta");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (!signInRes || signInRes.error) {
      setError("Cuenta creada, pero el login automático falló. Intenta entrar manualmente.");
      return;
    }
    router.push("/portal/cotizador");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-rojo bg-gris-oscuro p-8"
      >
        <h1 className="font-display text-3xl tracking-wide text-blanco">
          IMPRESSIVE STUDIO
        </h1>
        <div className="mt-1 h-[2px] w-12 bg-rojo" />
        <p className="mt-4 text-sm text-gris-suave">
          Primer acceso: crea la cuenta admin del equipo.
        </p>

        <div className="field mt-6">
          <label>Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </div>
        <div className="field mt-4">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field mt-4">
          <label>Contraseña (mínimo 8 caracteres)</label>
          <input
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="mt-3 text-sm text-rojo-hover">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-rojo mt-6 w-full disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear cuenta admin"}
        </button>
      </form>
    </main>
  );
}
