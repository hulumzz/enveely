// Enveely — App shell: navbar (desktop + mobile drawer), page outlet, footer.
// Auth-aware: shows Masuk/Daftar or the user's avatar menu.

import { state, subscribe, setLocale } from '../state.js';
import { t, applyTranslations } from '../i18n.js';
import { analyticsEvents } from '../services/analytics.js';
import { onAuthChange, logout } from '../services/auth.js';
import { icon } from '../core/icons.js';
import { openModal, toast } from './overlays.js';

export function mountAppShell(root) {
  root.innerHTML = `
    <header class="navbar">
      <div class="navbar__inner container">
        <a href="/" data-link class="navbar__logo" aria-label="Beranda Enveely">EN<span>VEELY</span></a>

        <nav class="navbar__links" id="nav-links" aria-label="Navigasi utama">
          <a href="/" data-link data-nav>Beranda</a>
          <a href="/templates" data-link data-nav>Pilih Desain</a>
          <a href="/#why-us" data-link data-nav>Kenapa Enveely</a>
          <a href="/#product" data-link data-nav>Koleksi Desain</a>
          <div class="navbar__links-actions">
            <a href="/dashboard" data-link data-nav class="nav-secondary" data-auth="in">Undangan Saya</a>
            <a href="/login" data-link data-nav class="btn btn--ghost btn--sm" data-auth="out">Masuk</a>
            <a href="/login?mode=register" data-link data-nav class="btn btn--primary btn--sm" data-auth="out">Mulai Gratis</a>
          </div>
        </nav>

        <div class="navbar__actions">
          <div class="lang-switch" role="group" aria-label="Bahasa">
            <button type="button" data-locale="id" class="lang-switch__btn">ID</button>
            <button type="button" data-locale="en" class="lang-switch__btn">EN</button>
          </div>
          <button type="button" class="navbar__toggle" aria-label="Buka menu" aria-expanded="false"
                  aria-controls="nav-links">${icon('menu', { size: 22 })}</button>
        </div>
      </div>
    </header>

    <main id="page-outlet" class="page-outlet"></main>

    <footer class="footer">
      <div class="container">
        <div class="footer__brand">Enveely</div>
        <p class="footer__tagline">Undangan yang terasa seperti kalian.</p>
        <div class="footer__grid">
          <div class="footer__col">
            <h4>Produk</h4>
            <a href="/templates" data-link>Jelajahi Desain</a>
            <a href="/create" data-link>Buat Undangan</a>
            <a href="/dashboard" data-link>Kelola Undangan</a>
          </div>
          <div class="footer__col">
            <h4>Jelajahi</h4>
            <a href="/#why-us" data-link>Kenapa Enveely</a>
            <a href="/#product" data-link>Koleksi Desain</a>
            <a href="/#how-it-works" data-link>Cara Membuatnya</a>
          </div>
          <div class="footer__col">
            <h4>Akun</h4>
            <a href="/login" data-link>Masuk ke Akun</a>
            <a href="/login?mode=register" data-link>Buat Akun Gratis</a>
          </div>
          <div class="footer__col">
            <h4>Bantuan</h4>
            <a href="/help" data-link>Pusat Bantuan</a>
            <a href="/privacy" data-link>Privasi</a>
            <a href="/terms" data-link>Ketentuan</a>
          </div>
        </div>
        <div class="footer__base">
          <span>&copy; ${new Date().getFullYear()} Enveely. Dibuat dengan penuh perhatian.</span>
          <span>Setiap cerita layak diundang dengan indah.</span>
        </div>
      </div>
    </footer>

    <div id="toast-root" aria-live="polite"></div>
  `;

  wireLocaleSwitcher(root);
  wireMobileNav(root);
  wireAuthUI(root);
  reflectLocale(state.app.locale);
  subscribe('app', (slice) => reflectLocale(slice.locale));
  applyTranslations(root);
}

function wireLocaleSwitcher(root) {
  root.querySelectorAll('.lang-switch__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.locale !== state.app.locale) {
        setLocale(btn.dataset.locale);
        analyticsEvents.languageChanged(btn.dataset.locale);
      }
    });
  });
}

function reflectLocale(locale) {
  document.querySelectorAll('.lang-switch__btn').forEach((btn) => {
    const active = btn.dataset.locale === locale;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

function wireMobileNav(root) {
  const toggle = root.querySelector('.navbar__toggle');
  const links = root.querySelector('#nav-links');

  toggle?.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? icon('close', { size: 22 }) : icon('menu', { size: 22 });
  });

  // Close drawer on link tap.
  links?.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      document.body.classList.remove('nav-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      document.body.classList.remove('nav-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
}

function wireAuthUI(root) {
  onAuthChange((user) => {
    root.querySelectorAll('[data-auth]').forEach((el) => {
      el.style.display = el.dataset.auth === (user ? 'in' : 'out') ? '' : 'none';
    });

    let account = root.querySelector('[data-account-menu]');
    if (user && !account) {
      account = document.createElement('div');
      account.className = 'navbar__account';
      account.setAttribute('data-account-menu', '');
      account.innerHTML = `
        <button type="button" class="navbar__avatar" aria-haspopup="menu">
          ${user.photoURL
            ? `<img src="${escapeHtml(user.photoURL)}" alt="" referrerpolicy="no-referrer"/>`
            : `<span>${escapeHtml((user.displayName || 'U').charAt(0).toUpperCase())}</span>`}
        </button>`;
      account.querySelector('button').addEventListener('click', () => {
        openModal({
          title: user.displayName || 'Akun',
          body: `<p>${escapeHtml(user.email || '')}</p>`,
          actions: [
            { label: 'Keluar', onClick: async () => { await logout(); toast('Sampai jumpa!', { type: 'success' }); } },
            { label: 'Tutup', kind: 'primary' },
          ],
        });
      });
      root.querySelector('.navbar__actions')?.prepend(account);
    } else if (!user && account) {
      account.remove();
    }
  });
}

/** Render a page component into the outlet and apply i18n to its static texts. */
export function renderPage(html, setup) {
  const outlet = document.getElementById('page-outlet');
  if (!outlet) return;
  outlet.innerHTML = html;
  applyTranslations(outlet);
  if (typeof setup === 'function') setup(outlet);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export { t };
function escapeHtml(value) {return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
