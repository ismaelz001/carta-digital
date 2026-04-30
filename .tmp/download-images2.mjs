import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';

const DEST = 'F:/carta-digital/public/assets/raxoi/dishes';
const delay = ms => new Promise(r => setTimeout(r, ms));

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      timeout: 25000,
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return get(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8'), raw: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function getWikiThumb(wiki, page) {
  const url = `https://${wiki}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(page)}&prop=pageimages&format=json&pithumbsize=800`;
  const res = await get(url);
  let json;
  try { json = JSON.parse(res.body); } catch { return null; }
  const pages = json.query?.pages;
  const p = pages ? Object.values(pages)[0] : null;
  return p?.thumbnail?.source || null;
}

async function downloadFile(url, dest) {
  const res = await get(url);
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  fs.writeFileSync(dest, res.raw);
  return res.raw.length;
}

const pairs = [
  // ES wiki fallbacks
  { f: 'cocido-gallego.jpg',     wiki: 'es', page: 'Pote_gallego' },
  { f: 'croquetas-gallegas.jpg', wiki: 'es', page: 'Croqueta_de_jamon' },
  { f: 'mejillones.jpg',         wiki: 'es', page: 'Mejillones_a_la_marinera' },
  { f: 'calamar-ria.jpg',        wiki: 'es', page: 'Calamar' },
  { f: 'arroz-marisco.jpg',      wiki: 'es', page: 'Paella_de_mariscos' },
  // EN wiki con delays
  { f: 'tabla-quesos.jpg',       wiki: 'en', page: 'Charcuterie_board' },
  { f: 'tiramisu.jpg',           wiki: 'en', page: 'Tiramisu' },
  { f: 'fondant.jpg',            wiki: 'en', page: 'Chocolate_brownie' },
  { f: 'ensalada-cesar.jpg',     wiki: 'en', page: 'Caesar_salad' },
  { f: 'pizza.jpg',              wiki: 'en', page: 'Pizza' },
  { f: 'pizza-margarita.jpg',    wiki: 'en', page: 'Pizza_Margherita' },
  { f: 'hamburguesa.jpg',        wiki: 'en', page: 'Hamburger' },
  { f: 'bocadillo.jpg',          wiki: 'en', page: 'Bocadillo' },
  { f: 'croissant.jpg',          wiki: 'en', page: 'Croissant' },
  { f: 'tortitas.jpg',           wiki: 'en', page: 'Pancake' },
  { f: 'cafe.jpg',               wiki: 'en', page: 'Espresso' },
  { f: 'vino-tinto.jpg',         wiki: 'en', page: 'Red_wine' },
  { f: 'tarta-queso.jpg',        wiki: 'en', page: 'Cheesecake' },
  { f: 'verduras.jpg',           wiki: 'en', page: 'Vegetable' },
  { f: 'chuleton.jpg',           wiki: 'en', page: 'T-bone_steak' },
  { f: 'entrecot.jpg',           wiki: 'en', page: 'Rib_eye_steak' },
  { f: 'rodaballo.jpg',          wiki: 'en', page: 'Turbot' },
  { f: 'bowl-yogur.jpg',         wiki: 'en', page: 'Muesli' },
  { f: 'tostada.jpg',            wiki: 'en', page: 'Toast_(food)' },
  { f: 'menu-infantil.jpg',      wiki: 'en', page: 'Fast_food' },
];

let ok=0, fail=0;
for (const item of pairs) {
  await delay(500);
  const destPath = path.join(DEST, item.f);
  try {
    const imgUrl = await getWikiThumb(item.wiki, item.page);
    if (!imgUrl) { console.log(`NOIMG  ${item.f}`); fail++; continue; }
    await delay(300);
    const size = await downloadFile(imgUrl, destPath);
    console.log(`OK     ${item.f}  ${Math.round(size/1024)}KB`);
    ok++;
  } catch (e) {
    console.log(`FAIL   ${item.f}: ${e.message}`);
    fail++;
  }
}
console.log(`\nTotal: ${ok} ok, ${fail} no/error`);
