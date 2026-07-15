"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UserBar from "@/app/components/UserBar";
import type { SafeUser } from "@/lib/users-store";

export default function UsuariosPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "vendedor">("vendedor");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/users");
    if (res.status === 401) {
      setForbidden(true);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    setCreating(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al crear usuario");
      return;
    }
    setName("");
    setEmail("");
    setPassword("");
    setRole("vendedor");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Borrar este usuario?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "No se pudo borrar");
      return;
    }
    load();
  }

  if (forbidden) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <p className="text-lg text-blanco">Solo un admin puede gestionar usuarios.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-rojo-hover underline">
            Volver al portal
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gris-medio pb-6">
        <div>
          <Link href="/" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
            ← Portal
          </Link>
          <h1 className="mt-2 font-display text-4xl tracking-wide">Usuarios</h1>
        </div>
        <UserBar />
      </div>

      <section className="mt-10 max-w-lg">
        <h2 className="font-display text-2xl tracking-wide">Crear usuario</h2>
        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          <div className="field">
            <label>Nombre</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Contraseña temporal (mínimo 8 caracteres)</label>
            <input
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Rol</label>
            <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "vendedor")}>
              <option value="vendedor">Vendedor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-sm text-rojo-hover">{error}</p>}
          <button type="submit" disabled={creating} className="btn-rojo disabled:opacity-50">
            {creating ? "Creando..." : "Crear usuario"}
          </button>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-wide">Equipo</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-gris-medio">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="bg-rojo text-blanco">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gris-suave">
                    Sin usuarios.
                  </td>
                </tr>
              )}
              {users.map((u, idx) => (
                <tr key={u.id} className={idx % 2 === 0 ? "bg-negro" : "bg-gris-oscuro"}>
                  <td className="px-4 py-3 text-blanco">{u.name}</td>
                  <td className="px-4 py-3 text-gris-suave">{u.email}</td>
                  <td className="px-4 py-3 uppercase text-xs text-gris-suave">{u.role}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-xs text-gris-claro hover:text-rojo-hover"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
