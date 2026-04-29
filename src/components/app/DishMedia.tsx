import { useEffect, useState } from "react";
import type { Dish } from "@/types/config";

interface Props {
  dish: Dish;
  className?: string;
  /** Si true, aplica filtro cinematográfico y ken-burns más amplio (para hero/detail) */
  cinematic?: boolean;
  /** Tiempo entre cada foto cuando hay multi-imagen (ms) */
  fadeMs?: number;
  /** Si false, ignora `dish.video` y usa solo imagen (recomendado para thumbnails pequeños) */
  enableVideo?: boolean;
}

/**
 * Render del media de un plato:
 * - Si `enableVideo` y tiene `video` → reproduce video en loop (autoplay, muted)
 * - Si tiene `images` (>1) → cross-fade entre las fotos cada N segundos + ken-burns
 * - Si solo tiene `image` → muestra la foto con ken-burns sutil
 *
 * Uso en thumbnail (rápido, sin video): <DishMedia dish={dish} />
 * Uso en detail/reel (con video):       <DishMedia dish={dish} enableVideo cinematic />
 */
export function DishMedia({
  dish,
  className = "",
  cinematic = false,
  fadeMs = 3500,
  enableVideo = false,
}: Props) {
  const photos = dish.images && dish.images.length > 1 ? dish.images : [dish.image];
  const [idx, setIdx] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = enableVideo && dish.video && !videoFailed;

  // Cross-fade automático cuando hay varias fotos
  useEffect(() => {
    if (photos.length < 2 || showVideo) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % photos.length);
    }, fadeMs);
    return () => clearInterval(t);
  }, [photos.length, fadeMs, showVideo]);

  // Caso 1: video (con fallback a imagen si falla)
  if (showVideo) {
    return (
      <video
        src={dish.video}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        style={cinematic ? { filter: "contrast(1.07) saturate(1.1) brightness(0.94)" } : undefined}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        poster={dish.image}
        aria-label={dish.name}
        onError={() => setVideoFailed(true)}
      />
    );
  }

  // Caso 2 & 3: una o varias imágenes con ken-burns + cross-fade
  return (
    <>
      {photos.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={i === 0 ? dish.name : ""}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${className}`}
          style={{
            opacity: i === idx ? 1 : 0,
            animation: i === idx ? "ken-burns-soft 9s ease-in-out infinite alternate" : "none",
            willChange: i === idx ? "transform, opacity" : "opacity",
            ...(cinematic ? { filter: "contrast(1.07) saturate(1.1) brightness(0.94)" } : {}),
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
      ))}
    </>
  );
}
