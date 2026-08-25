"use client";

import { useState } from "react";

export default function FileUploadField({
  onboardingId,
  label,
  value,
  onChange,
}: {
  onboardingId: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`/api/onboarding/${onboardingId}/upload`, {
      method: "POST",
      body: fd,
    });

    setUploading(false);
    e.target.value = "";

    if (!res.ok) {
      setError("No se pudo subir el archivo. Intenta de nuevo o pega un link.");
      return;
    }

    const data = await res.json();
    onChange(value.trim() ? `${value}, ${data.url}` : data.url);
  }

  return (
    <div className="field">
      <label>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pega un link o sube un archivo abajo"
      />
      <div className="mt-2 flex items-center gap-2">
        <input
          type="file"
          onChange={handleFile}
          disabled={uploading}
          accept="image/*,application/pdf"
          className="text-xs text-gris-suave file:mr-2 file:rounded file:border-0 file:bg-gris-medio file:px-2 file:py-1 file:text-xs file:text-blanco"
        />
        {uploading && <span className="text-xs text-gris-suave">Subiendo...</span>}
      </div>
      {error && <p className="mt-1 text-xs text-rojo-hover">{error}</p>}
    </div>
  );
}
