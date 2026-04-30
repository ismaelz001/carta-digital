import fs from 'node:fs';

const res = await fetch('https://www.raxoi.es/');
const buf = Buffer.from(await res.arrayBuffer());
fs.writeFileSync('F:/carta-digital/.tmp/raxoi-raw2.bin', buf);

// Probar las dos interpretaciones más comunes
const asUtf8 = buf.toString('utf8');
const asLatin1 = buf.toString('latin1');

// Buscar el indicio: si vemos "Chuletón" bien escrito, ganador
const tests = [
  { name: 'utf8', txt: asUtf8 },
  { name: 'latin1', txt: asLatin1 },
  { name: 'win1252-as-utf8', txt: Buffer.from(asLatin1, 'binary').toString('utf8') },
];
for (const t of tests) {
  const idx = t.txt.toLowerCase().indexOf('chuletón');
  const idxRaw = t.txt.toLowerCase().indexOf('chulet');
  console.log(t.name, '| chuletón idx=', idx, '| chulet ctx=', idxRaw >= 0 ? JSON.stringify(t.txt.substr(idxRaw, 30)) : 'no');
}

console.log('Header content-type:', res.headers.get('content-type'));
console.log('Bytes:', buf.length);
