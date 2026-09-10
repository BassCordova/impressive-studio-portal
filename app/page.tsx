"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import "./landing.css";

const PROCESO_TABS = [
  {
    label: "Branding",
    steps: [
      { n: "01", title: "Diagnóstico", desc: "Entendemos tu negocio, tu mercado y cómo te percibe hoy tu audiencia. Identificamos la brecha entre quién sos y cómo te ven." },
      { n: "02", title: "Estrategia", desc: "Definimos posicionamiento, arquetipo de marca y diferenciación. La base sobre la que se construye todo lo demás." },
      { n: "03", title: "Identidad visual", desc: "Diseñamos el sistema de marca: logo, tipografía, color, y todos los elementos que la hacen reconocible al instante." },
      { n: "04", title: "Manual de marca", desc: "Documentamos cada decisión en un manual claro, para que la marca se aplique con consistencia en cualquier canal." },
      { n: "05", title: "Entrega", desc: "Entrega de todos los activos y lineamientos, listos para usar en contenido, eventos y cualquier punto de contacto." },
    ],
  },
  {
    label: "Producción Audiovisual",
    steps: [
      { n: "01", title: "Diagnóstico", desc: "Entendemos tu marca, tu mercado y qué tipo de pieza generará el mayor impacto. Definimos objetivos claros antes de tocar una cámara." },
      { n: "02", title: "Concepto", desc: "Desarrollamos la idea creativa, el guión técnico, la estética visual y el plan de rodaje. Todo aprobado por vos antes de producir." },
      { n: "03", title: "Rodaje", desc: "Producción completa con equipo cinematográfico. Dirección, iluminación y captura en el nivel de calidad que define a Impressive." },
      { n: "04", title: "Postproducción", desc: "Edición, color grading cinematográfico, diseño de sonido y motion graphics. Cada cuadro tratado como si fuera para cine." },
      { n: "05", title: "Entrega", desc: "Entrega en todos los formatos necesarios, con revisiones incluidas. La pieza lista para publicar, pautar o presentar." },
    ],
  },
  {
    label: "Eventos",
    steps: [
      { n: "01", title: "Concepto", desc: "Definimos el objetivo del evento, la audiencia y la experiencia que queremos que viva cada asistente, antes de pensar en logística." },
      { n: "02", title: "Diseño de experiencia", desc: "Diseñamos el recorrido completo: espacio, momentos clave, activaciones de marca y el hilo narrativo del evento." },
      { n: "03", title: "Producción", desc: "Coordinamos proveedores, logística, timing y producción técnica. Cada detalle resuelto antes de que el evento empiece." },
      { n: "04", title: "Ejecución", desc: "El día del evento, dirección creativa y producción en vivo, con cobertura audiovisual profesional de principio a fin." },
      { n: "05", title: "Entrega", desc: "Contenido del evento editado y listo para usar como pieza de marca — porque la experiencia también es contenido." },
    ],
  },
];

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#ideas", label: "Ideas" },
];

function smoothScrollTo(id: string) {
  const target = document.querySelector(id);
  if (!target) return;
  const navH = 68;
  const top = target.getBoundingClientRect().top + window.scrollY - navH;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const els = rootRef.current.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setMobileOpen(false);
    smoothScrollTo(href);
  }

  return (
    <div className="is-page" ref={rootRef}>
      {/* NAV */}
      <nav id="nav" className={scrolled ? "scrolled" : ""}>
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <span className="logo-impressive"><span className="teal">I</span>MPRESS<span className="teal">I</span>V<span className="teal">E</span></span>
          <span className="logo-studio">STUDIO</span>
        </a>
        <ul className="nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l.href}><a href={l.href} onClick={(e) => handleNavClick(e, l.href)}>{l.label}</a></li>
          ))}
          <li><a href="#contacto" className="nav-cta" onClick={(e) => handleNavClick(e, "#contacto")}>Hablemos</a></li>
        </ul>
        <button className="hamburger" aria-label="Abrir menú" onClick={() => setMobileOpen(true)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* MOBILE OVERLAY */}
      <div className={`mobile-overlay${mobileOpen ? " open" : ""}`}>
        <button className="mobile-close" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)}>✕</button>
        <ul>
          {NAV_LINKS.map((l) => (
            <li key={l.href}><a href={l.href} onClick={(e) => handleNavClick(e, l.href)}>{l.label}</a></li>
          ))}
          <li><a href="#contacto" onClick={(e) => handleNavClick(e, "#contacto")}>Hablemos</a></li>
        </ul>
      </div>

      {/* HERO */}
      <section id="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">Branding · Producción Audiovisual · Eventos</p>
          <h1 className="hero-h1">Nothing <em>Impressive.</em><br />Happens by accident.</h1>
          <p className="hero-sub">Diseñamos marca, producimos contenido cinematográfico y creamos experiencias en vivo. Cada decisión es intencional — nada queda librado al azar.</p>
          <div className="hero-ctas">
            <a href="#contacto" className="btn-primary" onClick={(e) => handleNavClick(e, "#contacto")}>Iniciar un proyecto</a>
            <a href="#portfolio" className="btn-secondary" onClick={(e) => handleNavClick(e, "#portfolio")}>Ver trabajo</a>
          </div>
        </div>
        <div className="scroll-indicator"><span className="scroll-line"></span></div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="section">
        <div className="is-container nosotros-grid">
          <div className="nosotros-text reveal">
            <p className="eyebrow">El estudio</p>
            <h2>Lo impresionante nunca es <em>casualidad.</em></h2>
            <p className="body-text">Impressive Studio es un estudio integral de branding, producción audiovisual y producción de eventos y experiencias. Diseñamos identidades de marca, filmamos piezas de nivel cinematográfico y creamos experiencias en vivo que la gente recuerda — todo bajo una misma dirección creativa.</p>
            <p className="body-text">No creemos en el contenido improvisado ni en los eventos genéricos. Cada campaña, cada comercial, cada experiencia se construye con la misma precisión: nada impresionante pasa por accidente.</p>
            <p className="body-text emphasis">Branding. Producción Audiovisual. Eventos y Experiencias. Una sola visión creativa.</p>
          </div>
          <div className="nosotros-stats reveal">
            <div className="stats-grid">
              <div className="stat-block"><span className="stat-number">50+</span><span className="stat-label">Proyectos realizados</span></div>
              <div className="stat-block"><span className="stat-number">3</span><span className="stat-label">Disciplinas integradas</span></div>
              <div className="stat-block"><span className="stat-number">30+</span><span className="stat-label">Marcas acompañadas</span></div>
              <div className="stat-block"><span className="stat-number">100%</span><span className="stat-label">Intencional</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="section">
        <div className="is-container">
          <div className="section-intro reveal">
            <p className="eyebrow">Servicios</p>
            <h2>Tres disciplinas, una sola dirección creativa</h2>
            <p className="section-sub">No hacemos de todo para todos. Hacemos tres cosas con precisión quirúrgica — marca, contenido y experiencias — y las tres trabajan juntas.</p>
          </div>
          <div className="servicios-grid">
            <div className="servicio-card reveal">
              <span className="card-number">01</span>
              <p className="card-tag">Identidad de marca</p>
              <h3>Branding</h3>
              <p className="card-desc">Construimos identidades de marca completas — desde la estrategia hasta el sistema visual — para marcas que quieren dejar de competir por precio y empezar a competir por percepción.</p>
              <ul className="card-includes">
                <li>Estrategia de marca y posicionamiento</li>
                <li>Identidad visual y sistema de marca</li>
                <li>Manual de marca y guidelines</li>
                <li>Naming y arquitectura de marca</li>
                <li>Tono de voz y mensajes clave</li>
              </ul>
              <a href="#contacto" className="card-cta" onClick={(e) => handleNavClick(e, "#contacto")}>Cotizar proyecto →</a>
            </div>
            <div className="servicio-card reveal">
              <span className="card-number">02</span>
              <p className="card-tag">Contenido cinematográfico</p>
              <h3>Producción Audiovisual</h3>
              <p className="card-desc">Producimos campañas de contenido completas, comerciales y piezas cinematográficas que comunican con la intención de una película, no de un video improvisado.</p>
              <ul className="card-includes">
                <li>Campañas de contenido completas</li>
                <li>Comerciales y brand films</li>
                <li>Preproducción, rodaje y postproducción</li>
                <li>Color grading y diseño de sonido</li>
                <li>Todos los formatos · Reels, spots, redes</li>
              </ul>
              <a href="#contacto" className="card-cta" onClick={(e) => handleNavClick(e, "#contacto")}>Hablar de contenido →</a>
            </div>
            <div className="servicio-card reveal">
              <span className="card-number">03</span>
              <p className="card-tag">Experiencias en vivo</p>
              <h3>Eventos y Experiencias</h3>
              <p className="card-desc">Diseñamos y producimos eventos y experiencias de marca de principio a fin — porque una experiencia bien diseñada también es una pieza de branding.</p>
              <ul className="card-includes">
                <li>Concepto y dirección creativa del evento</li>
                <li>Producción integral · logística y proveedores</li>
                <li>Diseño de experiencia y recorrido del asistente</li>
                <li>Cobertura audiovisual del evento</li>
                <li>Activaciones de marca en vivo</li>
              </ul>
              <a href="#contacto" className="card-cta" onClick={(e) => handleNavClick(e, "#contacto")}>Producir un evento →</a>
            </div>
          </div>
          <div className="meta-ads-strip reveal">
            <p>¿Ya tenés contenido que se merece ser visto? También manejamos <strong className="teal">Meta Ads</strong> — pauta estratégica para amplificar lo que producimos.</p>
            <a href="#contacto" className="link-arrow" onClick={(e) => handleNavClick(e, "#contacto")}>Hablar de pauta →</a>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" className="section">
        <div className="is-container">
          <div className="section-intro reveal">
            <p className="eyebrow">Proceso</p>
            <h2>Un proceso claro. Nada al azar.</h2>
            <p className="section-sub">Tres disciplinas, un mismo principio: sabés exactamente en qué etapa estás, qué sigue y cuándo verás resultados.</p>
          </div>
          <div className="tabs-nav reveal">
            {PROCESO_TABS.map((tab, i) => (
              <button
                key={tab.label}
                className={`tab-btn${activeTab === i ? " active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {PROCESO_TABS.map((tab, i) => (
            <div key={tab.label} className={`tab-panel${activeTab === i ? " active" : ""}`}>
              <div className="steps-grid">
                {tab.steps.map((s) => (
                  <div className="step-block" key={s.n}>
                    <span className="step-num">{s.n}</span>
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="section">
        <div className="is-container">
          <div className="section-intro reveal">
            <p className="eyebrow">Portfolio</p>
            <h2>El trabajo habla.</h2>
            <p className="section-sub">Una selección de proyectos que muestran lo que pasa cuando calidad de producción y estrategia se unen.</p>
          </div>
          <div className="portfolio-grid reveal">
            <div className="portfolio-item item-large">
              <div className="portfolio-bg" style={{ backgroundColor: "#111" }}></div>
              <div className="portfolio-overlay"></div>
              <div className="portfolio-info">
                <p className="portfolio-client">VENUM SOCIETY</p>
                <h3>Brand Film · Producción DFY</h3>
                <p className="portfolio-type">Producción Audiovisual</p>
              </div>
            </div>
            <div className="portfolio-item item-medium">
              <div className="portfolio-bg" style={{ backgroundColor: "#0f1a16" }}></div>
              <div className="portfolio-overlay"></div>
              <div className="portfolio-info">
                <p className="portfolio-client">CLIENTE 02</p>
                <h3>Activación de marca en vivo</h3>
                <p className="portfolio-type">Eventos y Experiencias</p>
              </div>
            </div>
            <div className="portfolio-item item-small-a">
              <div className="portfolio-bg" style={{ backgroundColor: "#181818" }}></div>
              <div className="portfolio-overlay"></div>
              <div className="portfolio-info">
                <p className="portfolio-client">CLIENTE 03</p>
                <h3>Reels de producto</h3>
                <p className="portfolio-type">Producción Audiovisual</p>
              </div>
            </div>
            <div className="portfolio-item item-small-b">
              <div className="portfolio-bg" style={{ backgroundColor: "#0c0c0c" }}></div>
              <div className="portfolio-overlay"></div>
              <div className="portfolio-info">
                <p className="portfolio-client">CLIENTE 04</p>
                <h3>Sistema de identidad visual</h3>
                <p className="portfolio-type">Branding</p>
              </div>
            </div>
          </div>
          <div className="section-cta reveal">
            <a href="#contacto" className="btn-primary" onClick={(e) => handleNavClick(e, "#contacto")}>Iniciar un proyecto →</a>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="section">
        <div className="is-container">
          <div className="section-intro reveal">
            <p className="eyebrow">Clientes</p>
            <h2>Lo que dicen quienes <em>confiaron</em></h2>
          </div>
          <div className="testimonios-grid">
            <div className="testimonio-card reveal">
              <div className="stars">★★★★★</div>
              <p className="cita">&quot;El nivel de producción que lograron para nuestra marca superó todo lo que habíamos visto en el mercado local. No solo filmaron — entendieron exactamente qué queríamos comunicar.&quot;</p>
              <div className="testimonio-author">
                <div className="avatar">MR</div>
                <div><p className="author-name">Martín Rodríguez</p><p className="author-company">Fundador, Empresa 01</p></div>
              </div>
            </div>
            <div className="testimonio-card reveal">
              <div className="stars">★★★★★</div>
              <p className="cita">&quot;Desde que implementamos el sistema de Meta Ads con Impressive, nuestro costo por lead bajó un 40%. La calidad de los leads mejoró porque las creatividades atraen al cliente correcto.&quot;</p>
              <div className="testimonio-author">
                <div className="avatar">CP</div>
                <div><p className="author-name">Carolina Pérez</p><p className="author-company">CEO, Empresa 02</p></div>
              </div>
            </div>
            <div className="testimonio-card reveal">
              <div className="stars">★★★★★</div>
              <p className="cita">&quot;El evento que produjeron no fue solo una fiesta — fue una pieza de marca completa. Desde el diseño de la experiencia hasta cada detalle audiovisual, se sintió 100% Impressive.&quot;</p>
              <div className="testimonio-author">
                <div className="avatar">JL</div>
                <div><p className="author-name">Jorge López</p><p className="author-company">Director de Marketing, Empresa 03</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IDEAS */}
      <section id="ideas" className="section">
        <div className="is-container">
          <div className="section-intro-row reveal">
            <div>
              <p className="eyebrow">Ideas</p>
              <h2>El estudio piensa en <em>voz alta</em></h2>
            </div>
            <a href="https://www.youtube.com/@impressivestudio" target="_blank" rel="noopener" className="link-arrow">Ver canal →</a>
          </div>
          <div className="ideas-grid">
            <div className="idea-card reveal">
              <div className="video-wrapper">
                <iframe src="https://www.youtube.com/embed/7MXlaz0fGso" title="Cómo se produce una marca, no un video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy"></iframe>
              </div>
              <p className="idea-tag">Producción · Behind the scenes</p>
              <h4>Cómo se produce una marca, no un video</h4>
              <p className="idea-desc">Este fue el proyecto Venum Society. Lo que ves no es solo una pieza cinematográfica — es el resultado de entender que cada cuadro tiene que comunicar algo. Detrás de cada toma hay una decisión de marca.</p>
              <a href="https://www.youtube.com/watch?v=7MXlaz0fGso" target="_blank" rel="noopener" className="card-cta">Ver en YouTube →</a>
            </div>
            <div className="idea-card reveal">
              <div className="video-wrapper">
                <iframe src="https://www.youtube.com/embed/Tu0aO6Wfo-Q" title="La imagen que tenés es el precio que podés cobrar" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy"></iframe>
              </div>
              <p className="idea-tag">Estrategia · Marca visual</p>
              <h4>La imagen que tenés es el precio que podés cobrar</h4>
              <p className="idea-desc">Hay una correlación directa entre cómo te ve tu mercado y cuánto estás dispuesto a cobrar. Las marcas que invierten en calidad visual rompen el techo de precio — y las que no, compiten siempre por precio.</p>
              <a href="https://www.youtube.com/watch?v=Tu0aO6Wfo-Q" target="_blank" rel="noopener" className="card-cta">Ver en YouTube →</a>
            </div>
            <div className="idea-card reveal">
              <div className="video-wrapper">
                <iframe src="https://www.youtube.com/embed/6eNZDohJvVg" title="Por qué el 90% del dinero en Meta se pierde antes de empezar" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy"></iframe>
              </div>
              <p className="idea-tag">Meta Ads · Creatividades</p>
              <h4>Por qué el 90% del dinero en Meta se pierde antes de empezar</h4>
              <p className="idea-desc">La mayoría de las marcas pierde dinero en Meta porque confunde pautar con anunciar. El problema no es el presupuesto ni el público — es la creatividad. Acá explicamos qué cambiar primero.</p>
              <a href="https://www.youtube.com/watch?v=6eNZDohJvVg" target="_blank" rel="noopener" className="card-cta">Ver en YouTube →</a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="section">
        <div className="is-container contacto-grid">
          <div className="contacto-text reveal">
            <p className="eyebrow">Contacto</p>
            <h2>¿Listo para que lo impresionante deje de ser <em>casualidad?</em></h2>
            <p className="body-text">Contanos tu proyecto — sea tu identidad de marca, una campaña de contenido o el evento que estás por producir. En menos de 24 horas te respondemos con una evaluación honesta.</p>
            <ul className="contacto-datos">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
                <a href="mailto:contacto@impressivestudio.cl">contacto@impressivestudio.cl</a>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15.46l-4.28-.49a1 1 0 0 0-.82.29l-2.97 2.97a15.05 15.05 0 0 1-6.59-6.59l2.98-2.98a1 1 0 0 0 .29-.83L9.12 3a1 1 0 0 0-1-.87H4a1 1 0 0 0-1 1c0 9.39 7.61 17 17 17a1 1 0 0 0 1-1v-3.1a1 1 0 0 0-.87-1z"/></svg>
                <a href="https://wa.me/56966632827" target="_blank" rel="noopener">+569 6663 2827</a>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                <a href="https://instagram.com/basscordova" target="_blank" rel="noopener">@basscordova</a>
              </li>
            </ul>
          </div>
          <div className="contacto-form reveal">
            <iframe
              src="https://link.neweramarketing.cl/widget/form/wo8NhSZOzVDCduc6yMYg"
              style={{ width: "100%", height: "700px", border: "none", display: "block" }}
              id="inline-wo8NhSZOzVDCduc6yMYg"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Form Calificatorio - Ecom"
              data-height="669"
              data-layout-iframe-id="inline-wo8NhSZOzVDCduc6yMYg"
              data-form-id="wo8NhSZOzVDCduc6yMYg"
              title="Form Calificatorio - Ecom"
            ></iframe>
            <Script src="https://link.neweramarketing.cl/js/form_embed.js" strategy="lazyOnload" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer">
        <div className="is-container footer-grid">
          <div className="footer-brand">
            <a href="#" className="nav-logo footer-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <span className="logo-impressive"><span className="teal">I</span>MPRESS<span className="teal">I</span>V<span className="teal">E</span></span>
              <span className="logo-studio">STUDIO</span>
            </a>
            <p className="footer-tagline">Nothing Impressive. Happens by accident.</p>
            <p className="footer-desc">Estudio integral de branding, producción audiovisual y producción de eventos y experiencias.</p>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Servicios</p>
            <ul>
              <li><a href="#servicios" onClick={(e) => handleNavClick(e, "#servicios")}>Branding</a></li>
              <li><a href="#servicios" onClick={(e) => handleNavClick(e, "#servicios")}>Producción Audiovisual</a></li>
              <li><a href="#servicios" onClick={(e) => handleNavClick(e, "#servicios")}>Eventos y Experiencias</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Estudio</p>
            <ul>
              <li><a href="#nosotros" onClick={(e) => handleNavClick(e, "#nosotros")}>Nosotros</a></li>
              <li><a href="#proceso" onClick={(e) => handleNavClick(e, "#proceso")}>Proceso</a></li>
              <li><a href="#portfolio" onClick={(e) => handleNavClick(e, "#portfolio")}>Portfolio</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Conectar</p>
            <ul>
              <li><a href="#ideas" onClick={(e) => handleNavClick(e, "#ideas")}>Ideas</a></li>
              <li><a href="#contacto" onClick={(e) => handleNavClick(e, "#contacto")}>Contacto</a></li>
              <li><a href="https://instagram.com/basscordova" target="_blank" rel="noopener">Instagram</a></li>
              <li><a href="https://wa.me/56966632827" target="_blank" rel="noopener">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="is-container footer-bottom-inner">
            <p>© 2026 Impressive Studio. Todos los derechos reservados.</p>
            <p>Hecho con intención en Chile.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
