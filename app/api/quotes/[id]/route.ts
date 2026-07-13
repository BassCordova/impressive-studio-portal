import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteQuote, getQuote, saveQuote } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const quote = await getQuote(params.id);
  if (!quote) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }
  return NextResponse.json({ quote });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const quote = await getQuote(params.id);
  if (!quote) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }
  const body = await req.json();
  const updated = { ...quote, estado: body.estado ?? quote.estado };
  await saveQuote(updated);
  return NextResponse.json({ quote: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  await deleteQuote(params.id);
  return NextResponse.json({ ok: true });
}
