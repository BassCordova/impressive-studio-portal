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
    resultadosEsperados90dias: string;
    presupuestoMensualAprox: string;
    plazoLanzamiento: string;
  };

  identidadMarca: {
    mision: string;
    vision: string;
    valores: string;
    personalidadMarca: string;
    tonoDeVoz: string;
    queSiDiceLaMarca: string;
    queNoDiceLaMarca: string;
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
      resultadosEsperados90dias: "",
      presupuestoMensualAprox: "",
      plazoLanzamiento: "",
    },
    identidadMarca: {
      mision: "",
      vision: "",
      valores: "",
      personalidadMarca: "",
      tonoDeVoz: "",
      queSiDiceLaMarca: "",
      queNoDiceLaMarca: "",
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
  field("KPIs importantes", data.objetivos.kpisImportantes);
  field("Resultados esperados en 90 días", data.objetivos.resultadosEsperados90dias);
  field("Presupuesto mensual aprox.", data.objetivos.presupuestoMensualAprox);
  field("Plazo de lanzamiento deseado", data.objetivos.plazoLanzamiento);
  push();

  push(`## 5. Manual de identidad de marca`);
  field("Misión", data.identidadMarca.mision);
  field("Visión", data.identidadMarca.vision);
  field("Valores", data.identidadMarca.valores);
  field("Personalidad de marca", data.identidadMarca.personalidadMarca);
  field("Tono de voz", data.identidadMarca.tonoDeVoz);
  field("Qué SÍ dice la marca", data.identidadMarca.queSiDiceLaMarca);
  field("Qué NO dice la marca", data.identidadMarca.queNoDiceLaMarca);
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
