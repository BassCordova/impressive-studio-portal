import Link from "next/link";

const tools = [
  {
    href: "/portal/cotizador",
    title: "Cotizador",
    desc: "Crea cotizaciones centralizadas y comparte un link único con cada cliente.",
    status: "live" as const,
  },
  {
    href: "/portal/onboarding",
    title: "Onboarding de Clientes",
    desc: "Recolecta toda la información necesaria para construir agentes y entregar servicios.",
    status: "live" as const,
  },
  {
    href: "/portal/agentes",
    title: "Portal de Agentes",
    desc: "Crea y prueba agentes construidos con Claude antes de llevarlos a producción.",
    status: "soon" as const,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-16 md:px-16">
      <div className="flex items-center justify-between border-b border-gris-medio pb-6">
        <h1 className="font-display text-4xl tracking-wide text-blanco">
          IMPRESSIVE STUDIO
        </h1>
        <span className="text-xs uppercase tracking-widest text-gris-suave">
          Portal interno
        </span>
      </div>

      <div className="mt-4 h-[2px] w-16 bg-rojo" />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {tools.map((tool) => {
          const card = (
            <div
              className={`group h-full rounded-lg border-l-4 border-rojo bg-gris-oscuro p-6 transition-transform ${
                tool.status === "live"
                  ? "hover:-translate-y-1 hover:bg-gris-medio"
                  : "opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl tracking-wide">
                  {tool.title}
                </h2>
                {tool.status === "soon" && (
                  <span className="rounded-full bg-gris-medio px-2 py-1 text-[10px] uppercase tracking-widest text-gris-suave">
                    Próximamente
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-gris-suave">{tool.desc}</p>
            </div>
          );

          return tool.status === "live" ? (
            <Link key={tool.href} href={tool.href}>
              {card}
            </Link>
          ) : (
            <div key={tool.href}>{card}</div>
          );
        })}
      </div>
    </main>
  );
}
