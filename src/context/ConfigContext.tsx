import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { RestaurantConfig } from "@/types/config";

// ─────────────────────────────────────────────────────────────────────────────
// Contexto global del config del cliente
// Se carga una sola vez al montar la app desde ./config.json
// Para multi-tenant: cada carpeta de cliente tiene su propio config.json
// ─────────────────────────────────────────────────────────────────────────────

type ConfigState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; config: RestaurantConfig };

const ConfigContext = createContext<ConfigState>({ status: "loading" });

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ConfigState>({ status: "loading" });

  useEffect(() => {
    // Permite override vía query param ?config=./otro.json para demos
    const params = new URLSearchParams(window.location.search);
    const configUrl = params.get("config") ?? "./config.json";

    fetch(configUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<RestaurantConfig>;
      })
      .then((config) => {
        // Aplicar accent color dinámico si está definido
        if (config.accentColor) {
          applyAccentColor(config.accentColor);
        }
        setState({ status: "ready", config });
      })
      .catch((err) => {
        console.error("[ConfigContext] Error cargando config.json:", err);
        setState({ status: "error", message: err.message });
      });
  }, []);

  return (
    <ConfigContext.Provider value={state}>{children}</ConfigContext.Provider>
  );
};

/** Hook principal: devuelve el config o lanza loading/error */
export const useConfig = (): RestaurantConfig => {
  const state = useContext(ConfigContext);
  if (state.status !== "ready") {
    throw new Error("useConfig debe usarse dentro de ConfigProvider y con config cargado");
  }
  return state.config;
};

/** Hook seguro: devuelve el estado completo para manejar loading/error */
export const useConfigState = (): ConfigState => {
  return useContext(ConfigContext);
};

// ─────────────────────────────────────────────────────────────────────────────
// Aplica el color de acento del cliente sobreescribiendo las variables CSS
// Convierte un color hex a los componentes HSL que usa Tailwind/shadcn
// ─────────────────────────────────────────────────────────────────────────────
function applyAccentColor(hex: string) {
  try {
    const [h, s, l] = hexToHsl(hex);
    const root = document.documentElement;
    root.style.setProperty("--primary", `${h} ${s}% ${l}%`);
    root.style.setProperty("--ring", `${h} ${s}% ${l}%`);
    // Foreground del primary (blanco si oscuro, negro si claro)
    const fgL = l < 55 ? "97%" : "10%";
    root.style.setProperty("--primary-foreground", `${h} 20% ${fgL}`);
  } catch {
    // si el color no es válido, ignorar
  }
}

function hexToHsl(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
