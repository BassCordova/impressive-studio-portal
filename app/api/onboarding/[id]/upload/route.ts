import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const MAX_SIZE = 15 * 1024 * 1024; // 15MB

// Público a propósito: el cliente sube su logo/fotos desde /onb/[id] sin login.
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "El archivo supera los 15MB" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const pathname = `onboarding-files/${params.id}/${randomUUID().slice(0, 8)}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type || "application/octet-stream",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url, name: file.name });
}
