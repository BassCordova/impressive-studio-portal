import Link from "next/link";
import { notFound } from "next/navigation";
import { getOnboarding } from "@/lib/onboarding-store";

export const dynamic = "force-dynamic";

function Section({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-lg border border-gris-medio bg-gris-oscuro p-6">
      <h2 className="font-display text-2xl tracking-wide">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs uppercase tracking-widest text-gris-suave">{label}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-blanco">
              {value?.trim() ? value : <span className="text-gris-claro">Sin responder</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function OnboardingDetailPage({ params }: { params: { id: string } }) {
  const o = await getOnboarding(params.id);
  if (!o) notFound();

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gris-medio pb-6">
        <div>
          <Link href="/portal/onboarding" className="text-xs uppercase tracking-widest text-gris-suave hover:text-blanco">
            ← Onboarding
          </Link>
          <h1 className="mt-2 font-display text-4xl tracking-wide">
            {o.contacto.empresa || "Cliente sin nombre"}
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-gris-suave">
            Estado: {o.estado} · ID {o.id}
          </p>
        </div>
        <div className="flex gap-3">
          <a href={`/api/onboarding/${o.id}/export`} className="btn-rojo">
            Descargar .md
          </a>
          <a
            href={`/onb/${o.id}`}
            target="_blank"
            className="rounded-lg border border-gris-medio px-5 py-2.5 text-sm"
          >
            Abrir formulario
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Section
          title="1. Contacto"
          rows={[
            ["Empresa", o.contacto.empresa],
            ["Nombre de contacto", o.contacto.nombreContacto],
            ["Cargo", o.contacto.cargo],
            ["Email", o.contacto.email],
            ["Teléfono", o.contacto.telefono],
            ["Sitio web", o.contacto.sitioWeb],
            ["Instagram", o.contacto.instagram],
            ["Otras redes", o.contacto.otrasRedes],
          ]}
        />
        <Section
          title="2. Negocio"
          rows={[
            ["Rubro / industria", o.negocio.rubro],
            ["Descripción del negocio", o.negocio.descripcionNegocio],
            ["Años operando", o.negocio.aniosOperando],
            ["Ubicación", o.negocio.ubicacion],
            ["Productos / servicios", o.negocio.productosServicios],
            ["Diferenciador competitivo", o.negocio.diferenciadorCompetitivo],
            ["Principales competidores", o.negocio.principalesCompetidores],
          ]}
        />
        <Section
          title="3. Público objetivo"
          rows={[
            ["Público objetivo", o.publico.publicoObjetivo],
            ["Rango de edad", o.publico.rangoEdad],
            ["Ubicación geográfica", o.publico.ubicacionGeografica],
            ["Problemas que resuelve", o.publico.problemasQueResuelve],
            ["Dónde encuentra clientes hoy", o.publico.dondeEncuentraClientes],
          ]}
        />
        <Section
          title="4. Objetivos del proyecto"
          rows={[
            ["Objetivo principal", o.objetivos.objetivoPrincipalProyecto],
            ["KPIs importantes", o.objetivos.kpisImportantes],
            ["Resultados esperados en 90 días", o.objetivos.resultadosEsperados90dias],
            ["Presupuesto mensual aprox.", o.objetivos.presupuestoMensualAprox],
            ["Plazo de lanzamiento", o.objetivos.plazoLanzamiento],
          ]}
        />
        <Section
          title="5. Identidad de marca"
          rows={[
            ["Misión", o.identidadMarca.mision],
            ["Visión", o.identidadMarca.vision],
            ["Valores", o.identidadMarca.valores],
            ["Personalidad de marca", o.identidadMarca.personalidadMarca],
            ["Tono de voz", o.identidadMarca.tonoDeVoz],
            ["Qué SÍ dice la marca", o.identidadMarca.queSiDiceLaMarca],
            ["Qué NO dice la marca", o.identidadMarca.queNoDiceLaMarca],
            ["Colores de marca", o.identidadMarca.coloresMarca],
            ["Tipografía de marca", o.identidadMarca.tipografiaMarca],
            ["Link logo", o.identidadMarca.logoLink],
            ["Link manual de marca existente", o.identidadMarca.manualMarcaLink],
            ["Referentes / inspiración", o.identidadMarca.referentesInspiracion],
            ["Palabras / temas prohibidos", o.identidadMarca.palabrasProhibidas],
          ]}
        />
        <Section
          title="6. Flujo comercial"
          rows={[
            ["Cómo llegan los leads hoy", o.flujoComercial.comoLleganLeads],
            ["Canales de atención", o.flujoComercial.canalesAtencion],
            ["Proceso de venta paso a paso", o.flujoComercial.procesoVentaPasoAPaso],
            ["Tiempo de respuesta esperado", o.flujoComercial.tiempoRespuestaEsperado],
            ["Objeciones comunes", o.flujoComercial.objecionesComunes],
            ["Política de precios", o.flujoComercial.politicaPrecios],
            ["Política de garantías / devoluciones", o.flujoComercial.politicaGarantiasDevoluciones],
            ["Métodos de pago", o.flujoComercial.metodosDePago],
            ["Tiempos de entrega", o.flujoComercial.tiemposEntrega],
            ["Proceso post-venta", o.flujoComercial.procesoPostVenta],
          ]}
        />
        <Section
          title="7. Base de conocimiento para agentes"
          rows={[
            ["Info. que el agente debe saber", o.baseConocimientoAgente.informacionQueDebeSaber],
            ["Info. que NO debe compartir", o.baseConocimientoAgente.informacionQueNoDebeCompartir],
            ["Cuándo escalar a humano", o.baseConocimientoAgente.cuandoEscalarAHumano],
            ["Contacto para escalamiento", o.baseConocimientoAgente.contactoEscalamiento],
            ["Ejemplos de conversaciones ideales", o.baseConocimientoAgente.ejemplosConversacionesIdeales],
            ["Restricciones legales / regulatorias", o.baseConocimientoAgente.restriccionesLegales],
          ]}
        />
        <Section
          title="9. Adjuntos y links"
          rows={[
            ["Manual / brand guideline", o.adjuntos.brandGuidelineLink],
            ["Logos", o.adjuntos.logosLink],
            ["Fotos / material visual", o.adjuntos.fotosLink],
            ["Otros links", o.adjuntos.otrosLinks],
          ]}
        />
      </div>

      <div className="mt-6 rounded-lg border border-gris-medio bg-gris-oscuro p-6">
        <h2 className="font-display text-2xl tracking-wide">Preguntas frecuentes</h2>
        <div className="mt-4 space-y-3">
          {o.flujoComercial.faqs.filter((f) => f.pregunta.trim() || f.respuesta.trim()).length === 0 ? (
            <p className="text-sm text-gris-claro">Sin preguntas frecuentes registradas.</p>
          ) : (
            o.flujoComercial.faqs.map((f, i) => (
              <div key={i} className="rounded-md bg-negro p-4">
                <p className="text-sm font-medium text-blanco">P: {f.pregunta || "(sin pregunta)"}</p>
                <p className="mt-1 text-sm text-gris-suave">R: {f.respuesta || "(sin respuesta)"}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gris-medio bg-gris-oscuro p-6">
        <h2 className="font-display text-2xl tracking-wide">Accesos y credenciales</h2>
        <div className="mt-4 space-y-3">
          {o.accesos.plataformas.filter((a) => a.plataforma.trim()).length === 0 ? (
            <p className="text-sm text-gris-claro">Sin accesos registrados.</p>
          ) : (
            o.accesos.plataformas.map((a, i) => (
              <div key={i} className="rounded-md bg-negro p-4 text-sm">
                <p className="font-medium text-blanco">{a.plataforma}</p>
                <p className="mt-1 text-gris-suave">Cómo compartir: {a.comoCompartir || "N/A"}</p>
                {a.notas && <p className="mt-1 text-gris-suave">Notas: {a.notas}</p>}
              </div>
            ))
          )}
          {o.accesos.notasAccesos && (
            <p className="text-sm text-gris-suave">Notas generales: {o.accesos.notasAccesos}</p>
          )}
        </div>
      </div>

      {o.notasFinales && (
        <div className="mt-6 rounded-lg border border-gris-medio bg-gris-oscuro p-6">
          <h2 className="font-display text-2xl tracking-wide">Notas finales</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm text-gris-suave">{o.notasFinales}</p>
        </div>
      )}
    </main>
  );
}
