// ─────────────────────────────────────────────────────────────────────────────
// Tipos del config.json por cliente
// Para añadir un nuevo cliente: crear carpeta en public/clientes/<slug>/
// con su propio config.json y assets/
// ─────────────────────────────────────────────────────────────────────────────

export type DietTag =
  | "Vegetariano"
  | "Vegano"
  | "Sin gluten"
  | "Sin lactosa"
  | "Sin frutos secos"
  | "Contiene alcohol"
  | "Picante"
  | "Picante suave"
  | "Crudo"
  | "Clásico"
  | string;

export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;        // ruta relativa desde public/ o URL absoluta
  images?: string[];    // opcional: 2-3 fotos extra para cross-fade animado
  video?: string;       // ruta relativa o URL
  tags?: DietTag[];
  signature?: boolean;
  popular?: boolean;
  available?: boolean;  // false = tachado/oculto
};

export type Category = {
  id: string;
  label: string;
  subtitle?: string;
  image?: string;
};

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  tripadvisor?: string;
};

export type OpeningHours = {
  label: string;        // e.g. "Lunes – Viernes"
  hours: string;        // e.g. "13:00 – 16:00 · 20:00 – 23:30"
};

export type RestaurantConfig = {
  // Identidad
  name: string;
  tagline?: string;
  description?: string;
  logo?: string;        // ruta a logo SVG/PNG, null = usa initials
  initials?: string;    // fallback si no hay logo
  founded?: number;     // año de fundación, e.g. 1987

  // Contacto y ubicación
  address?: string;
  city?: string;
  phone?: string;
  reservas?: string;    // tel: o https://
  mapsUrl?: string;     // link a Google Maps

  // Redes
  social?: SocialLinks;

  // Branding visual
  accentColor?: string; // hex, ej: "#E5472A". Sobreescribe CSS var --primary
  heroImage: string;    // imagen de portada
  season?: string;      // ej: "Primavera 2026"

  // Banner de evento/noticia (opcional)
  eventBanner?: {
    text: string;
    emoji?: string;
    active: boolean;
  };

  // Menú del día (opcional)
  dailyMenu?: {
    label?: string;
    price: number;
    includes: string[];
    active: boolean;
  };

  // Horario
  openingHours?: OpeningHours[];

  // Quote del footer
  footerQuote?: string;
  footerQuoteAuthor?: string;

  // Idiomas disponibles
  languages?: string[];  // ["es", "en"]

  // Carta
  categories: Category[];
  dishes: Dish[];
};
