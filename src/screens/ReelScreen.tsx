import { useEffect, useRef, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import type { Dish } from "@/types/config";
import { BottomNav } from "./MenuScreen";

interface Props {
  activeCategory: string;
  startDishId?: string;
  onCategoryChange: (id: string) => void;
  onBack: () => void;
  favs: Set<string>;
  onToggleFav: (id: string) => void;
  onAddToCart: (dish: Dish) => void;
  cartCount: number;
  onCartOpen: () => void;
}

export function ReelScreen({
  activeCategory,
  startDishId,
  onCategoryChange,
  onBack,
  favs,
  onToggleFav,
  onAddToCart,
  cartCount,
  onCartOpen,
}: Props) {
  const config = useConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  // Reset info panel when slide changes
  useEffect(() => {
    setShowInfo(false);
  }, [currentIdx]);

  const dishes = config.dishes.filter(
    (d) => d.category === activeCategory && d.available !== false
  );

  // Start at the specified dish
  useEffect(() => {
    if (!startDishId || dishes.length === 0) return;
    const idx = dishes.findIndex((d) => d.id === startDishId);
    if (idx !== -1) {
      setCurrentIdx(idx);
      const el = containerRef.current?.children[idx] as HTMLElement | undefined;
      el?.scrollIntoView({ behavior: "instant" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDishId]);

  // Intersection observer to track current slide
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx"));
            if (!isNaN(idx)) setCurrentIdx(idx);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    Array.from(container.children).forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [dishes]);

  const goNext = () => {
    const el = containerRef.current?.children[currentIdx + 1] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const goPrev = () => {
    const el = containerRef.current?.children[currentIdx - 1] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-app overflow-hidden">
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 pt-4 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
          aria-label="Volver al menú"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="10 3 5 8 10 13"/>
          </svg>
          <span className="text-xs font-medium drop-shadow">Menú</span>
        </button>

        {/* Category tabs */}
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {config.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wide transition-all whitespace-nowrap ${
                  cat.id === activeCategory
                    ? "bg-primary text-white"
                    : "text-white/50 bg-black/30 backdrop-blur-sm hover:text-white/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reel container ── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y-mandatory no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {dishes.map((dish, idx) => (
          <ReelSlide
            key={dish.id}
            dish={dish}
            idx={idx}
            isActive={idx === currentIdx}
            isFav={favs.has(dish.id)}
            onToggleFav={() => onToggleFav(dish.id)}
            onAddToCart={() => onAddToCart(dish)}
            showInfo={showInfo}
            onToggleInfo={() => setShowInfo((v) => !v)}
          />
        ))}

        {dishes.length === 0 && (
          <div className="h-[100dvh] flex flex-col items-center justify-center gap-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <p className="text-sm text-white/30">Sin vídeos en esta categoría</p>
          </div>
        )}
      </div>

      {/* Up/Down navigation arrows */}
      {dishes.length > 1 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
          <button
            onClick={goPrev}
            className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-opacity ${currentIdx === 0 ? "opacity-20 pointer-events-none" : "opacity-80 hover:opacity-100"}`}
            aria-label="Anterior"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 10 7 5 11 10"/>
            </svg>
          </button>
          <button
            onClick={goNext}
            className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-opacity ${currentIdx === dishes.length - 1 ? "opacity-20 pointer-events-none" : "opacity-80 hover:opacity-100"}`}
            aria-label="Siguiente"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 4 7 9 11 4"/>
            </svg>
          </button>
        </div>
      )}

      {/* Progress dots left */}
      {dishes.length > 1 && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5">
          {dishes.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: 4,
                height: i === currentIdx ? 20 : 4,
                background: i === currentIdx ? "hsl(var(--primary))" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Bottom nav ── */}
      <BottomNav
        onMenuPress={onBack}
        onVideoPress={() => {}}
        onFavsPress={onBack}
        onCartPress={onCartOpen}
        cartCount={cartCount}
        current="reel"
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Single reel slide
// ─────────────────────────────────────────────
interface SlideProps {
  dish: Dish;
  idx: number;
  isActive: boolean;
  isFav: boolean;
  onToggleFav: () => void;
  onAddToCart: () => void;
  showInfo: boolean;
  onToggleInfo: () => void;
}

function ReelSlide({
  dish,
  idx,
  isActive,
  isFav,
  onToggleFav,
  onAddToCart,
  showInfo,
  onToggleInfo,
}: SlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play/pause based on visibility
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div
      className="relative h-[100dvh] snap-start overflow-hidden flex-shrink-0"
      data-idx={idx}
    >
      {/* Background: video or image */}
      {dish.video ? (
        <video
          ref={videoRef}
          src={dish.video}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src={dish.image}
          alt={dish.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: isActive
              ? "ken-burns 8s ease-in-out infinite alternate"
              : "none",
            willChange: isActive ? "transform" : "auto",
          }}
        />
      )}

      {/* Strong bottom gradient for text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Right sidebar actions */}
      <div className="absolute right-4 bottom-28 z-20 flex flex-col gap-4 items-center">
        {/* Fav */}
        <button
          onClick={onToggleFav}
          className="flex flex-col items-center gap-1"
          aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? "hsl(var(--primary))" : "none"} stroke={isFav ? "hsl(var(--primary))" : "white"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </div>
          <span className="text-[9px] text-white/70 text-shadow">
            {isFav ? "Guardado" : "Favorito"}
          </span>
        </button>

        {/* Info toggle */}
        <button
          onClick={onToggleInfo}
          className="flex flex-col items-center gap-1"
          aria-label="Ver descripción"
        >
          <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${showInfo ? "bg-white/20" : "bg-black/40"}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <span className="text-[9px] text-white/70 text-shadow">Info</span>
        </button>

        {/* Add */}
        <button
          onClick={onAddToCart}
          className="bg-primary text-white text-[11px] font-bold px-3.5 py-2 rounded-full uppercase tracking-wide shadow-lg hover:bg-primary/80 transition-colors"
        >
          Añadir
        </button>
      </div>

      {/* Bottom text overlay */}
      <div className="absolute bottom-20 left-5 right-20 z-20">
        <h3 className="font-display text-2xl font-light text-white text-shadow leading-tight">
          {dish.name}
        </h3>
        <p className="text-lg font-semibold text-white mt-1 text-shadow">
          {dish.price.toFixed(2).replace(".", ",")}€
        </p>

        {showInfo && (
          <p className="text-[13px] text-white/80 mt-2 leading-relaxed text-shadow max-w-[260px] animate-fade-in">
            {dish.description}
          </p>
        )}

        {dish.tags && dish.tags.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {dish.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-white/70 border border-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm bg-black/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Signature badge */}
      {dish.signature && (
        <div className="absolute top-16 left-5 z-20">
          <span className="text-[11px] font-bold bg-primary text-white px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
            ★ Plato de autor
          </span>
        </div>
      )}
    </div>
  );
}
