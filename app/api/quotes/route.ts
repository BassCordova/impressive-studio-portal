import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAuthenticated } from "@/lib/auth";
import { listQuotes, saveQuote } from "@/lib/store";
import type { Quote } from "@/lib/types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const quotes = await listQuotes();
  return NextResponse.json({ quotes });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.cliente?.nombre || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "Falta nombre del cliente o al menos un item" },
      { status: 400 }
    );
  }

  const quote: Quote = {
    id: randomUUID().slice(0, 8),
    createdAt: new Date().toISOString(),
    vendedor: body.vendedor || "Impressive Studio",
    cliente: {
      nombre: body.cliente.nombre,
      empresa: body.cliente.empresa || "",
      email: body.cliente.email || "",
    },
    moneda: body.moneda === "USD" ? "USD" : "CLP",
    items: body.items.map((i: any) => ({
      nombre: i.nombre,
      descripcion: i.descripcion || "",
      cantidad: Number(i.cantidad) || 1,
      precioUnitario: Number(i.precioUnitario) || 0,
    })),
    descuentoPct: Number(body.descuentoPct) || 0,
    validezDias: Number(body.validezDias) || 15,
    condicionesPago: body.condicionesPago || "",
    notas: body.notas || "",
    estado: "enviada",
  };

  await saveQuote(quote);

  return NextResponse.json({ quote });
}
