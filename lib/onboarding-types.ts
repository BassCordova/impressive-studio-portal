export type OnboardingStatus = "pendiente" | "en_progreso" | "completado";

export type FAQItem = {
  pregunta: string;
  respuesta: string;
};

export type AccesoItem = {
  plataforma: string;
  comoCompartir: string;
  notas: string;
};

export type OnboardingData = {
  id: string;
  createdAt: string;
  updatedAt: string;
  estado: OnboardingStatus;
  invitadoPor: string;
  pasoActual: number;
  vistoPorEquipo: boolean;

  contacto: {
    empresa: string;
    nombreContacto: string;
    cargo: string;
    email: string;
    telefono: string;
    sitioWeb: string;
    instagram: string;
    otrasRedes: string;
  };

  negocio: {
    rubro: string;
    descripcionNegocio: string;
    aniosOperando: string;
    ubicacion: string;
    productosServicios: string;
    diferenciadorCompetitivo: string;
    principalesCompetidores: string;
  };

  publico: {
    publicoObjetivo: string;
    rangoEdad: string;
    ubicacionGeografica: string;
    problemasQueResuelve: string;
    dondeEncuentraClientes: string;
  };

  objetivos: {
    objetivoPrincipalProyecto: string;
    kpisImportantes: string;
    metricaConversion: string;
    resultadosEsperados90dias: string;
    presupuestoMensualAprox: string;
    plazoLanzamiento: string;
  };

  identidadMarca: {
    mision: string;
    vision: string;
    valores: string;
    arquetipo: string;
    personalidadMarca: string;
    tagline: string;
    mensajesClave: string;
    historiaOrigen: string;
    pruebaSocial: string;
    tonoDeVoz: string;
    queSiDiceLaMarca: string;
    queNoDiceLaMarca: string;
    ejemploFraseSi: string;
    ejemploFraseNo: string;
    coloresMarca: string;
    tipografiaMarca: string;
    logoLink: string;
    manualMarcaLink: string;
    referentesInspiracion: string;
    palabrasProhibidas: string;
  };

  flujoComercial: {
    comoLleganLeads: string;
    canalesAtencion: string;
    procesoVentaPasoAPaso: string;
    tiempoRespuestaEsperado: string;
    objecionesComunes: string;
    faqs: FAQItem[];
    politicaPrecios: string;
    politicaGarantiasDevoluciones: string;
    metodosDePago: string;
    tiemposEntrega: string;
    procesoPostVenta: string;
    idiomasAtencion: string;
    horarioAtencion: string;
  };

  baseConocimientoAgente: {
    informacionQueDebeSaber: string;
    informacionQueNoDebeCompartir: string;
    cuandoEscalarAHumano: string;
    contactoEscalamiento: string;
    ejemplosConversacionesIdeales: string;
    restriccionesLegales: string;
  };

  accesos: {
    plataformas: AccesoItem[];
    notasAccesos: string;
  };

  adjuntos: {
    brandGuidelineLink: string;
    logosLink: string;
    fotosLink: string;
    otrosLinks: string;
  };

  notasFinales: string;
};

export function emptyOnboarding(id: string, invitadoPor: string): OnboardingData {
  const now = new Date().toISOString();
  return {
    id,
    createdAt: now,
    updatedAt: now,
    estado: "pendiente",
    invitadoPor,
    pasoActual: 0,
    vistoPorEquipo: false,
    contacto: {
      empresa: "",
      nombreContacto: "",
      cargo: "",
      email: "",
      telefono: "",
      sitioWeb: "",
      instagram: "",
      otrasRedes: "",
    },
    negocio: {
      rubro: "",
      descripcionNegocio: "",
      aniosOperando: "",
      ubicacion: "",
      productosServicios: "",
      diferenciadorCompetitivo: "",
      principalesCompetidores: "",
    },
    publico: {
      publicoObjetivo: "",
      rangoEdad: "",
      ubicacionGeografica: "",
      problemasQueResuelve: "",
      dondeEncuentraClientes: "",
    },
    objetivos: {
      objetivoPrincipalProyecto: "",
      kpisImportantes: "",
      metricaConversion: "",
      resultadosEsperados90dias: "",
      presupuestoMensualAprox: "",
      plazoLanzamiento: "",
    },
    identidadMarca: {
      mision: "",
      vision: "",
      valores: "",
      arquetipo: "",
      personalidadMarca: "",
      tagline: "",
      mensajesClave: "",
      historiaOrigen: "",
      pruebaSocial: "",
      tonoDeVoz: "",
      queSiDiceLaMarca: "",
      queNoDiceLaMarca: "",
      ejemploFraseSi: "",
      ejemploFraseNo: "",
      coloresMarca: "",
      tipografiaMarca: "",
      logoLink: "",
      manualMarcaLink: "",
      referentesInspiracion: "",
      palabrasProhibidas: "",
    },
    flujoComercial: {
      comoLleganLeads: "",
      canalesAtencion: "",
      procesoVentaPasoAPaso: "",
      tiempoRespuestaEsperado: "",
      objecionesComunes: "",
      faqs: [{ pregunta: "", respuesta: "" }],
      politicaPrecios: "",
      politicaGarantiasDevoluciones: "",
      metodosDePago: "",
      tiemposEntrega: "",
      procesoPostVenta: "",
      idiomasAtencion: "",
      horarioAtencion: "",
    },
    baseConocimientoAgente: {
      informacionQueDebeSaber: "",
      informacionQueNoDebeCompartir: "",
      cuandoEscalarAHumano: "",
      contactoEscalamiento: "",
      ejemplosConversacionesIdeales: "",
      restriccionesLegales: "",
    },
    accesos: {
      plataformas: [{ plataforma: "", comoCompartir: "", notas: "" }],
      notasAccesos: "",
    },
    adjuntos: {
      brandGuidelineLink: "",
      logosLink: "",
      fotosLink: "",
      otrosLinks: "",
    },
    notasFinales: "",
  };
}

/**
 * Rellena un registro leído del Blob contra la forma actual del modelo, para que
 * onboardings creados con una versión previa del esquema no queden con campos
 * `undefined` (evita inputs no controlados en el form y huecos en el prompt/export).
 */
export function normalizeOnboarding(raw: any): OnboardingData {
  const base = emptyOnboarding(raw?.id ?? "", raw?.invitadoPor ?? "Impressive Studio");
  const out: any = { ...base };
  const scalarKeys = [
    "id",
    "createdAt",
    "updatedAt",
    "estado",
    "invitadoPor",
    "pasoActual",
    "vistoPorEquipo",
    "notasFinales",
  ];
  for (const k of scalarKeys) {
    if (raw?.[k] !== undefined) out[k] = raw[k];
  }
  for (const key of Object.keys(base)) {
    const tv = (base as any)[key];
    if (tv && typeof tv === "object" && !Array.isArray(tv)) {
      out[key] = { ...tv, ...(raw?.[key] ?? {}) };
    }
  }
  return out as OnboardingData;
}

/** Merge profundo (un nivel de secciones) de un draft parcial sobre un registro existente. */
export function mergeOnboarding(
  current: OnboardingData,
  patch: Partial<OnboardingData>
): OnboardingData {
  const merged: OnboardingData = { ...current };
  for (const key of Object.keys(patch) as (keyof OnboardingData)[]) {
    const value = patch[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      (merged as any)[key] = { ...(current as any)[key], ...value };
    } else if (value !== undefined) {
      (merged as any)[key] = value;
    }
  }
  merged.updatedAt = new Date().toISOString();
  return merged;
}

// Secciones que el formulario público (cliente, sin login) puede escribir.
const PUBLIC_SECTION_KEYS: (keyof OnboardingData)[] = [
  "contacto",
  "negocio",
  "publico",
  "objetivos",
  "identidadMarca",
  "flujoComercial",
  "baseConocimientoAgente",
  "accesos",
  "adjuntos",
];

const MAX_FIELD_LEN = 20000;

// Forma canónica del registro: define qué campos existen en cada sección,
// independiente de lo que tenga guardado el registro actual.
const TEMPLATE_SHAPE = emptyOnboarding("", "");

function cleanString(v: unknown): string | undefined {
  return typeof v === "string" ? v.slice(0, MAX_FIELD_LEN) : undefined;
}

/**
 * Limpia un PATCH que llega desde el formulario público: solo deja pasar las
 * secciones y campos conocidos (comparando contra la forma del registro actual),
 * acota el tamaño, y descarta cualquier clave inyectada. Protege id, createdAt,
 * invitadoPor y vistoPorEquipo de ser sobreescritos por quien tenga el link.
 */
export function sanitizePublicOnboardingPatch(
  raw: unknown
): Partial<OnboardingData> {
  const clean: Partial<OnboardingData> = {};
  if (!raw || typeof raw !== "object") return clean;
  const body = raw as Record<string, any>;

  for (const key of PUBLIC_SECTION_KEYS) {
    const incoming = body[key];
    const template = (TEMPLATE_SHAPE as any)[key];
    if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) continue;

    const section: Record<string, any> = {};
    for (const sub of Object.keys(template)) {
      const tv = template[sub];
      const iv = incoming[sub];
      if (Array.isArray(tv)) {
        if (!Array.isArray(iv)) continue;
        const sample = tv[0] ?? {};
        section[sub] = iv.slice(0, 100).map((item: any) => {
          const cleanItem: Record<string, string> = {};
          if (item && typeof item === "object") {
            for (const f of Object.keys(sample)) {
              cleanItem[f] = cleanString(item[f]) ?? "";
            }
          }
          return cleanItem;
        });
      } else {
        const cv = cleanString(iv);
        if (cv !== undefined) section[sub] = cv;
      }
    }
    (clean as any)[key] = section;
  }

  if (body.estado === "en_progreso" || body.estado === "completado") {
    clean.estado = body.estado;
  }
  if (typeof body.pasoActual === "number" && body.pasoActual >= 0 && body.pasoActual <= 50) {
    clean.pasoActual = body.pasoActual;
  }
  const notas = cleanString(body.notasFinales);
  if (notas !== undefined) clean.notasFinales = notas;

  return clean;
}

/**
 * Arma un system prompt de nivel experto a partir de la base de conocimiento del
 * onboarding. En vez de un volcado plano de datos, produce un prompt estructurado
 * (rol y misión, contexto, público, oferta, playbook de conversación, manejo de
 * objeciones, voz, guardrails, escalamiento, formato y ejemplos) para que el
 * agente no solo informe sino que conduzca la conversación hacia el objetivo.
 */
export function buildAgentSystemPrompt(data: OnboardingData): string {
  const lines: string[] = [];
  const push = (s: string = "") => lines.push(s);
  const section = (title: string, body?: () => void) => {
    push(`# ${title}`);
    body?.();
    push();
  };
  const bullet = (label: string, value: string) => {
    if (value?.trim()) push(`- ${label}: ${value.trim()}`);
  };
  const empresa = data.contacto.empresa || "la empresa";

  section("ROL Y MISIÓN", () => {
    push(
      `Eres el asistente comercial de ${empresa} y atiendes a sus clientes potenciales.`
    );
    push(
      "Tu misión no es solo responder: es guiar cada conversación hacia el siguiente paso del proceso comercial (calificar, resolver dudas y llevar al cliente a agendar, cotizar o comprar). Cada respuesta debe acercar a ese objetivo."
    );
    if (data.objetivos.objetivoPrincipalProyecto) {
      push(`Objetivo del negocio con este agente: ${data.objetivos.objetivoPrincipalProyecto.trim()}`);
    }
    if (data.identidadMarca.tagline) {
      push(`Tagline de la marca: ${data.identidadMarca.tagline.trim()}`);
    }
  });

  section("CONTEXTO DEL NEGOCIO", () => {
    bullet("Negocio", data.negocio.descripcionNegocio);
    bullet("Rubro", data.negocio.rubro);
    bullet("Productos y servicios", data.negocio.productosServicios);
    bullet("Diferenciador", data.negocio.diferenciadorCompetitivo);
    bullet("Ubicación", data.negocio.ubicacion);
    bullet("Historia de origen", data.identidadMarca.historiaOrigen);
    bullet("Prueba social (casos/testimonios/cifras)", data.identidadMarca.pruebaSocial);
  });

  section("A QUIÉN LE HABLAS", () => {
    bullet("Público objetivo", data.publico.publicoObjetivo);
    bullet("Rango de edad", data.publico.rangoEdad);
    bullet("Problema que resuelves", data.publico.problemasQueResuelve);
  });

  section("OFERTA Y CONDICIONES COMERCIALES", () => {
    bullet("Política de precios", data.flujoComercial.politicaPrecios);
    bullet("Métodos de pago", data.flujoComercial.metodosDePago);
    bullet("Tiempos de entrega", data.flujoComercial.tiemposEntrega);
    bullet("Garantías / devoluciones", data.flujoComercial.politicaGarantiasDevoluciones);
    push("Nunca inventes precios, plazos, promociones ni disponibilidad que no estén aquí. Si no lo sabes, ofrécele conectar con el equipo.");
  });

  section("PLAYBOOK DE CONVERSACIÓN", () => {
    if (data.flujoComercial.procesoVentaPasoAPaso) {
      push(`Proceso de venta a seguir: ${data.flujoComercial.procesoVentaPasoAPaso.trim()}`);
    }
    bullet("Canales de atención", data.flujoComercial.canalesAtencion);
    bullet("Tiempo de respuesta esperado", data.flujoComercial.tiempoRespuestaEsperado);
    if (data.objetivos.metricaConversion) {
      push(`Considera lograda una conversión cuando: ${data.objetivos.metricaConversion.trim()}. Orienta la conversación hacia ese resultado.`);
    }
    push("Haz una sola pregunta por turno. No avances de etapa sin la respuesta del cliente. Cierra cada mensaje con una pregunta o un próximo paso concreto.");
  });

  const objeciones = data.flujoComercial.objecionesComunes?.trim();
  if (objeciones) {
    section("MANEJO DE OBJECIONES", () => {
      push("Objeciones comunes y cómo abordarlas (valida, reconecta con el valor y propone el siguiente paso):");
      push(objeciones);
    });
  }

  section("VOZ Y ESTILO", () => {
    bullet("Arquetipo de marca", data.identidadMarca.arquetipo);
    bullet("Personalidad de marca", data.identidadMarca.personalidadMarca);
    bullet("Tono de voz", data.identidadMarca.tonoDeVoz);
    bullet("Mensajes clave a transmitir", data.identidadMarca.mensajesClave);
    bullet("Qué SÍ transmitir", data.identidadMarca.queSiDiceLaMarca);
    bullet("Qué NO decir", data.identidadMarca.queNoDiceLaMarca);
    bullet("Ejemplo de frase que SÍ diría la marca", data.identidadMarca.ejemploFraseSi);
    bullet("Ejemplo de frase que NUNCA diría la marca", data.identidadMarca.ejemploFraseNo);
    bullet("Palabras/temas prohibidos", data.identidadMarca.palabrasProhibidas);
  });

  section("GUARDRAILS", () => {
    bullet("Información que NUNCA debes compartir", data.baseConocimientoAgente.informacionQueNoDebeCompartir);
    bullet("Restricciones legales/regulatorias", data.baseConocimientoAgente.restriccionesLegales);
    push("No hagas promesas ni afirmaciones que no puedas respaldar con la información entregada. No inventes datos.");
  });

  const escala = data.baseConocimientoAgente.cuandoEscalarAHumano?.trim();
  const contactoEscala = data.baseConocimientoAgente.contactoEscalamiento?.trim();
  if (escala || contactoEscala) {
    section("ESCALAMIENTO", () => {
      if (escala) push(`Deriva a un humano cuando: ${escala}`);
      if (contactoEscala) push(`Contacto para escalar: ${contactoEscala}`);
    });
  }

  const infoSaber = data.baseConocimientoAgente.informacionQueDebeSaber?.trim();
  const faqs = data.flujoComercial.faqs.filter((f) => f.pregunta.trim());
  if (infoSaber || faqs.length > 0) {
    section("BASE DE CONOCIMIENTO", () => {
      if (infoSaber) push(infoSaber);
      if (faqs.length > 0) {
        push("Preguntas frecuentes:");
        faqs.forEach((f) => push(`- P: ${f.pregunta.trim()} → R: ${f.respuesta.trim()}`));
      }
    });
  }

  section("FORMATO DE RESPUESTA", () => {
    push("Responde breve y claro, adaptado al canal (WhatsApp/Instagram: 2-4 líneas). Una idea y una sola pregunta por mensaje. Siempre termina con un próximo paso.");
    bullet("Idioma(s) de atención", data.flujoComercial.idiomasAtencion);
    bullet("Horario de atención", data.flujoComercial.horarioAtencion);
  });

  const ejemplos = data.baseConocimientoAgente.ejemplosConversacionesIdeales?.trim();
  if (ejemplos) {
    section("EJEMPLOS DE CONVERSACIONES IDEALES", () => {
      push("Usa estos ejemplos como referencia de estilo y enfoque:");
      push(ejemplos);
    });
  }

  return lines.join("\n").trim();
}

export function toMarkdown(data: OnboardingData): string {
  const lines: string[] = [];
  const push = (s: string = "") => lines.push(s);
  const field = (label: string, value: string) => {
    push(`- **${label}:** ${value?.trim() ? value : "_(sin responder)_"}`);
  };

  push(`# Onboarding — ${data.contacto.empresa || "Cliente sin nombre"}`);
  push();
  push(`> Generado desde Impressive Studio Portal · ID \`${data.id}\` · Estado: **${data.estado}**`);
  push(`> Creado: ${new Date(data.createdAt).toLocaleString("es-CL")} · Última actualización: ${new Date(data.updatedAt).toLocaleString("es-CL")}`);
  push();

  push(`## 1. Datos de contacto`);
  field("Empresa", data.contacto.empresa);
  field("Nombre de contacto", data.contacto.nombreContacto);
  field("Cargo", data.contacto.cargo);
  field("Email", data.contacto.email);
  field("Teléfono", data.contacto.telefono);
  field("Sitio web", data.contacto.sitioWeb);
  field("Instagram", data.contacto.instagram);
  field("Otras redes", data.contacto.otrasRedes);
  push();

  push(`## 2. Negocio`);
  field("Rubro / industria", data.negocio.rubro);
  field("Descripción del negocio", data.negocio.descripcionNegocio);
  field("Años operando", data.negocio.aniosOperando);
  field("Ubicación", data.negocio.ubicacion);
  field("Productos / servicios", data.negocio.productosServicios);
  field("Diferenciador competitivo", data.negocio.diferenciadorCompetitivo);
  field("Principales competidores", data.negocio.principalesCompetidores);
  push();

  push(`## 3. Público objetivo`);
  field("Público objetivo", data.publico.publicoObjetivo);
  field("Rango de edad", data.publico.rangoEdad);
  field("Ubicación geográfica", data.publico.ubicacionGeografica);
  field("Problemas que resuelve la marca", data.publico.problemasQueResuelve);
  field("Dónde encuentra clientes hoy", data.publico.dondeEncuentraClientes);
  push();

  push(`## 4. Objetivos del proyecto`);
  field("Objetivo principal", data.objetivos.objetivoPrincipalProyecto);
  field("Cómo se medirá el éxito", data.objetivos.kpisImportantes);
  field("Qué cuenta como conversión", data.objetivos.metricaConversion);
  field("Resultados esperados en 90 días", data.objetivos.resultadosEsperados90dias);
  field("Presupuesto mensual aprox.", data.objetivos.presupuestoMensualAprox);
  field("Plazo de lanzamiento deseado", data.objetivos.plazoLanzamiento);
  push();

  push(`## 5. Manual de identidad de marca`);
  field("Misión", data.identidadMarca.mision);
  field("Visión", data.identidadMarca.vision);
  field("Valores", data.identidadMarca.valores);
  field("Arquetipo de marca", data.identidadMarca.arquetipo);
  field("Personalidad de marca", data.identidadMarca.personalidadMarca);
  field("Tagline / eslogan", data.identidadMarca.tagline);
  field("Mensajes clave", data.identidadMarca.mensajesClave);
  field("Historia de origen", data.identidadMarca.historiaOrigen);
  field("Prueba social", data.identidadMarca.pruebaSocial);
  field("Tono de voz", data.identidadMarca.tonoDeVoz);
  field("Qué SÍ dice la marca", data.identidadMarca.queSiDiceLaMarca);
  field("Qué NO dice la marca", data.identidadMarca.queNoDiceLaMarca);
  field("Ejemplo de frase que SÍ diría", data.identidadMarca.ejemploFraseSi);
  field("Ejemplo de frase que NUNCA diría", data.identidadMarca.ejemploFraseNo);
  field("Colores de marca", data.identidadMarca.coloresMarca);
  field("Tipografía de marca", data.identidadMarca.tipografiaMarca);
  field("Link logo", data.identidadMarca.logoLink);
  field("Link manual de marca existente", data.identidadMarca.manualMarcaLink);
  field("Referentes / inspiración", data.identidadMarca.referentesInspiracion);
  field("Palabras / temas prohibidos", data.identidadMarca.palabrasProhibidas);
  push();

  push(`## 6. Flujo comercial`);
  field("Cómo llegan los leads hoy", data.flujoComercial.comoLleganLeads);
  field("Canales de atención", data.flujoComercial.canalesAtencion);
  field("Proceso de venta paso a paso", data.flujoComercial.procesoVentaPasoAPaso);
  field("Tiempo de respuesta esperado", data.flujoComercial.tiempoRespuestaEsperado);
  field("Objeciones comunes", data.flujoComercial.objecionesComunes);
  field("Política de precios", data.flujoComercial.politicaPrecios);
  field("Política de garantías / devoluciones", data.flujoComercial.politicaGarantiasDevoluciones);
  field("Métodos de pago", data.flujoComercial.metodosDePago);
  field("Tiempos de entrega", data.flujoComercial.tiemposEntrega);
  field("Proceso post-venta", data.flujoComercial.procesoPostVenta);
  field("Idiomas de atención", data.flujoComercial.idiomasAtencion);
  field("Horario de atención", data.flujoComercial.horarioAtencion);
  push();
  push(`### Preguntas frecuentes`);
  const faqs = data.flujoComercial.faqs.filter((f) => f.pregunta.trim() || f.respuesta.trim());
  if (faqs.length === 0) {
    push("_(sin preguntas frecuentes registradas)_");
  } else {
    faqs.forEach((f) => {
      push(`**P: ${f.pregunta || "(sin pregunta)"}**`);
      push(`R: ${f.respuesta || "(sin respuesta)"}`);
      push();
    });
  }

  push(`## 7. Base de conocimiento para agentes`);
  field("Información que el agente debe saber", data.baseConocimientoAgente.informacionQueDebeSaber);
  field("Información que NO debe compartir", data.baseConocimientoAgente.informacionQueNoDebeCompartir);
  field("Cuándo escalar a un humano", data.baseConocimientoAgente.cuandoEscalarAHumano);
  field("Contacto para escalamiento", data.baseConocimientoAgente.contactoEscalamiento);
  field("Ejemplos de conversaciones ideales", data.baseConocimientoAgente.ejemplosConversacionesIdeales);
  field("Restricciones legales / regulatorias", data.baseConocimientoAgente.restriccionesLegales);
  push();

  push(`## 8. Accesos y credenciales`);
  const accesos = data.accesos.plataformas.filter((a) => a.plataforma.trim());
  if (accesos.length === 0) {
    push("_(sin accesos registrados)_");
  } else {
    accesos.forEach((a) => {
      push(`- **${a.plataforma}** — cómo compartir: ${a.comoCompartir || "N/A"}${a.notas ? ` — notas: ${a.notas}` : ""}`);
    });
  }
  field("Notas generales de accesos", data.accesos.notasAccesos);
  push();

  push(`## 9. Adjuntos y links`);
  field("Manual/brand guideline", data.adjuntos.brandGuidelineLink);
  field("Logos", data.adjuntos.logosLink);
  field("Fotos / material visual", data.adjuntos.fotosLink);
  field("Otros links", data.adjuntos.otrosLinks);
  push();

  push(`## 10. Notas finales`);
  push(data.notasFinales?.trim() ? data.notasFinales : "_(sin notas)_");
  push();

  return lines.join("\n");
}
