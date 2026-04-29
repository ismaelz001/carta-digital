// ─────────────────────────────────────────────────────────────────────────────
// MobileBottomNav — barra inferior fija en móvil tipo app
// Navegación por categorías + acciones rápidas (reserva, maps)
// ─────────────────────────────────────────────────────────────────────────────
import { Phone, MapPin, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/config";

type Props = {
  categories: Category[];
  active: string;
  onNav: (id: string) => void;
  reservas?: string;
  mapsUrl?: string;
};

export const MobileBottomNav = ({ categories, active, onNav, reservas, mapsUrl }: Props) => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Mostrar máximo 3 categorías + acciones para no saturar
  const visibleCats = categories.slice(0, 3);
  const hasMoreCats = categories.length > 3;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md md:hidden"
      aria-label="Navegación de la carta"
    >
      <div className="flex items-stretch">
        {/* Categorías */}
        {visibleCats.map((cat) => {
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onNav(cat.id)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-3 text-center transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span className={cn(
                "h-0.5 w-4 rounded-full bg-current transition-all duration-300",
                isActive ? "opacity-100" : "opacity-0"
              )} />
              <span className="truncate text-[10px] font-medium uppercase tracking-[0.12em]">
                {cat.label}
              </span>
            </button>
          );
        })}

        {/* Si hay más categorías, un botón de scroll arriba para ver la nav sticky */}
        {hasMoreCats && (
          <button
            onClick={scrollTop}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-3 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Volver arriba para ver todas las categorías"
          >
            <ChevronUp className="h-4 w-4" />
            <span className="text-[10px] font-medium uppercase tracking-[0.12em]">Más</span>
          </button>
        )}

        {/* Separador */}
        <div className="w-px self-stretch bg-border" />

        {/* Maps */}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-3 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Cómo llegar"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-[10px] font-medium uppercase tracking-[0.12em]">Maps</span>
          </a>
        )}

        {/* Reservas */}
        {reservas && (
          <a
            href={reservas}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 bg-primary px-1 py-3 text-primary-foreground transition-opacity hover:opacity-90"
            aria-label="Reservar mesa"
          >
            <Phone className="h-4 w-4" />
            <span className="text-[10px] font-medium uppercase tracking-[0.12em]">Reservar</span>
          </a>
        )}
      </div>
    </nav>
  );
};
