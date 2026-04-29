// ─────────────────────────────────────────────────────────────────────────────
// DailyMenuBanner — banner del menú del día configurable
// Se activa con dailyMenu.active = true en config.json
// ─────────────────────────────────────────────────────────────────────────────
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { RestaurantConfig } from "@/types/config";

type Props = {
  menu: NonNullable<RestaurantConfig["dailyMenu"]>;
};

export const DailyMenuBanner = ({ menu }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-primary/20 bg-primary/5">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-4 text-left"
          aria-expanded={open}
        >
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.3em] text-primary">
              {menu.label ?? "Menú del día"}
            </span>
            <span className="font-display text-xl font-medium text-foreground">
              {menu.price.toFixed(2)}€
            </span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-300",
              open && "rotate-180"
            )}
          />
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-400",
            open ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <ul className="space-y-1.5">
            {menu.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
