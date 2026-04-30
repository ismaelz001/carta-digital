import { useEffect, useRef, useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import type { Dish } from "@/types/config";
import type { CartItem } from "@/pages/Index";
import { DailyMenuCard } from "@/components/app/DailyMenuCard";
import { DishMedia } from "@/components/app/DishMedia";

interface Props {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onBack: () => void;
  onReelOpen: (dishId?: string) => void;
  favs: Set<string>;
  onToggleFav: (id: string) => void;
  onAddToCart: (dish: Dish) => void;
  cartCount: number;
  onCartOpen: () => void;
  filterFavs?: Dish[];
}

export function MenuScreen({
  activeCategory,
  onCategoryChange,
  onBack,
  onReelOpen,
  favs,
  onToggleFav,
  onAddToCart,
  cartCount,
  onCartOpen,
  filterFavs,
}: Props) {
  const config = useConfig();
  const [openDish, setOpenDish] = useState<Dish | null>(null);
  const [dietFilter, setDietFilter] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Dishes to show
  const baseDishes = filterFavs
    ? filterFavs
    : config.dishes.filter(
        (d) => d.category === activeCategory && d.available !== false
      );
  const dishes = dietFilter
    ? baseDishes.filter((d) => d.tags?.includes(dietFilter))
    : baseDishes;

  const activeLabel = filterFavs
    ? "Favoritos"
    : config.categories.find((c) => c.id === activeCategory)?.label ?? "";

  // Scroll list to top on category change
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
    setDietFilter(null);
  }, [activeCategory]);

  return (
    <div className="flex flex-col h-[100dvh] bg-app overflow-hidden">
      {/* ── Top bar ── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-safe-top pb-3 border-b border-white/7">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors min-h-[44px] px-1"
          aria-label="Volver al inicio"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="10 3 5 8 10 13"/>
          </svg>
          <span className="text-xs font-medium">Inicio</span>
        </button>

        {/* Category tabs */}
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {config.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryChange(cat.id);
                }}
                className={`px-4 min-h-[44px] rounded-full text-[11px] font-semibold uppercase tracking-wide transition-all whitespace-nowrap ${
                  cat.id === activeCategory && !filterFavs
                    ? "bg-primary text-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <button
          onClick={onCartOpen}
          className="relative text-white/70 hover:text-white transition-colors flex-shrink-0 w-11 h-11 flex items-center justify-center -mr-2"
          aria-label="Mi lista"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span key={cartCount} aria-live="polite" aria-atomic="true" className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 text-[9px] font-bold bg-primary text-white rounded-full flex items-center justify-center px-0.5 animate-badge-pop">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Category title + diet filters + video shortcut ── */}
      {!filterFavs && (
        <div className="flex-shrink-0 px-5 pt-3 pb-1">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-light text-white">
              {activeLabel}
            </h2>
            {config.dishes.some((d) => d.category === activeCategory && d.video) && (
              <button
                onClick={() => onReelOpen()}
                className="flex items-center gap-1.5 text-[11px] font-medium text-primary border border-primary/30 px-3 min-h-[44px] rounded-full hover:bg-primary/10 transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <polygon points="2,1 9,5 2,9"/>
                </svg>
                Ver en vídeo
              </button>
            )}
          </div>

          {/* Diet filter chips */}
          {(() => {
            const dietTags = ["Vegetariano", "Sin gluten", "Crudo", "Picante suave"];
            const available = dietTags.filter((tag) =>
              config.dishes.some((d) => d.category === activeCategory && d.tags?.includes(tag))
            );
            if (available.length === 0) return null;
            return (
              <div className="flex gap-2 mt-2.5 mb-1 overflow-x-auto no-scrollbar">
                {available.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setDietFilter(dietFilter === tag ? null : tag)}
                    className={`flex-shrink-0 text-[10px] font-medium px-3 py-1.5 rounded-full border transition-all ${
                      dietFilter === tag
                        ? "bg-primary/20 border-primary/60 text-primary"
                        : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/70"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Menú del día ── */}
      {!filterFavs && config.dailyMenu?.active && (
        <div className="py-3">
          <DailyMenuCard menu={config.dailyMenu} />
        </div>
      )}

      {/* ── Dish list ── */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto no-scrollbar pb-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {dishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-white/20">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <p className="text-sm text-white/30">
              {filterFavs ? "Aún no tienes favoritos" : "Sin platos disponibles"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 md:max-w-2xl md:mx-auto" key={activeCategory}>
            {dishes.map((dish, i) => (
              <DishRow
                key={dish.id}
                dish={dish}
                isFav={favs.has(dish.id)}
                onToggleFav={() => onToggleFav(dish.id)}
                onAddToCart={() => onAddToCart(dish)}
                onDetail={() => setOpenDish(dish)}
                onReel={() => onReelOpen(dish.id)}
                style={{ animationDelay: `${i * 45}ms` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      <BottomNav
        onMenuPress={() => {}} // already here
        onVideoPress={() => onReelOpen()}
        onFavsPress={onBack} // go home (favs managed by parent)
        onCartPress={onCartOpen}
        cartCount={cartCount}
        current="menu"
      />

      {/* ── Dish detail sheet ── */}
      {openDish && (
        <DishDetailSheet
          dish={openDish}
          isFav={favs.has(openDish.id)}
          onToggleFav={() => onToggleFav(openDish.id)}
          onAddToCart={() => {
            onAddToCart(openDish);
            setOpenDish(null);
          }}
          onClose={() => setOpenDish(null)}
          onReel={() => {
            onReelOpen(openDish.id);
            setOpenDish(null);
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Dish row component
// ─────────────────────────────────────────────
interface DishRowProps {
  dish: Dish;
  isFav: boolean;
  onToggleFav: () => void;
  onAddToCart: () => void;
  onDetail: () => void;
  onReel: () => void;
  style?: React.CSSProperties;
}

function DishRow({
  dish,
  isFav,
  onToggleFav,
  onAddToCart,
  onDetail,
  onReel,
  style,
}: DishRowProps) {
  const [added, setAdded] = useState(false);
  const [justFaved, setJustFaved] = useState(false);
  const addingRef = useRef(false);

  function handleAdd() {
    if (addingRef.current) return;
    addingRef.current = true;
    onAddToCart();
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      addingRef.current = false;
    }, 1800);
  }

  function handleFav() {
    if (!isFav) {
      setJustFaved(true);
      setTimeout(() => setJustFaved(false), 500);
    }
    onToggleFav();
  }

  return (
    <div
      className="flex gap-4 px-4 py-5 active:bg-white/3 transition-colors cursor-pointer animate-dish-in border-b border-white/[0.04]"
      style={style}
      onClick={onDetail}
    >
      {/* Thumbnail — portrait 3:4 editorial */}
      <div className="relative flex-shrink-0 w-[84px] h-[112px] rounded-2xl overflow-hidden bg-card">
        <DishMedia dish={dish} />
        {(dish.signature || dish.popular) && (
          <div className="absolute top-1.5 left-1.5">
            <span className="text-[8px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full uppercase">
              {dish.signature ? "★" : "🔥"}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-[17px] font-light text-white leading-snug tracking-tight flex-1 min-w-0 truncate">
              {dish.name}
            </h3>
            <span className="font-display text-[17px] font-medium text-primary tabular-nums flex-shrink-0 leading-snug">
              {dish.price.toFixed(2).replace(".", ",")}€
            </span>
          </div>
          {dish.description && (
            <p className="text-[11.5px] text-white/45 mt-1.5 leading-relaxed line-clamp-2 italic">
              {dish.description}
            </p>
          )}
          {dish.tags && dish.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {dish.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-medium text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
          {/* Fav */}
          <button
            onClick={handleFav}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:bg-white/8 active:scale-90"
            aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill={isFav ? "hsl(var(--primary))" : "none"}
              stroke={isFav ? "hsl(var(--primary))" : "rgba(255,255,255,0.5)"}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              className={justFaved ? "animate-heart-pop" : ""}
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>

          {/* Add — ghost outlined */}
          <button
            onClick={handleAdd}
            disabled={added}
            aria-label={added ? `${dish.name} añadido` : `Añadir ${dish.name}`}
            className={`text-[11px] font-semibold px-4 min-h-[44px] rounded-full transition-all uppercase tracking-[0.08em] border ${added ? "border-primary/40 text-primary/60 bg-primary/5 scale-95" : "border-primary/40 text-primary hover:bg-primary hover:text-white"}`}
          >
            {added ? "✓ Añadido" : "+ Añadir"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Bottom navigation
// ─────────────────────────────────────────────
interface BottomNavProps {
  onMenuPress: () => void;
  onVideoPress: () => void;
  onFavsPress: () => void;
  onCartPress: () => void;
  cartCount: number;
  current: "menu" | "reel" | "favs";
}

export function BottomNav({
  onMenuPress,
  onVideoPress,
  onFavsPress,
  onCartPress,
  cartCount,
  current,
}: BottomNavProps) {
  return (
    <nav
      className="flex-shrink-0 flex items-center bg-app border-t border-white/7 pb-safe-bottom"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
    >
      {/* Favoritos */}
      <NavItem
        label="Favoritos"
        active={current === "favs"}
        onClick={onFavsPress}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill={current === "favs" ? "hsl(var(--primary))" : "none"} stroke={current === "favs" ? "hsl(var(--primary))" : "rgba(255,255,255,0.5)"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        }
      />

      {/* Vídeo */}
      <NavItem
        label="Vídeo"
        active={current === "reel"}
        onClick={onVideoPress}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={current === "reel" ? "hsl(var(--primary))" : "rgba(255,255,255,0.5)"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" fill={current === "reel" ? "hsl(var(--primary))" : "none"}/>
          </svg>
        }
      />

      {/* Menú */}
      <NavItem
        label="Menú"
        active={current === "menu"}
        onClick={onMenuPress}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={current === "menu" ? "hsl(var(--primary))" : "rgba(255,255,255,0.5)"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2"/>
            <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2"/>
            <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2"/>
          </svg>
        }
      />

      {/* Mi lista */}
      <NavItem
        label="Mi lista"
        active={false}
        onClick={onCartPress}
        badge={cartCount}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        }
      />
    </nav>
  );
}

function NavItem({
  label,
  active,
  onClick,
  icon,
  badge,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-opacity active:opacity-60"
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      <div className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span key={badge} className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 text-[9px] font-bold bg-primary text-white rounded-full flex items-center justify-center px-0.5 animate-badge-pop">
            {badge}
          </span>
        )}
      </div>
      <span
        className={`text-[10px] font-medium ${active ? "text-primary" : "text-white/40"}`}
      >
        {label}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────
// Dish detail bottom sheet
// ─────────────────────────────────────────────
interface DishDetailSheetProps {
  dish: Dish;
  isFav: boolean;
  onToggleFav: () => void;
  onAddToCart: () => void;
  onClose: () => void;
  onReel: () => void;
}

function DishDetailSheet({
  dish,
  isFav,
  onToggleFav,
  onAddToCart,
  onClose,
  onReel,
}: DishDetailSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[#0D0B09]/75 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up rounded-t-3xl overflow-hidden bg-card max-h-[90dvh] flex flex-col">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto no-scrollbar">
          {/* Hero image */}
          <div className="relative w-full aspect-[4/3] bg-card">
            <DishMedia dish={dish} cinematic enableVideo />
            {/* Gradient */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, rgba(20,18,16,0.9) 100%)" }} />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-11 h-11 rounded-full bg-[#0D0B09]/80 flex items-center justify-center"
              aria-label="Cerrar"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <line x1="1" y1="1" x2="13" y2="13"/>
                <line x1="13" y1="1" x2="1" y2="13"/>
              </svg>
            </button>
          </div>

          {/* Info */}
          <div className="px-5 pt-4 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-display text-2xl font-light text-white leading-tight break-words">
                  {dish.name}
                </h2>
                {(dish.signature || dish.popular) && (
                  <p className="text-[11px] text-primary uppercase tracking-wide font-semibold mt-1">
                    {dish.signature ? "★ Plato de autor" : "🔥 Más pedido"}
                  </p>
                )}
              </div>
              <span className="text-2xl font-semibold text-white flex-shrink-0">
                {dish.price.toFixed(2).replace(".", ",")}€
              </span>
            </div>

            {dish.description && (
              <p className="mt-3 text-[13px] leading-relaxed text-white/65">
                {dish.description}
              </p>
            )}

            {dish.tags && dish.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {dish.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] border border-white/12 text-white/50 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onToggleFav}
                className={`flex-none w-11 h-11 rounded-2xl border flex items-center justify-center transition-colors ${
                  isFav
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-white/12 text-white/50 hover:border-white/25"
                }`}
                aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>

              {dish.video && (
                <button
                  onClick={onReel}
                  className="flex-none w-11 h-11 rounded-2xl border border-white/12 flex items-center justify-center text-white/50 hover:border-white/25 transition-colors"
                  aria-label="Ver en vídeo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </button>
              )}

              <button
                onClick={onAddToCart}
                aria-label={`Añadir ${dish?.name ?? ''} a mi lista`}
                className="flex-1 h-11 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/80 transition-colors uppercase tracking-wide text-sm"
              >
                Añadir a mi lista
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
