import { useEffect, useRef } from "react";
import { useConfig } from "@/context/ConfigContext";
import type { CartItem } from "@/pages/Index";

function useGreeting(): string {
  const h = new Date().getHours();
  if (h < 13) return "Buenos días";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

interface Props {
  cartCount: number;
  onCartOpen: () => void;
  onCategorySelect: (catId: string) => void;
  onReelOpen: (catId: string) => void;
  cart: CartItem[];
}

export function HomeScreen({
  cartCount,
  onCartOpen,
  onCategorySelect,
  onReelOpen,
}: Props) {
  const config = useConfig();
  const greeting = useGreeting();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLElement | null)[]>([]);

  // Overdrive C: inner parallax on category card images
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const update = () => {
      const cRect = container.getBoundingClientRect();
      const midY = cRect.top + cRect.height / 2;
      imgRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cardMid = r.top + r.height / 2;
        const ratio = Math.max(-1.2, Math.min(1.2, (cardMid - midY) / (cRect.height * 0.5)));
        el.style.transform = `translateY(${ratio * -14}px) scale(1.18)`;
      });
    };

    container.addEventListener('scroll', update, { passive: true });
    update();
    return () => container.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-app">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-safe-top pb-3 z-10 flex-shrink-0">
        {config.reservas ? (
          <a
            href={config.reservas}
            className="text-sm font-medium text-white/75 hover:text-white transition-colors"
            rel="noopener noreferrer"
            target="_blank"
          >
            Reservas
          </a>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-4">
          {config.social?.instagram && (
            <a
              href={config.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          )}

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative text-white/70 hover:text-white transition-colors"
            aria-label={`Carrito, ${cartCount} artículos`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span key={cartCount} className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] text-[10px] font-bold bg-primary text-white rounded-full flex items-center justify-center px-0.5 leading-none animate-badge-pop">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Logo + Name (hero con fondo vintage) ── */}
      <div className="relative flex flex-col items-center pt-4 pb-6 flex-shrink-0 landscape:pt-2 landscape:pb-3 overflow-hidden">
        {/* Imagen vintage de fondo */}
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=55&auto=format"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.055, filter: 'saturate(0.3) sepia(0.5) brightness(0.7)' }}
        />
        {/* Vigneta que funde los bordes con el bg de la app */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 30%, hsl(20 7% 6%) 80%)' }}
        />
        <div
          className="relative z-10 w-[120px] h-[120px] landscape:w-[72px] landscape:h-[72px] rounded-full overflow-hidden border border-white/10 bg-[#1a1714] mb-4 flex items-center justify-center logo-glow"
        >
          {config.logo ? (
            <img
              src={config.logo}
              alt={config.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display text-3xl font-light text-white/85 tracking-wide">
              {config.initials ?? config.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <h1 className="relative z-10 w-full font-display text-[22px] landscape:text-lg font-light text-white tracking-wide text-center px-4">
          {config.name}
        </h1>
        {config.tagline && (
          <p className="relative z-10 w-full text-[11px] uppercase tracking-[0.18em] text-white/50 mt-1 text-center px-4">
            {config.tagline}
          </p>
        )}

        {/* Event banner */}
        {config.eventBanner?.active && (
          <div className="relative z-10 mt-4 mx-6 px-4 py-2 rounded-xl bg-primary/15 border border-primary/25 text-center">
            <p className="text-[12px] text-primary font-medium">
              {config.eventBanner.emoji && `${config.eventBanner.emoji} `}
              {config.eventBanner.text}
            </p>
          </div>
        )}
      </div>

      {/* ── Category cards ── */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar flex flex-col min-h-0">
        <p className="text-center text-[10px] uppercase tracking-[0.22em] text-white/50 mb-4 flex-shrink-0">
          {greeting} · Explora la carta
        </p>

        {/* ── B: Hoy recomendamos ── */}
        {(() => {
          const star = config.dishes.find(d => d.signature && d.available !== false) ?? config.dishes.find(d => d.popular && d.available !== false);
          if (!star) return null;
          return (
            <button
              onClick={() => {
                const cat = config.categories.find(c => c.id === star.category);
                if (cat) onCategorySelect(star.category);
              }}
              className="animate-pill-in flex-shrink-0 mx-auto mb-4 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:border-primary/40 transition-colors"
            >
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium">Hoy recomendamos</span>
              <span className="w-px h-3 bg-white/15" />
              <span className="text-[12px] font-semibold text-white">{star.name}</span>
              <span className="text-[12px] font-light text-primary">{star.price.toFixed(2).replace('.', ',')}€</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/30">
                <polyline points="4.5 2 9 6 4.5 10"/>
              </svg>
            </button>
          );
        })()}

        <div className="grid grid-cols-2 gap-3 px-4 pb-6">
          {config.categories.map((cat, i) => {
            const hasDishes = config.dishes.some(
              (d) => d.category === cat.id && d.available !== false
            );
            const hasVideo = config.dishes.some(
              (d) => d.category === cat.id && d.video && d.available !== false
            );

            const dishCount = config.dishes.filter(
              (d) => d.category === cat.id && d.available !== false
            ).length;

            return (
              <div
                key={cat.id}
                className="relative rounded-2xl overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-primary"
                style={{ aspectRatio: "3/4" }}
              >
                {/* Main tap area */}
                <button
                  className="absolute inset-0 w-full h-full focus:outline-none"
                  onClick={() => onCategorySelect(cat.id)}
                  aria-label={`Ver ${cat.label}`}
                >
                  {/* Photo */}
                  {cat.image ? (
                    <img
                      ref={(el) => { imgRefs.current[i] = el; }}
                      src={cat.image}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      style={{ transform: 'translateY(0) scale(1.18)', transition: 'none' }}
                    />
                  ) : (
                    <div
                      ref={(el) => { imgRefs.current[i] = el; }}
                      className="w-full h-full"
                      style={{ background: "linear-gradient(135deg, #1e1c1a 0%, #2e2a27 100%)", transform: 'translateY(0) scale(1.18)', transition: 'none' }}
                    />
                  )}

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(13,11,9,0.0) 40%, rgba(13,11,9,0.85) 100%)",
                    }}
                  />
                </button>

                {/* Video badge — top right */}
                {hasVideo && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#0D0B09]/65 backdrop-blur-sm px-2 py-1 rounded-full pointer-events-none">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                      <polygon points="2,1 9,5 2,9"/>
                    </svg>
                    <span className="text-[9px] font-semibold text-white uppercase tracking-wider">
                      Vídeo
                    </span>
                  </div>
                )}

                {/* Dish count — top left */}
                {hasDishes && (
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="text-[10px] text-white/65 bg-[#0D0B09]/55 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {dishCount} {dishCount === 1 ? "plato" : "platos"}
                    </span>
                  </div>
                )}

                {/* Bottom: label + optional reel button */}
                <div className="absolute bottom-0 inset-x-0 flex flex-col items-center gap-2 pb-4">
                  {hasVideo && (
                    <button
                      className="flex items-center gap-1.5 text-[10px] font-medium text-white/85 bg-[#0D0B09]/60 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-full hover:bg-[#0D0B09]/75 active:scale-95 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReelOpen(cat.id);
                      }}
                      aria-label={`Ver vídeos de ${cat.label}`}
                    >
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor">
                        <polygon points="2,1 9,5 2,9"/>
                      </svg>
                      Ver en vídeo
                    </button>
                  )}
                  <span className="bg-primary text-white text-[11px] font-semibold px-4 py-1.5 rounded-full tracking-[0.08em] text-shadow pointer-events-none">
                    {cat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Season label — al final del scroll */}
        {config.season && (
          <p className="text-center text-[10px] uppercase tracking-widest text-white/50 py-4">
            {config.season}
          </p>
        )}
      </div>

    </div>
  );
}
