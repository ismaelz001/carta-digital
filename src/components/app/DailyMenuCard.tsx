import { useState } from "react";
import type { RestaurantConfig } from "@/types/config";

type DailyMenu = NonNullable<RestaurantConfig["dailyMenu"]>;

interface Props {
  menu: DailyMenu;
}

export function DailyMenuCard({ menu }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="mx-4 mb-1 rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        background: "linear-gradient(135deg, hsl(20 30% 8%) 0%, hsl(14 35% 11%) 50%, hsl(20 30% 8%) 100%)",
        border: "1px solid rgba(229,71,42,0.25)",
        boxShadow: "0 0 0 1px rgba(229,71,42,0.06), 0 6px 24px rgba(0,0,0,0.35)",
      }}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Glow line top */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)",
        }}
      />

      <div className="px-4 py-3">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Animated dot */}
            <div className="relative flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div
                className="absolute inset-0 rounded-full bg-primary animate-ping"
                style={{ animationDuration: "2s" }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
                  {menu.label ?? "Menú del día"}
                </span>
                <span className="text-[9px] text-white/30 border border-white/10 px-1.5 py-0.5 rounded-full">
                  HOY
                </span>
              </div>
              <p className="text-[11px] text-white/50 mt-0.5">
                {menu.includes.length} platos incluidos · Pan y bebida
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-xl font-bold text-white leading-none">
                {menu.price.toFixed(2).replace(".", ",")}
                <span className="text-sm font-normal text-white/60">€</span>
              </p>
            </div>
            <div
              className="w-6 h-6 rounded-full bg-white/6 flex items-center justify-center transition-transform duration-300"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="2 3.5 5 6.5 8 3.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Expanded content */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: expanded ? 300 : 0 }}
        >
          <div className="pt-3 pb-1 border-t border-white/8 mt-3">
            <ul className="space-y-2">
              {menu.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mt-0.5">
                    <span className="text-[8px] font-bold text-primary">{i + 1}</span>
                  </span>
                  <span className="text-[12px] text-white/70 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-white/40">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Disponible al mediodía · Pregunta al camarero
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
