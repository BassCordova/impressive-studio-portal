export type SectionKey =
  | "contacto"
  | "negocio"
  | "publico"
  | "objetivos"
  | "identidadMarca"
  | "flujoComercial"
  | "baseConocimientoAgente"
  | "accesos"
  | "adjuntos";

export type FieldDef = { key: string; label: string; type: "text" | "textarea" };

export type StepConfig = {
  section: SectionKey;
  title: string;
  intro: string;
  fields: FieldDef[];
};

export const steps: StepConfig[] = [
  {
    section: "contacto",
    title: "Datos de contacto",
    intro: "Para saber a quién contactar y cómo.",
    fields: [
      { key: "empresa", label: "Nombre de la empresa", type: "text" },
      { key: "nombreContacto", label: "Nombre del contacto principal", type: "text" },
      { key: "cargo", label: "Cargo del contacto", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "telefono", label: "Teléfono / WhatsApp", type: "text" },
      { key: "sitioWeb", label: "Sitio web", type: "text" },
      { key: "instagram", label: "Instagram", type: "text" },
      { key: "otrasRedes", label: "Otras redes sociales", type: "text" },
    ],
  },
  {
    section: "negocio",
    title: "El negocio",
    intro: "Cuéntanos a qué se dedica la empresa.",
    fields: [
      { key: "rubro", label: "Rubro / industria", type: "text" },
      { key: "descripcionNegocio", label: "Descripción del negocio", type: "textarea" },
      { key: "aniosOperando", label: "Años operando", type: "text" },
      { key: "ubicacion", label: "Ubicación", type: "text" },
      { key: "productosServicios", label: "Productos / servicios que ofrecen", type: "textarea" },
      { key: "diferenciadorCompetitivo", label: "¿Qué los diferencia de la competencia?", type: "textarea" },
      { key: "principalesCompetidores", label: "Principales competidores", type: "text" },
    ],
  },
  {
    section: "publico",
    title: "Público objetivo",
    intro: "A quién le hablamos.",
    fields: [
      { key: "publicoObjetivo", label: "Describe a tu cliente ideal", type: "textarea" },
      { key: "rangoEdad", label: "Rango de edad", type: "text" },
      { key: "ubicacionGeografica", label: "Ubicación geográfica del público", type: "text" },
      { key: "problemasQueResuelve", label: "¿Qué problema le resuelve tu marca?", type: "textarea" },
      { key: "dondeEncuentraClientes", label: "¿Dónde encuentras clientes hoy?", type: "textarea" },
    ],
  },
  {
    section: "objetivos",
    title: "Objetivos del proyecto",
    intro: "Qué queremos lograr juntos.",
    fields: [
      { key: "objetivoPrincipalProyecto", label: "Objetivo principal de este proyecto", type: "textarea" },
      { key: "kpisImportantes", label: "KPIs / métricas que más te importan", type: "textarea" },
      { key: "resultadosEsperados90dias", label: "Resultados esperados en 90 días", type: "textarea" },
      { key: "presupuestoMensualAprox", label: "Presupuesto mensual aproximado", type: "text" },
      { key: "plazoLanzamiento", label: "Plazo de lanzamiento deseado", type: "text" },
    ],
  },
  {
    section: "identidadMarca",
    title: "Identidad de marca",
    intro: "La base para el manual de marca.",
    fields: [
      { key: "mision", label: "Misión", type: "textarea" },
      { key: "vision", label: "Visión", type: "textarea" },
      { key: "valores", label: "Valores de la marca", type: "textarea" },
      { key: "personalidadMarca", label: "Personalidad de marca (adjetivos)", type: "text" },
      { key: "tonoDeVoz", label: "Tono de voz (formal, cercano, divertido...)", type: "textarea" },
      { key: "queSiDiceLaMarca", label: "Qué SÍ dice / representa la marca", type: "textarea" },
      { key: "queNoDiceLaMarca", label: "Qué NO dice / evita la marca", type: "textarea" },
      { key: "coloresMarca", label: "Colores de marca (hex si los tienes)", type: "text" },
      { key: "tipografiaMarca", label: "Tipografía de marca", type: "text" },
      { key: "logoLink", label: "Link al logo", type: "text" },
      { key: "manualMarcaLink", label: "Link a manual de marca existente (si hay)", type: "text" },
      { key: "referentesInspiracion", label: "Marcas / referentes de inspiración", type: "text" },
      { key: "palabrasProhibidas", label: "Palabras o temas prohibidos", type: "textarea" },
    ],
  },
  {
    section: "flujoComercial",
    title: "Flujo comercial",
    intro: "Cómo venden hoy, para que el agente lo replique.",
    fields: [
      { key: "comoLleganLeads", label: "¿Cómo llegan los leads hoy?", type: "textarea" },
      { key: "canalesAtencion", label: "Canales de atención (WhatsApp, IG, mail...)", type: "text" },
      { key: "procesoVentaPasoAPaso", label: "Proceso de venta, paso a paso", type: "textarea" },
      { key: "tiempoRespuestaEsperado", label: "Tiempo de respuesta esperado", type: "text" },
      { key: "objecionesComunes", label: "Objeciones comunes de clientes", type: "textarea" },
      { key: "politicaPrecios", label: "Política de precios", type: "textarea" },
      { key: "politicaGarantiasDevoluciones", label: "Política de garantías / devoluciones", type: "textarea" },
      { key: "metodosDePago", label: "Métodos de pago aceptados", type: "text" },
      { key: "tiemposEntrega", label: "Tiempos de entrega", type: "text" },
      { key: "procesoPostVenta", label: "Proceso post-venta", type: "textarea" },
    ],
  },
  {
    section: "baseConocimientoAgente",
    title: "Base de conocimiento para el agente",
    intro: "Lo que el agente de IA debe (y no debe) saber.",
    fields: [
      { key: "informacionQueDebeSaber", label: "Información clave que el agente debe saber", type: "textarea" },
      { key: "informacionQueNoDebeCompartir", label: "Información que NUNCA debe compartir", type: "textarea" },
      { key: "cuandoEscalarAHumano", label: "¿Cuándo debe derivar a un humano?", type: "textarea" },
      { key: "contactoEscalamiento", label: "Contacto para escalamiento", type: "text" },
      { key: "ejemplosConversacionesIdeales", label: "Ejemplos de respuestas o conversaciones ideales", type: "textarea" },
      { key: "restriccionesLegales", label: "Restricciones legales o regulatorias del rubro", type: "textarea" },
    ],
  },
  {
    section: "accesos",
    title: "Accesos y credenciales",
    intro: "Qué plataformas necesitamos y cómo nos las compartirás.",
    fields: [{ key: "notasAccesos", label: "Notas generales sobre accesos", type: "textarea" }],
  },
  {
    section: "adjuntos",
    title: "Adjuntos y notas finales",
    intro: "Últimos detalles.",
    fields: [
      { key: "brandGuidelineLink", label: "Link a manual/brand guideline", type: "text" },
      { key: "logosLink", label: "Link a logos", type: "text" },
      { key: "fotosLink", label: "Link a fotos / material visual", type: "text" },
      { key: "otrosLinks", label: "Otros links relevantes", type: "text" },
    ],
  },
];
