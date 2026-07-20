import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { randomUUID } from "crypto";
import { getOnboarding } from "@/lib/onboarding-store";

const MAX_SIZE = 15 * 1024 * 1024; // 15MB por archivo
const MAX_FILES_PER_ONBOARDING = 30;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

// Público a propósito: el cliente sube su logo/fotos desde /onb/[id] sin login.
// Pero solo si el onboarding existe, el tipo está permitido, y no se excede el
// tope de adjuntos, para evitar abuso de almacenamiento/costo por el id abierto.
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const onboarding = await getOnboarding(params.id);
  if (!onboarding) {
    return NextResponse.json({ error: "Onboarding no encontrado" }, { status: 404 });
  }
  if (onboarding.estado === "completado") {
    return NextResponse.json(
      { error: "Este onboarding ya fue enviado; no admite más archivos." },
      { status: 409 }
    );
  }

  const prefix = `onboarding-files/${params.id}/`;
  const { blobs } = await list({ prefix });
  if (blobs.length >= MAX_FILES_PER_ONBOARDING) {
    return NextResponse.json(
      { error: "Alcanzaste el máximo de archivos para este onboarding." },
      { status: 429 }
    );
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "El archivo supera los 15MB" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Tipo de archivo no permitido. Solo imágenes o PDF." },
      { status: 415 }
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const pathname = `${prefix}${randomUUID().slice(0, 8)}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url, name: file.name });
}
