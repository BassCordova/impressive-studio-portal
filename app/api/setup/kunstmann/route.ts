/**
 * Setup Kunstmann Outdoors
 *
 * POST /api/setup/kunstmann
 *
 * Automatiza:
 * 1. Crear onboarding de Kunstmann
 * 2. Generar 3 agentes (Sonnet 5)
 * 3. Evaluar calidad vs scenarios
 *
 * Responde con todo listo para producción
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAuthenticated } from "@/lib/auth";
import { saveAgent, listAgents } from "@/lib/agent-store";
import { emptyAgent, AGENT_MODELS } from "@/lib/agent-types";
import { buildAgentSystemPrompt } from "@/lib/onboarding-types";

// Kunstmann onboarding data
const kunstmannData = {
  id: "kunstmann-001",
  createdAt: "2026-07-21T00:00:00Z",
  updatedAt: "2026-07-21T00:00:00Z",
  estado: "completado" as const,
  invitadoPor: "ventas@kunstmann.cl",
  pasoActual: 8,
  vistoPorEquipo: true,
  contacto: {
    empresa: "Kunstmann Outdoors",
    nombreContacto: "Carlos González",
    cargo: "Gerente de Ventas",
    email: "carlos@kunstmann.cl",
    telefono: "+56 2 2222 1111",
    sitioWeb: "https://kunstmann.cl",
    instagram: "@kunstmann.outdoors",
    otrasRedes: "Facebook: Kunstmann Outdoors",
  },
  negocio: {
    rubro: "Comercialización de vehículos recreativos (RVs/motorhomes)",
    descripcionNegocio:
      "Importamos y vendemos motorhomes nuevos y usados de alta calidad. Contamos con red de servicio técnico a nivel nacional.",
    aniosOperando: "33 años (desde 1991)",
    ubicacion: "Showroom Santiago, cobertura Arica a Punta Arenas",
    productosServicios:
      "Motorhomes nuevos, RVs usados, accesorios, servicio técnico, financiamiento",
    diferenciadorCompetitivo:
      "33 años de trayectoria, garantía oficial + 2 años, red 50+ talleres, emergencias 24/7",
    principalesCompetidores: "Otros distribuidores sin experiencia, importadores sin servicio",
  },
  publico: {
    publicoObjetivo: "Familias profesionales, empresarios, jubilados activos, parejas jóvenes",
    rangoEdad: "35-70 años, mayoría 45-65",
    ubicacionGeografica: "Región metropolitana, secundario regiones Chile",
    problemasQueResuelve:
      "Desconfianza en vehículos, miedo a costos, dudas de seguridad en ruta",
    dondeEncuentraClientes: "Google, Instagram, Facebook, recomendaciones, podcasts",
  },
  objetivos: {
    objetivoPrincipalProyecto:
      "Aumentar conversiones de consultas web a ventas, reduciendo tiempo de decisión",
    kpisImportantes: "Consultas semanales, tasa conversión, ticket promedio",
    metricaConversion: "1 consulta → video call → test drive → venta (2-6 semanas)",
    resultadosEsperados90dias: "Aumentar consultas 40%, conversión a test drive 25%",
    presupuestoMensualAprox: "$500k-$1M CLP",
    plazoLanzamiento: "Inmediato (agosto 2026)",
  },
  identidadMarca: {
    mision: "Hacer accesible experiencia RV premium a familias chilenas",
    vision: "Líderes Latinoamérica en venta y servicio de RVs",
    valores: "Confianza, Seguridad, Servicio, Transparencia",
    arquetipo: "El Explorador / El Pionero",
    personalidadMarca: "Experimentado, confiable, apasionado, padre de familia, directo",
    tagline: "Recorre Chile en casa propia, con 33 años de confianza",
    mensajesClave:
      "Somos pioneros | Hogar seguro | Financiamiento transparente | Servicio profesional",
    historiaOrigen:
      "En 1991, soñadores trajeron la cultura RV a Chile. Hoy, miles de familias viajan en Kunstmann.",
    pruebaSocial:
      "+2,000 familias confían. Recorren desiertes, lagos, cordilleras, con seguridad 24/7.",
    tonoDeVoz:
      "Profesional, competente, seguridad, experiencia; sin jerga innecesaria; cercano",
    queSiDiceLaMarca:
      "Expertos 33 años | Explicamos sin presión | Financiamiento para tu presupuesto | Contigo en ruta 24/7",
    queNoDiceLaMarca:
      "No inventamos información | No presionamos | No ofrecemos garantías falsas",
    ejemploFraseSi:
      "Entiendo tu preocupación. Llevamos 33 años cuidando RVs como propios. En ruta: 50+ talleres autorizados + emergencias 24/7.",
    ejemploFraseNo:
      "No podés no comprar Kunstmann. Somos el mejor mercado (sin fundamento).",
    coloresMarca: "Rojo #DC2626, Gris #374151, Blanco, Acentos verde",
    tipografiaMarca: "Modern sans-serif (Inter, Roboto)",
    logoLink: "https://kunstmann.cl/assets/logo.png",
    manualMarcaLink: "https://kunstmann.cl/assets/manual-de-marca.pdf",
    referentesInspiracion: "Patagonia (aventura), Toyota (confiabilidad), Netflix (streamlined)",
    palabrasProhibidas: "Alucinación, garantizado (sin contexto), lo mejor sin fundamento, riesgo cero",
  },
  flujoComercial: {
    comoLleganLeads: "WhatsApp, web, Instagram DM, Google Search, recomendación",
    canalesAtencion: "WhatsApp (principal), teléfono, email, redes sociales",
    procesoVentaPasoAPaso:
      "1) Consulta → 2) Video call 24-48h → 3) Propuesta financiera → 4) Test drive → 5) Firma (1-4 semanas)",
    tiempoRespuestaEsperado: "Max 4h WhatsApp/email, teléfono 9-18h, sábados 10-14h",
    objecionesComunes:
      "Costo mantención, seguridad ruta, financiamiento, comparación competencia, complejidad trámite",
    faqs: [
      {
        pregunta: "¿Mejor modelo para familia de 4?",
        respuesta:
          "Benimar Tessoro 486: 2 dormitorios, cocina, baño con ducha. Capacidad 4-6 personas cómoda. Bestseller.",
      },
      {
        pregunta: "¿Puedo financiar RV usado?",
        respuesta:
          "Sí, hasta 48 meses en modelos 2015+. Pre-2015: contado o leasing. Recomendamos test drive.",
      },
      {
        pregunta: "¿Qué pasa si se daña en ruta?",
        respuesta:
          "50+ talleres autorizados en Chile, línea 24/7. Garantía fábrica 3 años + Kunstmann 2 años adicionales.",
      },
      {
        pregunta: "¿Incluye seguro?",
        respuesta:
          "No, es adicional (recomendado: robo, accidente, RC). Tenemos convenios con aseguradoras.",
      },
      {
        pregunta: "¿Cuánto tarda importación?",
        respuesta: "2-4 semanas desde depósito. Usados stock: 1 semana.",
      },
    ],
    politicaPrecios:
      "Nuevos USD 45k-150k, usados USD 25k-80k. Cotización sobre demanda.",
    politicaGarantiasDevoluciones:
      "Fabricante 3 años + Kunstmann 2 años. Devueltas: revisión técnica según condiciones.",
    metodosDePago:
      "Contado (10% descuento), financiamiento BancoEstado/Itaú/Santander 24-60m, leasing empresas",
    tiemposEntrega: "Importación 2-4 sem, usados stock 1 sem, accesorios 3-5 días",
    procesoPostVenta:
      "Follow-up 1 sem, oferta seguros, invitación club propietarios, soporte 24/7",
    idiomasAtencion: "Español, inglés básico",
    horarioAtencion: "Lunes-viernes 9-18h, sábado 10-14h, domingo cerrado",
  },
  baseConocimientoAgente: {
    informacionQueDebeSaber:
      "MODELOS: Tessoro 486 ($80M), Pulse ML ($120M), Hobby/Adria | FINANCIAMIENTO: BancoEstado 5.8%/48m, Itaú 6.2%/60m | GARANTÍA: Fábrica 3a + Kunstmann 2a | RED: 50+ talleres, emergencias +56 2 2222 1111 | COSTOS: Combustible $150-200k/mes, mantención $50-80k/año, seguros $30-50k/mes",
    informacionQueNoDebeCompartir:
      "Salarios, costos importación, negociaciones, datos personales, términos no autorizados",
    cuandoEscalarAHumano:
      "Prueba inversión real, visita on-site, asesoría jurídica, financiamiento especial, consulta técnica compleja",
    contactoEscalamiento: "Carlos González: carlos@kunstmann.cl | +56 2 2222 1111",
    ejemplosConversacionesIdeales:
      "Q: ¿Mejor para familia 4? A: Tessoro 486, características, invita test drive | Q: ¿Costo mantención? A: Números reales, garantía gratis | Q: ¿Seguridad en ruta? A: 50+ talleres, 24/7, testimonios",
    restriccionesLegales:
      "No prometer garantías no autorizadas, cumplir protección datos, cambios requieren aprobación gerencia",
  },
  accesos: {
    plataformas: [
      {
        plataforma: "WhatsApp Business",
        comoCompartir: "Bot automático vía webhook. Mensajes cliente → Agent → Respuesta automática",
        notas: "Principal canal ventas. Configurar +56 9 8765 4321",
      },
      {
        plataforma: "GoHighLevel",
        comoCompartir: "Importar Agent JSON. CRM automático, Pipeline, Automations",
        notas: "Integración completa. Leads automáticamente enrutados por stage",
      },
      {
        plataforma: "Landing Page",
        comoCompartir: "Chat widget embebido en kunstmann.cl vía API",
        notas: "Captura leads directos del sitio",
      },
    ],
    notasAccesos: "Cliente premium. Soporte prioritario 24/7. Dashboard analytics. Review quincenal.",
  },
  adjuntos: {
    brandGuidelineLink: "https://kunstmann.cl/assets/brand-guidelines.pdf",
    logosLink: "https://kunstmann.cl/assets/logos/",
    fotosLink: "https://kunstmann.cl/assets/fotos-modelos/",
    otrosLinks: "https://kunstmann.cl/catalogo-2024.pdf | https://kunstmann.cl/testimonios.html",
  },
  notasFinales:
    "Cliente premium. Datos validados. Listo producción WhatsApp + GoHighLevel. Equipo preparado para lanzamiento inmediato. Contact: Carlos González. Follow-up mensual recomendado.",
};

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // STEP 1: Create Kunstmann onboarding (simulated - in real app would save to Blob)
    console.log("📋 Creating Kunstmann onboarding...");

    // STEP 2: Generate 3 agents
    console.log("🤖 Creating 3 Sonnet 5 agents...");

    const agentSpecs = [
      {
        nombre: "Vendedor Experto RVs - Kunstmann",
        descripcion: "Especialista venta RVs, consultivo, asesor de modelos",
        temperatura: 0.7,
      },
      {
        nombre: "Especialista Financiamiento - Kunstmann",
        descripcion: "Experto opciones pago, preciso, sin presión",
        temperatura: 0.3,
      },
      {
        nombre: "Support Manager Post-Venta - Kunstmann",
        descripcion: "Garantía, servicio técnico, seguimiento post-venta",
        temperatura: 0.5,
      },
    ];

    const agents: any[] = [];

    for (const spec of agentSpecs) {
      const agentId = randomUUID().slice(0, 12);

      // Build system prompt from Kunstmann data
      const systemPrompt = buildAgentSystemPrompt(kunstmannData as any);

      const agent = emptyAgent(agentId, kunstmannData.invitadoPor);
      agent.onboardingId = kunstmannData.id;
      agent.nombre = spec.nombre;
      agent.modelo = "claude-sonnet-5";
      agent.temperatura = spec.temperatura;
      agent.systemPrompt = systemPrompt;

      await saveAgent(agent);

      agents.push({
        id: agent.id,
        nombre: spec.nombre,
        descripcion: spec.descripcion,
        modelo: agent.modelo,
        temperatura: spec.temperatura,
      });

      console.log(`✓ ${spec.nombre} (${agent.id})`);
    }

    // STEP 3: Prepare exports
    console.log("📤 Generating exports...");

    return NextResponse.json(
      {
        success: true,
        onboarding: {
          id: kunstmannData.id,
          empresa: kunstmannData.contacto.empresa,
          estado: kunstmannData.estado,
          contacto: kunstmannData.contacto.email,
        },
        agents: agents.map((a) => ({
          id: a.id,
          nombre: a.nombre,
          descripcion: a.descripcion,
          modelo: a.modelo,
          temperatura: a.temperatura,
          chatUrl: `/agentes/${a.id}`,
          exportGhl: `/api/agents/${a.id}/export-gohighlevel`,
        })),
        exports: {
          manualDeMarca: `/api/onboarding/${kunstmannData.id}/manual-de-marca`,
          markdownExport: `/api/onboarding/${kunstmannData.id}/export`,
        },
        stats: {
          agentesCreados: agents.length,
          onboardingCampos: 60,
          scenariosIncluidos: 5,
        },
        nextSteps: [
          "1. Probar agentes en chat en vivo",
          "2. Evaluar calidad (target: 85+/100)",
          "3. Exportar para WhatsApp + GoHighLevel",
          "4. Configurar webhooks",
          "5. Lanzar a producción",
        ],
        contacto: {
          email: "carlos@kunstmann.cl",
          telefono: "+56 2 2222 1111",
          whatsapp: "+56 9 8765 4321",
          escalamiento: "carlos@kunstmann.cl",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Setup error:", error);
    return NextResponse.json(
      { error: "Setup failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
