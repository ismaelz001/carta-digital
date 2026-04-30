import fs from 'node:fs';

const items = JSON.parse(fs.readFileSync('F:/carta-digital/.tmp/raxoi-menu.json', 'utf8'));

// Categorías ordenadas + metadata visual
const categoryMeta = {
  desayunos:    { label: 'Desayunos',     subtitle: 'Hasta media mañana',       image: './assets/raxoi/dishes/croissant.jpg' },
  bocadillos:   { label: 'Bocadillos',    subtitle: 'Pan recién hecho',         image: './assets/raxoi/dishes/bocadillo.jpg' },
  hamburguesas: { label: 'Hamburguesas',  subtitle: 'Carne 100% de vacuno',     image: './assets/raxoi/dishes/hamburguesa.jpg' },
  tostas:       { label: 'Tostas',        subtitle: 'Pan de masa madre',        image: './assets/raxoi/dishes/tostada.jpg' },
  raciones:     { label: 'Raciones',      subtitle: 'Para compartir',           image: './assets/raxoi/dishes/patatas-bravas.jpg' },
  pizzas:       { label: 'Pizzas',        subtitle: 'Masa fina al horno',       image: './assets/raxoi/dishes/pizza.jpg' },
  ensaladas:    { label: 'Ensaladas',     subtitle: 'Verduras frescas',         image: './assets/raxoi/dishes/ensalada-cesar.jpg' },
  arroces:      { label: 'Arroces',       subtitle: 'Para 2 personas',          image: './assets/raxoi/dishes/arroz-marisco.jpg' },
  pescados:     { label: 'Pescados',      subtitle: 'Lonja del día',            image: './assets/raxoi/dishes/rodaballo.jpg' },
  mariscos:     { label: 'Mariscos',      subtitle: 'Frescos de las rías',      image: './assets/raxoi/dishes/mariscada.jpg' },
  carnes:       { label: 'Carnes',        subtitle: 'A la brasa',               image: './assets/raxoi/dishes/chuleton.jpg' },
  postres:      { label: 'Postres',       subtitle: 'Dulce final',              image: './assets/raxoi/dishes/tarta-queso.jpg' },
  infantil:     { label: 'Menú Infantil', subtitle: 'Para los más peques',      image: './assets/raxoi/dishes/menu-infantil.jpg' },
};

const categoryOrder = ['desayunos','bocadillos','hamburguesas','tostas','raciones','pizzas','ensaladas','arroces','pescados','mariscos','carnes','postres','infantil'];

// Fotos disponibles → keywords para matchear con el name del plato
const photoMap = [
  { kw: ['pulpo'],                   img: './assets/raxoi/dishes/pulpo-feira.jpg' },
  { kw: ['arroz', 'marisco'],        img: './assets/raxoi/dishes/arroz-marisco.jpg' },
  { kw: ['mariscada','tabla de nuestros mariscos'], img: './assets/raxoi/dishes/mariscada.jpg' },
  { kw: ['chuletón','chuleta'],      img: './assets/raxoi/dishes/chuleton.jpg' },
  { kw: ['entrecot'],                img: './assets/raxoi/dishes/entrecot.jpg' },
  { kw: ['rodaballo','dorada'],      img: './assets/raxoi/dishes/rodaballo.jpg' },
  { kw: ['lubina','merluza','bacalao'], img: './assets/raxoi/dishes/rodaballo.jpg' },
  { kw: ['almeja'],                  img: './assets/raxoi/dishes/almejas.jpg' },
  { kw: ['navaja'],                  img: './assets/raxoi/dishes/navajas.jpg' },
  { kw: ['hamburguesa'],             img: './assets/raxoi/dishes/hamburguesa.jpg' },
  { kw: ['margarita'],               img: './assets/raxoi/dishes/pizza-margarita.jpg' },
  { kw: ['pizza'],                   img: './assets/raxoi/dishes/pizza.jpg' },
  { kw: ['césar','cesar'],           img: './assets/raxoi/dishes/ensalada-cesar.jpg' },
  { kw: ['ensalada'],                img: './assets/raxoi/dishes/ensalada-cesar.jpg' },
  { kw: ['croissant','cruasán'],     img: './assets/raxoi/dishes/croissant.jpg' },
  { kw: ['tortita'],                 img: './assets/raxoi/dishes/tortitas.jpg' },
  { kw: ['bowl','yogur'],            img: './assets/raxoi/dishes/bowl-yogur.jpg' },
  { kw: ['tosta'],                   img: './assets/raxoi/dishes/tostada.jpg' },
  { kw: ['sandwich','bocadillo'],    img: './assets/raxoi/dishes/bocadillo.jpg' },
  { kw: ['tortilla'],                img: './assets/raxoi/dishes/tortilla.jpg' },
  { kw: ['patata'],                  img: './assets/raxoi/dishes/patatas-bravas.jpg' },
  { kw: ['queso','tarta'],           img: './assets/raxoi/dishes/tarta-queso.jpg' },
  { kw: ['tiramisú','tiramisu'],     img: './assets/raxoi/dishes/tiramisu.jpg' },
  { kw: ['fondant','coulant','chocolate'], img: './assets/raxoi/dishes/fondant.jpg' },
  { kw: ['café','cafe'],             img: './assets/raxoi/dishes/cafe.jpg' },
  { kw: ['vino'],                    img: './assets/raxoi/dishes/vino-tinto.jpg' },
  { kw: ['infantil'],                img: './assets/raxoi/dishes/menu-infantil.jpg' },
];

// Heros por categoría como fallback final cuando no hay foto específica:
const fallbackByCategory = {
  desayunos: './assets/raxoi/dishes/croissant.jpg',
  bocadillos: './assets/raxoi/dishes/bocadillo.jpg',
  hamburguesas: './assets/raxoi/dishes/hamburguesa.jpg',
  tostas: './assets/raxoi/dishes/tostada.jpg',
  raciones: './assets/raxoi/dishes/patatas-bravas.jpg',
  pizzas: './assets/raxoi/dishes/pizza.jpg',
  ensaladas: './assets/raxoi/dishes/ensalada-cesar.jpg',
  arroces: './assets/raxoi/dishes/arroz-marisco.jpg',
  pescados: './assets/raxoi/dishes/rodaballo.jpg',
  mariscos: './assets/raxoi/dishes/mariscada.jpg',
  carnes: './assets/raxoi/dishes/chuleton.jpg',
  postres: './assets/raxoi/dishes/tarta-queso.jpg',
  infantil: './assets/raxoi/dishes/menu-infantil.jpg',
};

function findPhoto(name) {
  const n = name.toLowerCase();
  for (const m of photoMap) {
    if (m.kw.some(k => n.includes(k))) return m.img;
  }
  return null;
}

// Slugify
function slug(str, idx) {
  const base = str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return `${base}-${idx}`;
}

// Construir dishes con foto + decisión signature/popular
const SIGNATURE_KW = ['arroz', 'parrillada', 'sartén', 'brunch', 'mariscada', 'chuletón'];
const POPULAR_KW   = ['pulpo','tarta de queso','hamburguesa nº 1','pizza nº 1','tortita'];

const dishes = [];
let idx = 0;
let withPhoto = 0;
for (const cat of categoryOrder) {
  const list = items.filter(i => i.category === cat);
  for (const it of list) {
    idx++;
    const photo = findPhoto(it.name) || findPhoto(it.description) || fallbackByCategory[cat];
    if (findPhoto(it.name) || findPhoto(it.description)) withPhoto++;
    const lower = (it.name + ' ' + it.description).toLowerCase();
    const signature = SIGNATURE_KW.some(k => lower.includes(k));
    const popular = POPULAR_KW.some(k => lower.includes(k));
    dishes.push({
      id: slug(it.name, idx),
      name: it.name,
      description: it.description || '',
      price: it.price,
      category: cat,
      image: photo,
      ...(signature ? { signature: true } : {}),
      ...(popular ? { popular: true } : {}),
      available: true,
    });
  }
}

console.log('Dishes totales:', dishes.length);
console.log('Con foto específica (no fallback):', withPhoto);
console.log('Signature:', dishes.filter(d=>d.signature).length);
console.log('Popular:', dishes.filter(d=>d.popular).length);

// Construir config completo
const config = {
  name: 'Raxoi',
  tagline: 'La mejor comida con las mejores vistas a la Catedral',
  description: 'Restaurante en la zona vieja de Santiago de Compostela. Cocina gallega tradicional con producto fresco y vistas inmejorables.',
  logo: './assets/raxoi/logo.png',
  initials: 'RX',
  founded: 2023,

  address: 'Avda Raxoi 3, 15705 Santiago de Compostela',
  city: 'Santiago de Compostela',
  phone: '+34 981 07 15 85',
  reservas: 'tel:+34981071585',
  email: 'caferestauranteraxoi@gmail.com',
  mapsUrl: 'https://maps.google.com/?q=Avda+Raxoi+3,+15705+Santiago+de+Compostela',
  website: 'https://www.raxoi.es',

  social: {},

  accentColor: '#3D6B43', // verde gallego apagado
  heroImage: './assets/raxoi/hero-terraza.jpg',
  season: 'Carta 2026',

  // Aviso real de la web: 10% suplemento en terraza
  noticeFooter: 'Los precios indicados corresponden al consumo en sala. En terraza se aplicará un suplemento del 10%.',

  eventBanner: {
    text: 'Terraza con vistas a la Catedral · Reserva ya',
    emoji: '🌿',
    active: true,
  },

  dailyMenu: { active: false },

  openingHours: [
    { label: 'Lunes – Domingo', hours: '07:45 – 01:00' },
    { label: 'Cocina', hours: '08:00 – 23:30' },
  ],

  footerQuote: 'Cocina gallega de siempre, con la mejor vista de Santiago.',
  footerQuoteAuthor: 'Restaurante Raxoi',

  languages: ['es'],

  categories: categoryOrder.map(id => ({ id, ...categoryMeta[id] })),

  dishes,
};

fs.writeFileSync('F:/carta-digital/public/config.json', JSON.stringify(config, null, 2));
console.log('\n✓ config.json escrito en public/config.json');
