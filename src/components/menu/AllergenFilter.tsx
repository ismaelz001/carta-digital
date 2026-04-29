// ─────────────────────────────────────────────────────────────────────────────
// AllergenFilter — barra de chips para filtrar por dieta / alérgenos
// Los tags vienen del config.json de cada cliente
// ─────────────────────────────────────────────────────────────────────────────
import { cn } from "@/lib/utils";

// Emojis asociados a tags comunes para hacerlos más visuales
const TAG_EMOJI: Record<string, string> = {
  Vegetariano: "🌿",
  Vegano: "🥦",
  "Sin gluten": "🌾",
  "Sin lactosa": "🥛",
  "Sin frutos secos": "🥜",
  "Contiene alcohol": "🍷",
  Picante: "🌶️",
  "Picante suave": "🌶️",
  Crudo: "🐟",
  Clásico: "⭐",
};

type Props = {
  tags: string[];
  active: string[];
  onChange: (tags: string[]) => void;
};

export const AllergenFilter = ({ tags, active, onChange }: Props) => {
  if (tags.length === 0) return null;

  const toggle = (tag: string) => {
    if (active.includes(tag)) {
      onChange(active.filter((t) => t !== tag));
    } else {
      onChange([...active, tag]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <div className="border-b border-border bg-background/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-6 py-3 md:px-12">
        <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Filtrar:
        </span>

        <div className="flex items-center gap-2">
          {tags.map((tag) => {
            const isActive = active.includes(tag);
            const emoji = TAG_EMOJI[tag] ?? "•";
            return (
              <button
                key={tag}
                onClick={() => toggle(tag)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                )}
              >
                <span>{emoji}</span>
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        {active.length > 0 && (
          <button
            onClick={clearAll}
            className="ml-2 shrink-0 text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
};
