"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function UserBar() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-3 text-xs text-gris-suave">
      <span>
        {session.user.name} ·{" "}
        <span className="uppercase tracking-widest text-gris-claro">{session.user.role}</span>
      </span>
      {session.user.role === "admin" && (
        <Link href="/usuarios" className="rounded border border-gris-medio px-2 py-1 hover:border-rojo hover:text-blanco">
          Usuarios
        </Link>
      )}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="rounded border border-gris-medio px-2 py-1 hover:border-rojo hover:text-blanco"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
