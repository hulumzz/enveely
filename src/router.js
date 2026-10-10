// Enveely — Client-side router using the History API.
// Works with Cloudflare Pages' built-in SPA fallback so deep links
// like /invite/<id> are served index.html and resolved client-side.

import {toast} from './ui/overlays.js';
import { setRoute } from './state.js';

const routes = new Map();

/** Register a route. pattern examples: "/", "/templates", "/invite/:id" */
export function registerRoute(pattern, handler) {
  routes.set(pattern, { pattern, keys: parseKeys(pattern), handler });
}

function parseKeys(pattern) {
  return pattern.split('/').filter(Boolean).filter((seg) => seg.startsWith(':')).map((s) => s.slice(1));
}

function match(pathname) {
  const path = normalize(pathname);
  for (const { pattern, keys, handler } of routes.values()) {
    const patSegs = normalize(pattern).split('/');
    const pathSegs = path.split('/');
    if (patSegs.length !== pathSegs.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < patSegs.length; i++) {
      if (patSegs[i].startsWith(':')) {try{params[patSegs[i].slice(1)] = decodeURIComponent(pathSegs[i]);}catch{return null;}}
      else if (patSegs[i] !== pathSegs[i]) { ok = false; break; }
    }
    if (ok) return { handler, params };
  }
  return null;
}

function normalize(p) {
  const n = p.replace(/\/+$/, '');
  return n === '' ? '/' : n;
}

export function navigate(path, { replace = false } = {}) {
  if (replace) history.replaceState({}, '', path);
  else history.pushState({}, '', path);
  resolve();
}

function resolve() {
  const found = match(window.location.pathname);
  const query = new URLSearchParams(window.location.search);
  document.dispatchEvent(new CustomEvent('env:navigate', { detail: { path: window.location.pathname } }));
  if (found) {
    Promise.resolve(found.handler(found.params, query)).catch(()=>{
      toast('Halaman belum dapat dimuat. Periksa koneksi lalu coba kembali.',{type:'error'});
    });
  } else {
    // Fallback: unknown URL -> landing (404 page can replace this later)
    setRoute('not-found', {});
    import('./pages/not-found.js').then((m) => m.renderNotFound());
  }
}

export function initRouter() {
  window.addEventListener('popstate', resolve);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;
    e.preventDefault();
    navigate(href);
  });
  resolve();
}
