// Enveely — Dashboard: local drafts overview (Design-1.md §48).
// Cloud sync listing activates automatically once Firebase is configured.

import { renderPage } from '../ui/app-shell.js';
import { listDrafts, deleteDraft } from '../services/draft-store.js';
import { listCloudDrafts } from '../services/firestore-data.js';
import { isFirebaseConfigured } from '../services/firebase.js';
import { openModal, toast } from '../ui/overlays.js';
import { navigate } from '../router.js';

export function renderDashboard() {
  const drafts = listDrafts();

  renderPage(
    `
    <section class="section dashboard">
      <div class="container">
        <header class="dash-head">
          <div>
            <h1>Undangan Saya</h1>
            <p class="muted">${isFirebaseConfigured() ? 'Tersinkron dengan cloud.' : 'Mode lokal — draft tersimpan di perangkat ini.'}</p>
          </div>
          <a href="/create" data-link class="btn btn--primary">+ Buat Undangan</a>
        </header>

        ${drafts.length ? `
        <div class="dash-grid">
          ${drafts.map((d) => draftCard(d)).join('')}
        </div>` : emptyState()}
      </div>
    </section>
    `,
    (root) => {
      wireCardActions(root);
      if (isFirebaseConfigured()) {
        // Merge cloud drafts when available (non-blocking).
        listCloudDrafts().catch(() => []);
      }
    },
  );
}

function draftCard(d) {
  const names = [d.content?.groom?.name, d.content?.bride?.name].filter(Boolean).join(' & ') || 'Tanpa nama';
  const date = d.content?.weddingDate
    ? new Date(`${d.content.weddingDate}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
  return `
  <article class="dash-card" data-id="${d.id}">
    <div class="tpl-preview tpl-preview--${d.design?.templateId || 'amora'} dash-card__preview">
      <span>${escapeHtml(names)}</span>
    </div>
    <div class="dash-card__body">
      <h3>${escapeHtml(names)}</h3>
      <p class="muted">${capitalize(d.design?.templateId || '')}${d.design?.variantId ? ` · ${capitalize(d.design.variantId.split('-').slice(1).join('-'))}` : ''}</p>
      <p class="muted">${date} · <span class="status-badge status-badge--${d.status}">${statusLabel(d.status)}</span></p>
      <div class="dash-card__actions">
        <a href="/builder/${d.id}" data-link class="btn btn--ghost btn--sm">Edit</a>
        <a href="/invite/${d.id}" data-link class="btn btn--ghost btn--sm">Lihat</a>
        <button type="button" class="icon-btn" data-delete="${d.id}" title="Hapus">🗑</button>
      </div>
    </div>
  </article>`;
}

function emptyState() {
  return `
  <div class="dash-empty">
    <h2>Undangan pertama kalian dimulai di sini.</h2>
    <p class="muted">Pilih desain, tambahkan cerita, dan jadikan milik kalian.</p>
    <a href="/create" data-link class="btn btn--primary">Buat Undangan</a>
  </div>`;
}

function wireCardActions(root) {
  root.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.delete;
      openModal({
        title: 'Hapus undangan ini?',
        body: '<p>Draft akan dihapus permanen dari perangkat ini.</p>',
        actions: [
          { label: 'Batal' },
          {
            label: 'Hapus',
            kind: 'primary',
            onClick: () => {
              deleteDraft(id);
              toast('Undangan dihapus', { type: 'success' });
              renderDashboard();
            },
          },
        ],
      });
    });
  });
}

function statusLabel(status) {
  return { draft: 'Draft', ready: 'Siap', published: 'Tayang', archived: 'Arsip' }[status] || status;
}
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
