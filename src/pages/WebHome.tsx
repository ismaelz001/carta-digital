import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ─── Hook: Scroll reveal ──────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Datos del cliente ────────────────────────────────────────────────────────
const R = {
  name: "Café Bar Polígono",
  tagline: "Cocina casera de siempre",
  description:
    "Más de 30 años sirviendo a los trabajadores del Área Empresarial do Tambre y a toda Santiago de Compostela. Menú del día, desayunos, bocadillos y bufé libre.",
  address: "Vía Galileo, 15 — Área Empresarial do Tambre",
  city: "15890 Santiago de Compostela",
  phone: "981 56 19 33",
  phoneTel: "tel:+34981561933",
  mapsUrl: "https://maps.google.com/?q=Via+Galileo,+15,+15890+Santiago+de+Compostela",
  instagram: "https://www.instagram.com/cafebarpoligono/",
  rating: 4.1,
  reviewCount: 1512,
  hours: [
    { label: "Lunes – Viernes", time: "07:30 – 21:00", open: true },
    { label: "Sábado", time: "08:00 – 15:00", open: true },
    { label: "Domingo", time: "Cerrado", open: false },
  ],
};

const HERO_IMG = "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1800&q=85";

const SERVICES = [
  { icon: "🍽️", title: "Bufé Libre", desc: "Amplia selección de platos calientes y fríos para servirte a tu ritmo." },
  { icon: "📋", title: "Menú del Día", desc: "1er + 2º + postre + bebida desde 9,50 €. Lunes a viernes." },
  { icon: "🥖", title: "Bocadillos y Tapas", desc: "Los mejores bocadillos de la ciudad y tapas caseras en barra." },
  { icon: "☕", title: "Desayunos", desc: "Café, tostadas, churros con chocolate... el desayuno que te mereces." },
  { icon: "🏛️", title: "Comedor Privado", desc: "Espacio reservado para grupos y celebraciones de empresa." },
  { icon: "🥡", title: "Para Llevar", desc: "Pide tu menú para llevarte a la oficina o a casa. Sin esperas." },
];

// Swap these for real client photos when available
const GALLERY = [
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80", alt: "Comedor" },
  { src: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=900&q=80", alt: "Desayuno" },
  { src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&q=80", alt: "Bocadillo" },
  { src: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=900&q=80", alt: "Tostada" },
  { src: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=900&q=80", alt: "Menú del día" },
  { src: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80", alt: "Pulpo" },
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80", alt: "Terraza" },
  { src: "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=900&q=80", alt: "Barra" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(rating);
        const half = !filled && i - 0.5 <= rating;
        return (
          <svg key={i} viewBox="0 0 20 20" className="w-4 h-4">
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path
              fill={filled ? "#F59E0B" : half ? `url(#half-${i})` : "#D1D5DB"}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      })}
    </span>
  );
}

const NAV_LINKS: [string, string][] = [
  ["servicios", "Servicios"],
  ["galeria", "Galería"],
  ["nosotros", "Nosotros"],
  ["contacto", "Contacto"],
];

export default function WebHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [parallax, setParallax] = useState(0);

  const onScroll = useCallback(() => {
    const top = containerRef.current?.scrollTop ?? 0;
    setScrolled(top > 50);
    setParallax(top * 0.3);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    el?.addEventListener("scroll", onScroll, { passive: true });
    return () => el?.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const target = document.getElementById(id);
    const container = containerRef.current;
    if (!target || !container) return;
    container.scrollTo({ top: target.offsetTop - 64, behavior: "smooth" });
  };

  const scrollToTop = () => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style>{`
        @keyframes fadeDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(40px);  } to { opacity:1; transform:translateY(0); } }
        .hero-rating { animation: fadeDown 0.8s ease 0.1s both; }
        .hero-text-1 { animation: fadeUp 0.9s ease 0.2s both; }
        .hero-text-2 { animation: fadeUp 0.9s ease 0.4s both; }
        .hero-text-3 { animation: fadeUp 0.9s ease 0.6s both; }
        .hero-ctas   { animation: fadeUp 0.9s ease 0.8s both; }
        .hero-meta   { animation: fadeUp 0.9s ease 1.0s both; }
        .scroll-line { animation: fadeUp 1.2s ease 1.5s both; }
      `}</style>

      <div
        ref={containerRef}
        style={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          fontFamily: "'Bricolage Grotesque', sans-serif",
          color: "#1C1C1C",
        }}
      >
        {/* ── NAVBAR ── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
          style={{
            background: scrolled ? "rgba(15,30,60,0.96)" : "transparent",
            backdropFilter: scrolled ? "blur(14px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
            boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.25)" : "none",
          }}
        >
          <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
            <button onClick={scrollToTop} className="flex flex-col leading-none text-left group">
              <span style={{ fontFamily: "'Rufina', serif", fontSize: "1.05rem", fontWeight: 700, color: "#fff", letterSpacing: "0.06em" }}
                className="transition-opacity group-hover:opacity-75">
                CAFÉ BAR
              </span>
              <span style={{ fontFamily: "'Rufina', serif", fontSize: "0.7rem", color: "#D4A017", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                POLÍGONO
              </span>
            </button>

            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="text-sm font-medium transition-colors duration-200 hover:text-white"
                  style={{ color: "rgba(255,255,255,0.72)" }}>
                  {label}
                </button>
              ))}
              <Link to="/carta"
                className="ml-1 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:brightness-110 hover:scale-105"
                style={{ background: "#D4A017", color: "#1B2F5A" }}>
                Ver Carta
              </Link>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-1">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5}>
                {menuOpen
                  ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>

          {menuOpen && (
            <div style={{ background: "rgba(15,30,60,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
              className="md:hidden px-5 pb-6 pt-3 flex flex-col gap-4">
              {NAV_LINKS.map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="text-left text-white/85 font-medium py-1 text-base">{label}</button>
              ))}
              <Link to="/carta" onClick={() => setMenuOpen(false)}
                className="inline-block w-fit px-5 py-2.5 rounded-full font-semibold text-sm mt-1"
                style={{ background: "#D4A017", color: "#1B2F5A" }}>
                Ver Carta Digital
              </Link>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section className="relative flex items-end" style={{ minHeight: "100vh", paddingBottom: "clamp(3rem,8vh,7rem)" }}>
          <div className="absolute inset-0 overflow-hidden">
            <img src={HERO_IMG} alt="Café Bar Polígono" loading="eager"
              className="w-full h-full object-cover"
              style={{ transform: `translateY(${parallax}px)`, willChange: "transform" }}
            />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to top, rgba(8,18,40,0.97) 0%, rgba(8,18,40,0.55) 45%, rgba(8,18,40,0.12) 100%)"
            }} />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-5 w-full">
            <div className="hero-rating flex items-center gap-2 mb-5">
              <Stars rating={R.rating} />
              <span className="text-white/80 text-sm font-medium">
                {R.rating.toFixed(1)} · {R.reviewCount.toLocaleString("es-ES")} reseñas en Google
              </span>
            </div>

            <h1 className="hero-text-1" style={{
              fontFamily: "'Rufina', serif",
              fontSize: "clamp(2.6rem,6.5vw,5rem)",
              fontWeight: 700, color: "#fff", lineHeight: 1.05, margin: 0,
            }}>
              {R.name}
            </h1>

            <p className="hero-text-2" style={{
              fontSize: "clamp(1.1rem,2.5vw,1.5rem)",
              color: "#D4A017", fontWeight: 600, marginTop: "0.6rem",
            }}>
              {R.tagline}
            </p>

            <p className="hero-text-3 max-w-xl leading-relaxed" style={{
              marginTop: "1rem", color: "rgba(255,255,255,0.68)",
              fontSize: "clamp(0.9rem,1.5vw,1.05rem)",
            }}>
              {R.description}
            </p>

            <div className="hero-ctas flex flex-wrap gap-3 mt-8">
              <Link to="/carta"
                className="px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:brightness-110"
                style={{ background: "#D4A017", color: "#1B2F5A", boxShadow: "0 4px 20px rgba(212,160,23,0.4)" }}>
                Ver la Carta Digital
              </Link>
              <a href={R.phoneTel}
                className="px-6 py-3 rounded-full font-semibold text-sm border text-white transition-all hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.35)" }}>
                📞 Llamar ahora
              </a>
            </div>

            <div className="hero-meta flex flex-wrap gap-x-6 gap-y-1.5 mt-9 text-white/45 text-sm">
              <span>🕐 Lun–Vie 07:30–21:00</span>
              <span>📍 Vía Galileo 15, Santiago</span>
              <span>💶 Menú desde 9,50 €</span>
            </div>
          </div>

          <div className="scroll-line absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-white/25 text-xs tracking-widest uppercase">Scroll</span>
            <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.45), transparent)" }} />
          </div>
        </section>

        {/* ── SERVICIOS ── */}
        <section id="servicios" style={{ background: "#F7F5F0" }} className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-5">
            <Reveal className="text-center mb-14">
              <p style={{ color: "#D4A017", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: "0.75rem" }}>
                Lo que ofrecemos
              </p>
              <h2 style={{ fontFamily: "'Rufina', serif", fontSize: "clamp(1.9rem,4vw,2.9rem)", fontWeight: 700, color: "#1B2F5A", marginTop: "0.4rem" }}>
                Nuestros Servicios
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 80}>
                  <div className="rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                    style={{ background: "#fff", border: "1px solid #EAE6DC" }}>
                    <span className="text-3xl block mb-3">{s.icon}</span>
                    <h3 style={{ fontFamily: "'Rufina', serif", fontSize: "1.2rem", fontWeight: 700, color: "#1B2F5A" }}>{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "#6B7280" }}>{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200} className="text-center mt-12">
              <Link to="/carta"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105"
                style={{ background: "#1B2F5A", color: "#fff" }}>
                Ver la carta completa →
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── GALERÍA ── */}
        <section id="galeria" style={{ background: "#fff" }} className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-5">
            <Reveal className="text-center mb-14">
              <p style={{ color: "#D4A017", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: "0.75rem" }}>
                Imágenes del local
              </p>
              <h2 style={{ fontFamily: "'Rufina', serif", fontSize: "clamp(1.9rem,4vw,2.9rem)", fontWeight: 700, color: "#1B2F5A", marginTop: "0.4rem" }}>
                Galería
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GALLERY.map((img, i) => (
                <Reveal key={img.alt} delay={i * 60} className={i === 0 || i === 4 ? "col-span-2" : ""}>
                  <div className="overflow-hidden rounded-xl"
                    style={{ aspectRatio: (i === 0 || i === 4) ? "16/9" : "3/4" }}>
                    <img src={img.src} alt={img.alt} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── NOSOTROS ── */}
        <section id="nosotros" style={{ background: "#1B2F5A" }} className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <p style={{ color: "#D4A017", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: "0.75rem" }}>
                Nuestra historia
              </p>
              <h2 style={{ fontFamily: "'Rufina', serif", fontSize: "clamp(1.8rem,4vw,2.7rem)", fontWeight: 700, color: "#fff", marginTop: "0.5rem", lineHeight: 1.2 }}>
                Un referente en el Polígono do Tambre
              </h2>
              <p className="mt-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.68)", fontSize: "0.97rem" }}>
                Llevamos más de tres décadas siendo el punto de encuentro de trabajadores, empresas y familias del Área Empresarial do Tambre. Desde el primer café de la mañana hasta el último menú del día, nuestro compromiso con la cocina casera y el trato cercano nunca ha cambiado.
              </p>
              <p className="mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.68)", fontSize: "0.97rem" }}>
                Platos de siempre, preparados con producto fresco cada día. Sin artificios. Solo comida de verdad.
              </p>
              <div className="mt-8 inline-flex items-center gap-4 rounded-2xl px-5 py-4"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <svg viewBox="0 0 48 48" className="w-8 h-8 flex-shrink-0">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,19.134,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                <div>
                  <div className="flex items-center gap-2">
                    <Stars rating={R.rating} />
                    <span className="font-bold text-white text-lg">{R.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {R.reviewCount.toLocaleString("es-ES")} reseñas verificadas en Google
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80"
                  alt="Interior" loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CONTACTO ── */}
        <section id="contacto" style={{ background: "#F7F5F0" }} className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-5">
            <Reveal className="text-center mb-14">
              <p style={{ color: "#D4A017", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: "0.75rem" }}>
                Encuéntranos
              </p>
              <h2 style={{ fontFamily: "'Rufina', serif", fontSize: "clamp(1.9rem,4vw,2.9rem)", fontWeight: 700, color: "#1B2F5A", marginTop: "0.4rem" }}>
                Contacto y Horarios
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Reveal><div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #EAE6DC" }}>
                  <h3 className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>📍 Dónde estamos</h3>
                  <p className="font-medium" style={{ color: "#1B2F5A" }}>{R.address}</p>
                  <p style={{ color: "#374151" }}>{R.city}</p>
                  <a href={R.mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm font-semibold" style={{ color: "#D4A017" }}>
                    Ver en Google Maps →
                  </a>
                </div></Reveal>

                <Reveal delay={80}><div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #EAE6DC" }}>
                  <h3 className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: "#9CA3AF" }}>📞 Teléfono</h3>
                  <a href={R.phoneTel} className="text-2xl font-bold" style={{ color: "#1B2F5A" }}>{R.phone}</a>
                  <p className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>Reservas y encargos</p>
                </div></Reveal>

                <Reveal delay={160}><div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #EAE6DC" }}>
                  <h3 className="font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: "#9CA3AF" }}>🕐 Horario</h3>
                  <div className="space-y-2.5">
                    {R.hours.map((h) => (
                      <div key={h.label} className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: "#374151" }}>{h.label}</span>
                        <span className="text-sm font-bold" style={{ color: h.open ? "#1B4F8A" : "#9CA3AF" }}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div></Reveal>

                <Reveal delay={240}>
                  <a href={R.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "#fff" }}>
                    <svg viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <div>
                      <p className="font-semibold text-sm">@cafebarpoligono</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>Síguenos en Instagram</p>
                    </div>
                  </a>
                </Reveal>
              </div>

              <Reveal delay={100}>
                <div className="rounded-2xl overflow-hidden h-full" style={{ minHeight: 420, border: "1px solid #EAE6DC" }}>
                  <iframe
                    title="Ubicación Café Bar Polígono"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.4!2d-8.5266!3d42.8462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2efe4b5c1b1b1b%3A0x0!2sCaf%C3%A9+Bar+Pol%C3%ADgono!5e0!3m2!1ses!2ses!4v1714000000000"
                    width="100%" height="100%"
                    style={{ border: 0, minHeight: 420, display: "block" }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: "#080F22" }} className="py-10">
          <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <button onClick={scrollToTop} className="text-center md:text-left">
              <p style={{ fontFamily: "'Rufina', serif", fontSize: "1rem", fontWeight: 700, color: "#fff", letterSpacing: "0.06em" }}>
                CAFÉ BAR POLÍGONO
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#D4A017" }}>Cocina casera · Santiago de Compostela</p>
            </button>
            <div className="flex flex-wrap justify-center gap-5">
              {NAV_LINKS.map(([id, label]) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="text-sm transition-colors hover:text-white/60" style={{ color: "#4B5563" }}>
                  {label}
                </button>
              ))}
              <Link to="/carta" className="text-sm font-medium" style={{ color: "#D4A017" }}>Carta Digital</Link>
            </div>
            <p className="text-xs text-center" style={{ color: "#374151" }}>
              © {new Date().getFullYear()} Café Bar Polígono<br />
              Web por{" "}
              <a href="https://rodorte.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-white/60 transition-colors" style={{ color: "#4B5563" }}>
                Rodorte
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}