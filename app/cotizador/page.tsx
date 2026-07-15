import Link from "next/link";
import { listQuotes } from "@/lib/store";
import UserBar from "@/app/components/UserBar";
import QuotesTable from "./QuotesTable";

export const dynamic = "force-dynamic";

export default async function CotizadorPage() {
  const quotes = await listQuotes();

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gris-medio pb-6">
        <div>
          <Link href="/" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
            ← Portal
          </Link>
          <h1 className="mt-2 font-display text-4xl tracking-wide">Cotizador</h1>
        </div>
        <div className="flex items-center gap-4">
          <UserBar />
          <Link href="/cotizador/nueva" className="btn-rojo">
            + Nueva cotización
          </Link>
        </div>
      </div>

      <div className="mt-10 overflow-x-auto rounded-lg border border-gris-medio">
        <QuotesTable quotes={quotes} />
      </div>
    </main>
  );
}
