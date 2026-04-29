import { useConfig } from "@/context/ConfigContext";
import type { CartItem } from "@/pages/Index";

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

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-app">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-safe-top pb-3 pt-4 z-10 flex-shrink-0">
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
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] text-[10px] font-bold bg-primary text-white rounded-full flex items-center justify-center px-0.5 leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Logo + Name ── */}
      <div className="flex flex-col items-center pt-4 pb-6 flex-shrink-0">
        <div
          className="w-[120px] h-[120px] rounded-full overflow-hidden border border-white/10 bg-[#1a1714] mb-4 flex items-center justify-center"
          style={{ boxShadow: "0 0 0 6px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.5)" }}
        >
          {config.logo ? (
            <img
              src={config.logo}
              alt={config.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display text-4xl font-light text-white/90">
              {config.initials ?? config.name.charAt(0)}
            </span>
          )}
        </div>

        <h1 className="font-display text-[22px] font-light text-white tracking-wide text-center px-4">
          {config.name}
        </h1>
        {config.tagline && (
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/40 mt-1 text-center px-4">
            {config.tagline}
          </p>
        )}

        {/* Event banner */}
        {config.eventBanner?.active && (
          <div className="mt-4 mx-6 px-4 py-2 rounded-xl bg-primary/15 border border-primary/25 text-center">
            <p className="text-[12px] text-primary font-medium">
              {config.eventBanner.emoji && `${config.eventBanner.emoji} `}
              {config.eventBanner.text}
            </p>
          </div>
        )}
      </div>

      {/* ── Category cards ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col min-h-0">
        <p className="text-center text-[10px] uppercase tracking-[0.22em] text-white/50 mb-4 flex-shrink-0">
          Explora la carta
        </p>

        <div className="grid grid-cols-2 gap-3 px-4 pb-6">
          {config.categories.map((cat) => {
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
                      src={cat.image}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ background: "linear-gradient(135deg, #1e1c1a 0%, #2e2a27 100%)" }}
                    />
                  )}

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.8) 100%)",
                    }}
                  />
                </button>

                {/* Video badge — top right */}
                {hasVideo && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full pointer-events-none">
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
                    <span className="text-[10px] text-white/65 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {dishCount} {dishCount === 1 ? "plato" : "platos"}
                    </span>
                  </div>
                )}

                {/* Bottom: label + optional reel button */}
                <div className="absolute bottom-0 inset-x-0 flex flex-col items-center gap-2 pb-4">
                  {hasVideo && (
                    <button
                      className="flex items-center gap-1.5 text-[10px] font-medium text-white/85 bg-black/45 backdrop-blur-sm border border-white/15 px-3 py-1 rounded-full hover:bg-black/65 active:scale-95 transition-all"
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
                  <span className="bg-primary text-white text-[11px] font-semibold px-4 py-1.5 rounded-full uppercase tracking-[0.12em] text-shadow pointer-events-none">
                    {cat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Season label — al final del scroll */}
        {config.season && (
          <p className="text-center text-[10px] uppercase tracking-widest text-white/40 py-4">
            {config.season}
          </p>
        )}
      </div>

    </div>
  );
}
