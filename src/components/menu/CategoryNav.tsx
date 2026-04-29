import { useConfig } from "@/context/ConfigContext";
import { cn } from "@/lib/utils";

type Props = {
  active: string;
  onChange: (id: string) => void;
};

export const CategoryNav = ({ active, onChange }: Props) => {
  const { categories } = useConfig();

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-6 py-4 md:gap-2 md:px-12">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={cn(
                "group relative flex shrink-0 flex-col items-start rounded-sm px-4 py-2 text-left transition-colors duration-300 ease-smooth",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="font-display text-lg font-medium md:text-xl">
                {cat.label}
              </span>
              {cat.subtitle && (
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">
                  {cat.subtitle}
                </span>
              )}
              <span
                className={cn(
                  "absolute -bottom-[17px] left-4 right-4 h-px origin-left bg-primary transition-transform duration-500 ease-smooth",
                  isActive ? "scale-x-100" : "scale-x-0"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};