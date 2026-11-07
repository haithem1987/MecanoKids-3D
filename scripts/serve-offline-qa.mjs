// Isolated production-build server. Stop only this process to test an unreachable origin.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[3] ?? 'build/qa-offline');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    let filename = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!filename.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    try { if (!(await stat(filename)).isFile()) throw new Error('not a file'); }
    catch { if (path.extname(pathname)) { response.writeHead(404).end(); return; } filename = path.join(root, 'index.html'); }
    response.writeHead(200, { 'Content-Type': types[path.extname(filename)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store', 'Service-Worker-Allowed': '/' });
    response.end(await readFile(filename));
  } catch { response.writeHead(500).end(); }
});
const port = Number(process.argv[2] ?? 7302);
server.listen(port, '127.0.0.1', () => console.log(`QA offline: http://localhost:${port} · PID ${process.pid}`));
