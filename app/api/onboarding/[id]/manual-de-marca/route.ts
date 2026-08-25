import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getOnboarding } from "@/lib/onboarding-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const onboarding = await getOnboarding(params.id);
  if (!onboarding) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const html = generateManualHTML(onboarding);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function generateManualHTML(onboarding: any): string {
  const empresa = onboarding.contacto.empresa || "Empresa";
  const identidad = onboarding.identidadMarca || {};
  const negocio = onboarding.negocio || {};
  const publico = onboarding.publico || {};
  const flujoComercial = onboarding.flujoComercial || {};

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manual de Marca - ${empresa}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 60px 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .cover {
      text-align: center;
      border-bottom: 2px solid #dc2626;
      padding-bottom: 40px;
      margin-bottom: 60px;
    }

    h1 {
      font-size: 48px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 10px;
    }

    .tagline {
      font-size: 20px;
      color: #dc2626;
      font-weight: 500;
      margin-bottom: 30px;
    }

    .meta {
      font-size: 13px;
      color: #666;
      margin-top: 20px;
    }

    h2 {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
      margin-top: 50px;
      margin-bottom: 20px;
      border-left: 4px solid #dc2626;
      padding-left: 15px;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-top: 25px;
      margin-bottom: 12px;
    }

    p {
      margin-bottom: 12px;
      text-align: justify;
    }

    ul, ol {
      margin-left: 20px;
      margin-bottom: 15px;
    }

    li {
      margin-bottom: 8px;
    }

    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }

    .label {
      font-weight: 600;
      color: #555;
      display: inline-block;
      width: 150px;
      margin-top: 8px;
    }

    .value {
      color: #333;
    }

    .examples {
      background: #f9f9f9;
      border-left: 3px solid #dc2626;
      padding: 15px 20px;
      margin: 15px 0;
      border-radius: 4px;
    }

    .do {
      color: #059669;
      font-weight: 600;
    }

    .dont {
      color: #dc2626;
      font-weight: 600;
    }

    @media print {
      body {
        background: white;
      }
      .container {
        box-shadow: none;
        padding: 40px;
      }
      h2 {
        page-break-after: avoid;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="cover">
      <h1>${empresa}</h1>
      ${identidad.tagline ? `<div class="tagline">${escapeHTML(identidad.tagline)}</div>` : ""}
      <div class="meta">Manual de Marca y Estrategia de Conversación</div>
      <div class="meta">Generado el ${new Date().toLocaleDateString("es-ES")}</div>
    </div>

    ${negocio.rubro ? `
    <div class="section">
      <h2>Contexto del Negocio</h2>
      <p><span class="label">Rubro:</span> <span class="value">${escapeHTML(negocio.rubro)}</span></p>
      ${negocio.productos ? `<p><span class="label">Productos:</span> <span class="value">${escapeHTML(negocio.productos)}</span></p>` : ""}
      ${negocio.diferenciador ? `<p><span class="label">Diferenciador:</span> <span class="value">${escapeHTML(negocio.diferenciador)}</span></p>` : ""}
      ${negocio.ubicacion ? `<p><span class="label">Ubicación:</span> <span class="value">${escapeHTML(negocio.ubicacion)}</span></p>` : ""}
      ${negocio.historia ? `<p><span class="label">Historia:</span> <span class="value">${escapeHTML(negocio.historia)}</span></p>` : ""}
    </div>
    ` : ""}

    ${publico.descripcion ? `
    <div class="section">
      <h2>A Quién Le Hablas</h2>
      <p>${escapeHTML(publico.descripcion)}</p>
      ${publico.edad ? `<p><span class="label">Edad:</span> <span class="value">${escapeHTML(publico.edad)}</span></p>` : ""}
      ${publico.problemas ? `<p><span class="label">Problemas clave:</span> <span class="value">${escapeHTML(publico.problemas)}</span></p>` : ""}
    </div>
    ` : ""}

    ${identidad.arquetipo ? `
    <div class="section">
      <h2>Personalidad de Marca</h2>
      <p><span class="label">Arquetipo:</span> <span class="value">${escapeHTML(identidad.arquetipo)}</span></p>
      ${identidad.personalidad ? `<p><span class="label">Personalidad:</span> <span class="value">${escapeHTML(identidad.personalidad)}</span></p>` : ""}
      ${identidad.tonodeVoz ? `<p><span class="label">Tono:</span> <span class="value">${escapeHTML(identidad.tonodeVoz)}</span></p>` : ""}
    </div>
    ` : ""}

    ${identidad.mensajesClave ? `
    <div class="section">
      <h2>Mensajes Clave</h2>
      <p>${escapeHTML(identidad.mensajesClave)}</p>
    </div>
    ` : ""}

    ${(identidad.ejemploFraseSi || identidad.ejemploFraseNo) ? `
    <div class="section">
      <h2>Ejemplos de Lenguaje</h2>
      ${identidad.ejemploFraseSi ? `
        <div class="examples">
          <span class="do">✓ SÍ DECIR:</span>
          <p>${escapeHTML(identidad.ejemploFraseSi)}</p>
        </div>
      ` : ""}
      ${identidad.ejemploFraseNo ? `
        <div class="examples">
          <span class="dont">✗ NO DECIR:</span>
          <p>${escapeHTML(identidad.ejemploFraseNo)}</p>
        </div>
      ` : ""}
    </div>
    ` : ""}

    ${flujoComercial.procesoVenta ? `
    <div class="section">
      <h2>Proceso de Venta</h2>
      <p>${escapeHTML(flujoComercial.procesoVenta)}</p>
    </div>
    ` : ""}

    <div class="section" style="border-top: 2px solid #eee; padding-top: 40px; margin-top: 60px;">
      <p style="font-size: 12px; color: #999;">
        Este documento fue generado automáticamente por Impressive Studio Portal.
        Contiene información de marca, tono de voz y estrategia de conversación
        para asegurar coherencia en todas las interacciones del cliente.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHTML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
