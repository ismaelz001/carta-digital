import { useRef, useState } from "react";
import { Play } from "lucide-react";
import type { Dish } from "@/types/config";
import { cn } from "@/lib/utils";

type Props = {
  dish: Dish;
  index: number;
  onOpen: (dish: Dish) => void;
};

export const DishCard = ({ dish, index, onOpen }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);

  const handleEnter = () => {
    setHovering(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };
  const handleLeave = () => {
    setHovering(false);
    videoRef.current?.pause();
  };

  // Asymmetric layout: every 3rd item taller
  const tall = index % 3 === 1;

  return (
    <button
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={() => onOpen(dish)}
      className={cn(
        "group relative flex flex-col text-left transition-transform duration-700 ease-smooth",
        "hover:-translate-y-1"
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-sm bg-muted shadow-soft",
          tall ? "aspect-[3/4]" : "aspect-[4/5]"
        )}
      >
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          width={1024}
          height={1280}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-smooth",
            hovering ? "scale-105 opacity-0" : "scale-100 opacity-100"
          )}
        />
        {dish.video && (
          <video
            ref={videoRef}
            src={dish.video}
            muted
            loop
            playsInline
            preload="none"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              hovering ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Bottom gradient + price */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-ink opacity-90" />

        {dish.signature && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground shadow-soft">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Signature
          </span>
        )}

        {dish.video && (
          <span
            className={cn(
              "absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/95 text-foreground shadow-soft transition-transform duration-500 ease-smooth",
              hovering ? "scale-110" : "scale-100"
            )}
            aria-hidden
          >
            <Play className="h-3.5 w-3.5 fill-current" />
          </span>
        )}

        {/* Bottom info overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <div className="flex items-end justify-between gap-4">
            <h3 className="font-display text-xl font-medium leading-tight text-background md:text-2xl">
              {dish.name}
            </h3>
            <span className="font-display text-lg text-background/95 md:text-xl">
              {dish.price}€
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 max-w-[44ch] text-sm leading-relaxed text-muted-foreground">
        {dish.description}
      </p>
    </button>
  );
};