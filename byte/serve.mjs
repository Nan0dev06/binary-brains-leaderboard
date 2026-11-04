// serve.mjs — local server for the playground and the designer.
//   node serve.mjs   then open http://localhost:8737/designer.html
// POST /save stores the design and rebuilds byte.svg + byte-mascot.js. Listens on this machine only.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeOutputs } from './build.mjs';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 8737;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.css': 'text/css', '.png': 'image/png',
};

createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/save') {
      const origin = req.headers.origin;
      if ((origin && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) || req.headers['content-type'] !== 'application/json') {
        return res.writeHead(403).end('forbidden');
      }
      let body = '';
      for await (const chunk of req) body += chunk;
      const files = await writeOutputs(JSON.parse(body));
      return res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ files }));
    }
    let file = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://localhost').pathname)));
    if (!file.startsWith(ROOT)) return res.writeHead(403).end('forbidden');
    if (file.endsWith(sep)) file = join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' }).end(data);
  } catch (err) {
    res.writeHead(err.code === 'ENOENT' || err.code === 'EISDIR' ? 404 : 500).end(String(err.message));
  }
}).listen(PORT, '127.0.0.1', () => console.log(`Byte on http://localhost:${PORT}  ·  designer: /designer.html`));
