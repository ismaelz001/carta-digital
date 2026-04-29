# Carta Digital — Guía de configuración

Carta digital premium para restaurantes. Todo el contenido del local se gestiona desde **un único fichero**: `public/config.json`. No hace falta tocar código.

---

## Estructura de archivos del cliente

```
public/
├── config.json          ← único archivo que debes editar
└── assets/
    ├── hero-restaurant.jpg   ← imagen de portada del home
    ├── logo.png              ← logo del restaurante (opcional)
    ├── dish-*.jpg            ← fotos de platos
    └── videos/
        └── plato-*.mp4       ← vídeos de platos (opcional)
```

> Las imágenes pueden ser **rutas locales** (`./assets/foto.jpg`) o **URLs absolutas** (Unsplash, Cloudinary, etc.).

---

## config.json — referencia completa

### Identidad

| Campo | Tipo | Req. | Descripción |
|---|---|:---:|---|
| `name` | string | ✓ | Nombre del restaurante |
| `tagline` | string | | Eslogan o subtítulo del home |
| `description` | string | | Descripción interna (no se muestra al cliente) |
| `logo` | string \| null | | Ruta al logo. Si es `null`, usa las iniciales |
| `initials` | string | | Iniciales de fallback, ej. `"EL"` |
| `founded` | number | | Año de fundación |

### Contacto y ubicación

| Campo | Tipo | Descripción |
|---|---|---|
| `address` | string | Dirección |
| `city` | string | Ciudad |
| `phone` | string | Teléfono visible, ej. `"+34 971 000 000"` |
| `reservas` | string | Enlace de reservas: `tel:+34...` o `https://...` |
| `mapsUrl` | string | URL de Google Maps |

### Redes sociales

```json
"social": {
  "instagram": "https://instagram.com/turestaurante",
  "facebook":  "https://facebook.com/...",
  "tiktok":    "https://tiktok.com/@...",
  "tripadvisor": "https://tripadvisor.es/..."
}
```

Todos los campos son opcionales. Solo se muestran los que estén presentes.

### Branding visual

| Campo | Tipo | Descripción |
|---|---|---|
| `accentColor` | string | Color de énfasis en hex, ej. `"#E5472A"` |
| `heroImage` | string | **Requerido.** Imagen de portada del home |
| `season` | string | Etiqueta de temporada, ej. `"Verano 2026"` |

### Banner de evento (opcional)

Aparece en la parte superior de la app cuando `active: true`.

```json
"eventBanner": {
  "text": "Menú especial este fin de semana · Reserva tu mesa",
  "emoji": "🍽️",
  "active": true
}
```

### Menú del día (opcional)

```json
"dailyMenu": {
  "label": "Menú del día",
  "price": 19.50,
  "includes": [
    "Primero a elegir entre 3 opciones",
    "Segundo a elegir entre 3 opciones",
    "Postre o café",
    "Pan y bebida incluidos"
  ],
  "active": true
}
```

Ponlo en `active: false` para ocultarlo sin borrarlo.

### Horario

```json
"openingHours": [
  { "label": "Lunes – Viernes", "hours": "13:00 – 16:00 · 20:00 – 23:30" },
  { "label": "Sábados",         "hours": "13:00 – 16:30 · 20:00 – 00:00" },
  { "label": "Domingos",        "hours": "13:00 – 16:30" }
]
```

### Cita del footer (opcional)

```json
"footerQuote": "La buena cocina es honesta, sincera y sencilla.",
"footerQuoteAuthor": "Elizabeth David"
```

---

## Categorías

```json
"categories": [
  {
    "id": "entrantes",
    "label": "Entrantes",
    "subtitle": "Para empezar",
    "image": "./assets/cat-entrantes.jpg"
  }
]
```

| Campo | Req. | Descripción |
|---|:---:|---|
| `id` | ✓ | Identificador único (letras, sin espacios) |
| `label` | ✓ | Nombre visible en la app |
| `subtitle` | | Subtítulo debajo del label |
| `image` | | Foto de la tarjeta de categoría en el home |

---

## Platos

```json
"dishes": [
  {
    "id": "burrata",
    "name": "Burrata di Puglia",
    "description": "Burrata cremosa, tomate raf, albahaca fresca...",
    "price": 16.00,
    "category": "entrantes",
    "image": "./assets/dish-burrata.jpg",
    "images": [
      "./assets/dish-burrata-1.jpg",
      "./assets/dish-burrata-2.jpg",
      "./assets/dish-burrata-3.jpg"
    ],
    "video": "./assets/videos/burrata.mp4",
    "tags": ["Vegetariano", "Sin gluten"],
    "signature": true,
    "popular": false,
    "available": true
  }
]
```

| Campo | Tipo | Req. | Descripción |
|---|---|:---:|---|
| `id` | string | ✓ | Identificador único |
| `name` | string | ✓ | Nombre del plato |
| `description` | string | ✓ | Descripción (se muestra en la ficha del plato) |
| `price` | number | ✓ | Precio en euros, ej. `16.50` |
| `category` | string | ✓ | Debe coincidir con el `id` de una categoría |
| `image` | string | ✓ | Foto del plato (usada con animación ken-burns automática) |
| `images` | string[] | | **Opcional**: 2-3 fotos extra. Si está, hace cross-fade animado entre ellas |
| `video` | string | | Vídeo del plato. Si está, sustituye a las imágenes y reproduce en loop |
| `tags` | string[] | | Etiquetas dietéticas (ver lista abajo) |
| `signature` | boolean | | `true` → aparece como "Plato de autor" + pill en home |
| `popular` | boolean | | `true` → aparece como "Más pedido" si no hay `signature` |
| `available` | boolean | | `false` → el plato se oculta de la carta |

> 💡 **Animaciones automáticas**: Por defecto cada plato tiene un sutil zoom ken-burns sobre su foto. Si añades `images` con varias fotos, se hace cross-fade animado entre ellas. Si añades `video`, reproduce vídeo en loop sin botón de play.

### Etiquetas dietéticas disponibles

`Vegetariano` · `Vegano` · `Sin gluten` · `Sin lactosa` · `Sin frutos secos` · `Contiene alcohol` · `Picante` · `Picante suave` · `Crudo` · `Clásico`

También puedes usar cualquier texto libre como etiqueta.

---

## Flujo de actualización

1. Edita `public/config.json`
2. Si cambias imágenes, sube los nuevos archivos a `public/assets/`
3. Haz push → Vercel despliega automáticamente en ~30 segundos

```bash
git add public/config.json public/assets/
git commit -m "actualizar carta mayo 2026"
git push
```

---

## Preguntas frecuentes

**¿Cómo oculto un plato sin borrarlo?**
Pon `"available": false` en el plato.

**¿Cómo cambio el color corporativo?**
Cambia `"accentColor"` a tu hex, ej. `"#1A6B4A"`.

**¿Las imágenes tienen que estar en el servidor?**
No. Puedes usar URLs de Unsplash, Cloudinary o cualquier CDN directamente.

**¿Puedo tener vídeos sin foto?**
No, el campo `image` es requerido. El vídeo es adicional y opcional.

**¿Dónde está la URL pública de la carta?**
En Vercel, bajo el proyecto `carta-digital`. Puedes apuntarle un dominio propio o un QR personalizado.

