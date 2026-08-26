// Enveely — Not found page.

import { renderPage } from '../ui/app-shell.js';

export function renderNotFound() {
  renderPage(`
    <section class="section notfound">
      <div class="container notfound__inner">
        <p class="eyebrow">404</p>
        <h1 data-i18n="notfound.title">Halaman tidak ditemukan</h1>
        <p class="muted" data-i18n="notfound.subtitle">Tautan yang kalian buka tidak ada atau sudah dipindahkan.</p>
        <a href="/" data-link class="btn btn--primary" data-i18n="notfound.cta">Ke Halaman Utama</a>
      </div>
    </section>
  `);
}
