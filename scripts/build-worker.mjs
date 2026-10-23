import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json'
};
const names = [
  'index.html', 'privacy.html', 'terms.html', '404.html', 'styles.css', 'script.js',
  'robots.txt', 'sitemap.xml', 'site.webmanifest', 'assets/favicon.svg',
  'assets/apple-touch-icon.png', 'assets/og-image.png'
];
const files = {};
for (const name of names) {
  const bytes = await readFile(path.join(root, name));
  const binary = name.endsWith('.png');
  files['/' + name] = {
    body: bytes.toString(binary ? 'base64' : 'utf8'), binary,
    type: types[path.extname(name)], size: bytes.length,
    etag: '"' + createHash('sha256').update(bytes).digest('hex') + '"'
  };
}
const headers = {};
let global = false;
for (const line of (await readFile(path.join(root, '_headers'), 'utf8')).split('\n')) {
  if (!line.trim()) continue;
  if (!line.startsWith(' ')) { global = line.trim() === '/*'; continue; }
  const split = line.indexOf(':');
  if (global && split > 0) headers[line.slice(0, split).trim()] = line.slice(split + 1).trim();
}
const structuredData = files['/index.html'].body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
if (structuredData) {
  const hash = createHash('sha256').update(structuredData).digest('base64');
  headers['Content-Security-Policy'] = headers['Content-Security-Policy'].replace("script-src 'self'", "script-src 'self' 'sha256-" + hash + "'");
}
const handler = `
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname === 'www.resultsquantified.com' || url.protocol !== 'https:') {
      url.protocol = 'https:';
      if (url.hostname === 'www.resultsquantified.com') url.hostname = 'resultsquantified.com';
      return new Response(null, {status: 301, headers: {...SECURITY, Location: url.href}});
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {status: 405, headers: {...SECURITY, Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8'}});
    }
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); }
    catch { return new Response('Bad request', {status: 400, headers: SECURITY}); }
    if (pathname === '/index.html') {
      url.pathname = '/';
      return new Response(null, {status: 301, headers: {...SECURITY, Location: url.href}});
    }
    if (pathname === '/') pathname = '/index.html';
    if (pathname === '/privacy' || pathname === '/terms') pathname += '.html';
    const found = Object.hasOwn(FILES, pathname);
    const file = found ? FILES[pathname] : FILES['/404.html'];
    const headers = new Headers(SECURITY);
    headers.set('Content-Type', file.type);
    headers.set('Cache-Control', found ? (pathname.startsWith('/assets/') ? 'public, max-age=86400' : 'public, max-age=0, must-revalidate') : 'no-store');
    if (found) {
      headers.set('ETag', file.etag);
      const tags = (request.headers.get('If-None-Match') || '').split(',').map(tag => tag.trim().replace(/^W\\//, ''));
      if (tags.includes('*') || tags.includes(file.etag)) return new Response(null, {status: 304, headers});
    }
    headers.set('Content-Length', String(file.size));
    const body = request.method === 'HEAD' ? null : file.binary ? Uint8Array.from(atob(file.body), c => c.charCodeAt(0)) : file.body;
    return new Response(body, {status: found ? 200 : 404, headers});
  }
};
`;
await mkdir(path.join(root, 'deployment'), { recursive: true });
const worker = 'const FILES = ' + JSON.stringify(files) + ';\nconst SECURITY = ' + JSON.stringify(headers) + ';\n' + handler;
await writeFile(path.join(root, 'deployment/worker.mjs'), worker);
console.log(JSON.stringify({files: names.length, worker_bytes: Buffer.byteLength(worker)}));
