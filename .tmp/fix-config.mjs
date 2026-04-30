// fix-config.mjs — aplica todas las correcciones al config.json de Raxoi
import fs from 'node:fs';

const config = JSON.parse(fs.readFileSync('F:/carta-digital/public/config.json', 'utf8'));

// ─── Photomap mejorado para raciones gallegas ───────────────────────────────
const photoMap = [
  { kw: ['pulpo','pulpo á feira','polbo'],       img: './assets/raxoi/dishes/pulpo-feira.jpg' },
  { kw: ['arroz'],                               img: './assets/raxoi/dishes/arroz-marisco.jpg' },
  { kw: ['mariscada','tabla de nuestros mariscos'], img: './assets/raxoi/dishes/mariscada.jpg' },
  { kw: ['chuletón','chuleta'],                  img: './assets/raxoi/dishes/chuleton.jpg' },
  { kw: ['entrecot'],                            img: './assets/raxoi/dishes/entrecot.jpg' },
  { kw: ['rodaballo','dorada','lubina','merluza','bacalao','lenguado'], img: './assets/raxoi/dishes/rodaballo.jpg' },
  { kw: ['calamar','chipiron','chipirón'],        img: './assets/raxoi/dishes/calamar-ria.jpg' },
  { kw: ['almeja'],                              img: './assets/raxoi/dishes/almejas.jpg' },
  { kw: ['navaja'],                              img: './assets/raxoi/dishes/navajas.jpg' },
  { kw: ['mejillón','mejillones','berberecho','berberechos'], img: './assets/raxoi/dishes/mejillones.jpg' },
  { kw: ['langostino','langostinos'],            img: './assets/raxoi/dishes/mariscada.jpg' },
  { kw: ['bogavante','buey de mar','centollo','percebe'], img: './assets/raxoi/dishes/mariscada.jpg' },
  { kw: ['zamburiña'],                           img: './assets/raxoi/dishes/mariscada.jpg' },
  { kw: ['hamburguesa','burger'],                img: './assets/raxoi/dishes/hamburguesa.jpg' },
  { kw: ['jamón ibérico','jamon iberico','jamón serrano'],  img: './assets/raxoi/dishes/jamon.jpg' },
  { kw: ['pizza nº 2','pizza nº 3','pizza ibérica'],       img: './assets/raxoi/dishes/pizza-margarita.jpg' },
  { kw: ['pizza'],                               img: './assets/raxoi/dishes/pizza.jpg' },
  { kw: ['césar','cesar'],                       img: './assets/raxoi/dishes/ensalada-cesar.jpg' },
  { kw: ['ensalada'],                            img: './assets/raxoi/dishes/ensalada-cesar.jpg' },
  { kw: ['croissant','cruasán'],                 img: './assets/raxoi/dishes/croissant.jpg' },
  { kw: ['tortita','tortitas'],                  img: './assets/raxoi/dishes/tortitas.jpg' },
  { kw: ['bowl','yogur'],                        img: './assets/raxoi/dishes/bowl-yogur.jpg' },
  { kw: ['tosta','pan tumaca','aceite de oliva + tomate'], img: './assets/raxoi/dishes/tostada.jpg' },
  { kw: ['bocadillo','sandwich'],                img: './assets/raxoi/dishes/bocadillo.jpg' },
  { kw: ['pan con','pan +'],                     img: './assets/raxoi/dishes/tostada.jpg' },
  { kw: ['pan'],                                 img: './assets/raxoi/dishes/tostada.jpg' },
  { kw: ['tortilla'],                            img: './assets/raxoi/dishes/tortilla.jpg' },
  { kw: ['patata','patatas fritas'],             img: './assets/raxoi/dishes/patatas-bravas.jpg' },
  { kw: ['croqueta','croquetas'],                img: './assets/raxoi/dishes/croquetas-gallegas.jpg' },
  { kw: ['empanada'],                            img: './assets/raxoi/dishes/empanada.jpg' },
  { kw: ['lacón','cacheira','cocido','caldo'],   img: './assets/raxoi/dishes/cocido-gallego.jpg' },
  { kw: ['queso al horno','tarta de queso','tarta de lotus','tarta sacher','tarta de chocolate'], img: './assets/raxoi/dishes/tarta-queso.jpg' },
  { kw: ['tiramisú','tiramisu'],                 img: './assets/raxoi/dishes/tiramisu.jpg' },
  { kw: ['fondant','coulant','chocolate'],       img: './assets/raxoi/dishes/fondant.jpg' },
  { kw: ['helado','sorbete'],                    img: './assets/raxoi/dishes/tarta-queso.jpg' },
  { kw: ['café','cafe','capuccino','cortado'],   img: './assets/raxoi/dishes/cafe.jpg' },
  { kw: ['vino'],                                img: './assets/raxoi/dishes/vino-tinto.jpg' },
  { kw: ['embutido','jamón ibérico','jamón serrano','jamon'], img: './assets/raxoi/dishes/jamon.jpg' },
  { kw: ['tabla de quesos','queso país'],        img: './assets/raxoi/dishes/tabla-quesos.jpg' },
  { kw: ['verdura','tempura'],                   img: './assets/raxoi/dishes/verduras.jpg' },
];

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

function findPhoto(text) {
  const n = text.toLowerCase();
  for (const m of photoMap) {
    if (m.kw.some(k => n.includes(k))) return m.img;
  }
  return null;
}

function promoteDescription(name, desc) {
  // Si el nombre es genérico numerado ("Ración Nº 3", "Pizza Nº 1"…) y hay descripción, usar descripción como nombre
  if (/^(ración|bocadillo|tosta|burger|pizza|ensalada|menú infantil|desayuno|hamburguesa)\s+nº\s*\d+$/i.test(name.trim())) {
    return desc && desc.trim() ? desc.trim() : name;
  }
  return name;
}

let fixed = 0, photoFixed = 0;
config.dishes = config.dishes.map(dish => {
  const newName = promoteDescription(dish.name, dish.description);
  if (newName !== dish.name) fixed++;

  // Recalcular foto usando nombre real (puede ser desc promovida)
  const searchText = newName + ' ' + dish.description;
  const newPhoto = findPhoto(searchText) || fallbackByCategory[dish.category] || dish.image;
  if (newPhoto !== dish.image) photoFixed++;

  // Limpiar description si es idéntica al nombre (evita "Pan / Pan")
  const cleanDesc = (newName === dish.description?.trim()) ? undefined : dish.description;

  return { ...dish, name: newName, description: cleanDesc, image: newPhoto };
});

// Typo TTarta
config.dishes = config.dishes.map(d => ({
  ...d,
  name: d.name.replace(/^TTarta/, 'Tarta'),
  description: d.description?.replace(/^TTarta/, 'Tarta'),
}));

// accentColor con mejor contraste
config.accentColor = '#4A8A52';

console.log(`Nombres promovidos: ${fixed}`);
console.log(`Fotos recalculadas: ${photoFixed}`);
console.log(`TTarta typo: corregido`);

// Muestra de raciones
const rac = config.dishes.filter(d=>d.category==='raciones').slice(0,6);
console.log('\nRaciones ejemplo:');
rac.forEach(d => console.log(' •', d.name.slice(0,50), '→', d.image.split('/').pop()));

fs.writeFileSync('F:/carta-digital/public/config.json', JSON.stringify(config, null, 2));
console.log('\n✓ config.json actualizado');
