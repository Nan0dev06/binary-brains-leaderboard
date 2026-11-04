// build.mjs — turns byte-design.json into byte.svg and the ART block inside byte-mascot.js.
//   node build.mjs          rebuild from the saved design (defaults if there is none)
// serve.mjs calls writeOutputs() whenever the designer saves.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { buildByte, normalize, staticSvg } from './byte-art.mjs';

const at = name => new URL(name, import.meta.url);
const MARKERS = /\/\*ART\*\/[\s\S]*?\/\*END\*\//;

export async function writeOutputs(input) {
  const design = normalize(input);
  const js = await readFile(at('byte-mascot.js'), 'utf8');
  if (!MARKERS.test(js)) throw new Error('ART markers missing in byte-mascot.js');
  const { markup, viewBox, css, eyeAt } = buildByte(design);
  await writeFile(at('byte-mascot.js'), js.replace(MARKERS, () => `/*ART*/${JSON.stringify({ markup, viewBox, css, eyeAt })}/*END*/`));
  await writeFile(at('byte.svg'), staticSvg(design));
  await writeFile(at('byte-design.json'), JSON.stringify(design, null, 2) + '\n');
  return ['byte-design.json', 'byte.svg', 'byte-mascot.js'];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const saved = await readFile(at('byte-design.json'), 'utf8').then(JSON.parse, () => ({}));
  console.log('wrote', (await writeOutputs(saved)).join(', '));
}
