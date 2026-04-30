import { useEffect, useRef, useState } from "react";
import { X, Heart, Share2 } from "lucide-react";
import type { Dish } from "@/types/config";
import { useConfig } from "@/context/ConfigContext";

type Props = {
  dish: Dish | null;
  onClose: () => void;
};

export const DishModal = ({ dish, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const config = useConfig();
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = dish ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [dish, onClose]);

  // Reset liked/shared al abrir otro plato
  useEffect(() => { setLiked(false); setShared(false); }, [dish?.id]);

  const handleShare = async () => {
    if (!dish) return;
    const text = `${dish.name} — ${config.name}${dish.description ? `\n${dish.description}` : ''}\n${window.location.href}`;
    if (navigator.share) {
      await navigator.share({ title: dish.name, text, url: window.location.href }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (!dish) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-300" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 grid max-h-[90vh] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-md bg-card shadow-plate md:grid-cols-2 animate-in fade-in zoom-in-95 duration-500"
      >
        {/* Media */}
        <div className="relative aspect-square bg-muted md:aspect-auto md:h-full">
          {dish.video ? (
            <video
              ref={videoRef}
              src={dish.video}
              poster={dish.image}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <img
              src={dish.image}
              alt={dish.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Badges sobre la imagen */}
          {dish.signature && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground shadow-soft">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Signature
            </span>
          )}
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-between overflow-y-auto p-8 md:p-12">
          {/* Acciones top-right */}
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Compartir plato"
              title={shared ? "¡Copiado!" : "Compartir"}
            >
              <Share2 className={`h-4 w-4 transition-colors ${shared ? "text-primary" : ""}`} />
            </button>
            <button
              onClick={() => setLiked((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={liked ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Heart className={`h-4 w-4 transition-colors ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">
              {dish.category}
            </p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-tight text-foreground md:text-5xl">
              {dish.name}
            </h2>

            <div className="my-8 h-px w-16 bg-border" />

            {dish.description && (
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {dish.description}
              </p>
            )}

            {dish.tags && dish.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {dish.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 flex items-end justify-between border-t border-border pt-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Precio
              </p>
              <p className="mt-1 font-display text-4xl text-foreground">
                {dish.price.toFixed(2)}<span className="text-2xl text-muted-foreground">€</span>
              </p>
            </div>
            {config.reservas ? (
              <a
                href={config.reservas}
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-transform duration-300 ease-smooth hover:scale-105"
              >
                Reservar mesa
              </a>
            ) : (
              <button className="rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-transform duration-300 ease-smooth hover:scale-105">
                Ver carta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};