import fs from 'node:fs';

const res = await fetch('https://www.raxoi.es/');
const html = Buffer.from(await res.arrayBuffer()).toString('utf8');

const CAT = {
  breakfast: 'desayunos', sandwich: 'bocadillos', burgers: 'hamburguesas',
  toasts: 'tostas', rations: 'raciones', pizzas: 'pizzas', salads: 'ensaladas',
  fish: 'pescados', rices: 'arroces', mariscos: 'mariscos', meat: 'carnes',
  infantil: 'infantil', dessert: 'postres',
};

const parts = html.split(/<div class="col-lg-6 menu-item filter-/);
const items = [];
for (const part of parts.slice(1)) {
  const fm = part.match(/^([a-z]+)"/);
  if (!fm) continue;
  const cat = CAT[fm[1]];
  if (!cat) continue;

  const nameMatch = part.match(/<a [^>]*>([\s\S]*?)<\/a>/);
  const priceMatch = part.match(/<span>([\s\S]*?)<\/span>/);
  const descMatch = part.match(/<div class="menu-ingredients">([\s\S]*?)<\/div>/);

  const name = nameMatch ? clean(nameMatch[1]) : '';
  const priceRaw = priceMatch ? clean(priceMatch[1]) : '';
  const description = descMatch ? clean(descMatch[1]) : '';
  const priceNum = parseFloat(priceRaw.replace(/[€\s]/g, '').replace(',', '.'));

  if (name && !isNaN(priceNum)) items.push({ category: cat, name, price: priceNum, description });
}

function clean(s) {
  return s.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();
}

const grouped = {};
for (const it of items) (grouped[it.category] ||= []).push(it);
console.log('Total:', items.length);
for (const [k, v] of Object.entries(grouped)) console.log(' ', k, v.length);

fs.writeFileSync('F:/carta-digital/.tmp/raxoi-menu.json', JSON.stringify(items, null, 2));

console.log('\n--- MUESTRAS ---');
for (const c of ['mariscos', 'carnes', 'arroces', 'postres', 'pescados', 'pizzas']) {
  console.log('\n' + c.toUpperCase());
  (grouped[c] || []).slice(0, 3).forEach(i => console.log(' •', i.name, '·', i.price + '€', '|', i.description.slice(0, 90) || '(sin desc)'));
}
