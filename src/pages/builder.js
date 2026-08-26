// Enveely — Builder page (Design-1.md §15–18).
// Three-area editor: Section Navigator | Live Canvas | Property Panel.
// All edits mutate the draft object -> autosave (draft-store) -> canvas repaint.

import { renderPage } from '../ui/app-shell.js';
import { loadDraft, saveDraft } from '../services/draft-store.js';
import { saveInvitation } from '../services/firestore-data.js';
import { renderInvitation } from '../engine/renderer.js';
import { startCountdowns, wireCopyButtons } from '../engine/interactions.js';
import { uploadImage } from '../services/image-service.js';
import { getSectionDef } from '../data/sections.js';
import { navigate } from '../router.js';
import { builderCss } from './builder.css.js';
import { openModal, toast } from '../ui/overlays.js';
import { invitationUrl, whatsappMessage, whatsappUrl, copyToClipboard, nativeShare } from '../services/share.js';
import { analyticsEvents } from '../services/analytics.js';

export function renderBuilder(invitationId) {
  const draft = loadDraft(invitationId);
  if (!draft) {
    navigate('/templates', { replace: true });
    return;
  }

  renderPage(
    `
    <style>${builderCss}</style>
    <div class="builder" data-builder>
      <header class="builder__top">
        <a href="/" data-link class="builder__logo">ENVEELY</a>
        <span class="builder__title">${escTitle(draft)}</span>
        <span class="builder__save" data-save-status>Tersimpan</span>
        <div class="builder__top-actions">
          <button type="button" class="btn btn--ghost btn--sm" data-act="preview">Pratinjau</button>
          <button type="button" class="btn btn--primary btn--sm" data-act="publish">Publikasikan</button>
        </div>
      </header>

      <aside class="builder__nav" data-nav></aside>

      <main class="builder__canvas-wrap">
        <div class="builder__canvas" data-canvas></div>
      </main>

      <aside class="builder__props" data-props></aside>
    </div>
    `,
    () => {
      const state = {
        draft,
        selectedSection: 'cover',
        uploading: false,
      };

      const rootEl = document.querySelector('[data-builder]');
      const nav = document.querySelector('[data-nav]');
      const canvas = document.querySelector('[data-canvas]');
      const props = document.querySelector('[data-props]');
      const saveStatus = document.querySelector('[data-save-status]');

      // ---- persistence ----
      let saveTimer = null;
      function persist() {
        clearTimeout(saveTimer);
        saveStatus.textContent = 'Menyimpan...';
        saveTimer = setTimeout(() => {
          const ok = saveDraft(state.draft);
          saveStatus.textContent = ok ? `Tersimpan ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : 'Gagal menyimpan';
        }, 500);
      }

      // ---- rendering ----
      function paintNav() {
        nav.innerHTML = state.draft.sections.map((s) => {
          const def = getSectionDef(s.id);
          return `
          <button type="button" class="bnav__item ${s.id === state.selectedSection ? 'is-active' : ''} ${s.enabled === false ? 'is-off' : ''}" data-nav-item="${s.id}">
            <span>${def?.labelID || s.id}</span>
            <span class="bnav__eye" title="${s.enabled === false ? 'Tampilkan' : 'Sembunyikan'}">${s.enabled === false ? '◌' : '◉'}</span>
          </button>`;
        }).join('');
      }

      function paintCanvas() {
        canvas.innerHTML = `<div class="builder__frame"><div class="builder__device">${renderInvitation({ ...state.draft, status: 'draft', _draft: true })}</div></div>`;
        startCountdowns(canvas);
        wireCopyButtons(canvas);
        canvas.querySelectorAll('.sec').forEach((sec) => {
          sec.addEventListener('click', () => selectSection(sec.dataset.section));
        });
      }

      function paintProps() {
        props.innerHTML = propsFor(state);
        wireProps(props, state, { persist, paintCanvas, repaintProps: paintProps });
      }

      function selectSection(id) {
        if (!id) return;
        state.selectedSection = id;
        paintNav();
        paintProps();
        const el = canvas.querySelector(`[data-section="${id}"]`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // ---- top actions ----
      rootEl.querySelector('[data-act="preview"]').addEventListener('click', () => {
        window.open(`/templates/${state.draft.design.templateId}/preview/${state.draft.design.variantId || ''}`, '_blank');
      });
      rootEl.querySelector('[data-act="publish"]').addEventListener('click', () => publishFlow(state, { persist, saveStatus }));

      nav.addEventListener('click', (e) => {
        const eye = e.target.closest('.bnav__eye');
        const item = e.target.closest('[data-nav-item]');
        if (!item) return;
        const id = item.dataset.navItem;
        if (eye) {
          const s = state.draft.sections.find((x) => x.id === id);
          s.enabled = s.enabled === false ? true : false;
          persist(); paintNav(); paintCanvas();
          return;
        }
        selectSection(id);
      });

      // initial paint
      paintNav(); paintCanvas(); paintProps();
    },
  );
}

function escTitle(draft) {
  const g = draft.content.groom?.name || '';
  const b = draft.content.bride?.name || '';
  const t = [g, b].filter(Boolean).join(' & ');
  return t ? `${t} · ${draft.design.templateId}` : draft.id;
}

function propsFor(state) {
  const { draft, selectedSection } = state;
  switch (selectedSection) {
    case 'couple': return coupleProps(draft);
    case 'event': return eventsProps(draft);
    case 'gallery': return galleryProps(draft, state);
    case 'countdown': return infoProps(draft);
    case 'music': return musicProps(draft);
    default: return genericProps(draft, selectedSection);
  }
}

/* ---------- Property panels ---------- */

function panel(title, body, hint = '') {
  return `
  <div class="bprops__group">
    <h3 class="bprops__title">${title}</h3>
    ${body}
    ${hint ? `<p class="bprops__hint">${hint}</p>` : ''}
  </div>`;
}

function field(label, name, value, attrs = '') {
  return `
  <label class="fld-ui fld-ui--sm">
    <span>${label}</span>
    <input name="${name}" value="${escapeAttr(value)}" ${attrs} data-prop-input/>
  </label>`;
}

function coupleProps(draft) {
  const c = draft.content;
  return panel(
    'Mempelai',
    `
    ${field('Nama pria', 'groom.name', c.groom.name)}
    ${field('Panggilan pria', 'groom.nickname', c.groom.nickname)}
    <div class="fld-ui fld-ui--sm">
      <span>Foto pria</span>
      ${photoControl('groom.photoUrl', c.groom.photoUrl)}
    </div>
    <hr class="bprops__sep"/>
    ${field('Nama wanita', 'bride.name', c.bride.name)}
    ${field('Panggilan wanita', 'bride.nickname', c.bride.nickname)}
    <div class="fld-ui fld-ui--sm">
      <span>Foto wanita</span>
      ${photoControl('bride.photoUrl', c.bride.photoUrl)}
    </div>
    ${field('Tanggal pernikahan', 'weddingDate', c.weddingDate, 'type="date"')}
    `,
    'Nama panjang otomatis menyesuaikan ukuran huruf.',
  );
}

function eventsProps(draft) {
  const events = draft.content.events;
  return panel(
    'Acara',
    `
    <div class="bevents">
      ${events.map((ev, i) => `
        <div class="bevent" data-event-index="${i}">
          <div class="bevent__head">
            <strong>${escapeHtml(ev.title || `Acara ${i + 1}`)}</strong>
            <button type="button" class="icon-btn" data-del-event="${i}" title="Hapus">✕</button>
          </div>
          ${field('Judul', `events.${i}.title`, ev.title)}
          <div class="form-row form-row--2">
            ${field('Tanggal', `events.${i}.date`, ev.date || '', 'type="date"')}
            ${field('Jam', `events.${i}.startTime`, ev.startTime || '', 'placeholder="08.00"')}
          </div>
          ${field('Venue', `events.${i}.venue`, ev.venue || '')}
          ${field('Alamat', `events.${i}.address`, ev.address || '')}
        </div>`).join('')}
      <button type="button" class="btn btn--ghost btn--sm" data-add-event>+ Tambah Acara</button>
    </div>
    `,
    'Akad dan resepsi biasanya cukup; tambah after party bila perlu.',
  );
}

function galleryProps(draft, state) {
  const photos = draft.content.gallery;
  return panel(
    'Galeri Foto',
    `
    <div class="bgallery">
      ${photos.map((p, i) => `
        <figure class="bgallery__item">
          <img src="${escapeAttr(p.url)}" alt="" loading="lazy"/>
          <button type="button" class="icon-btn icon-btn--danger" data-del-photo="${i}" title="Hapus">✕</button>
        </figure>`).join('')}
    </div>
    <label class="upload-drop ${state.uploading ? 'is-busy' : ''}">
      <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden data-gallery-upload/>
      <span>${state.uploading ? 'Mengunggah & mengompresi...' : '+ Tambah Foto'}</span>
    </label>
    <p class="bprops__hint">Foto dikompresi otomatis (maks 1400px, tetap jernih) sebelum diunggah.</p>
    `,
  );
}

function infoProps(draft) {
  return panel(
    'Hitung Mundur',
    `
    ${field('Tanggal target', 'weddingDate', draft.content.weddingDate, 'type="date"')}
    `,
    'Countdown mengikuti tanggal pernikahan.',
  );
}

function musicProps(draft) {
  const m = draft.content.musicSettings || {};
  return panel(
    'Musik Latar',
    `
    <label class="fld-ui fld-ui--sm fld-ui--check">
      <input type="checkbox" name="musicSettings.enabled" ${m.enabled ? 'checked' : ''} data-prop-check/>
      <span>Aktifkan musik</span>
    </label>
    ${field('URL audio (mp3)', 'musicSettings.url', m.url || '', 'placeholder="https://.../lagu.mp3"')}
    <label class="fld-ui fld-ui--sm fld-ui--check">
      <input type="checkbox" name="musicSettings.autoplay" ${(m.autoplay !== false) ? 'checked' : ''} data-prop-check/>
      <span>Coba putar otomatis setelah tamu membuka</span>
    </label>
    <label class="fld-ui fld-ui--sm fld-ui--check">
      <input type="checkbox" name="musicSettings.loop" ${(m.loop !== false) ? 'checked' : ''} data-prop-check/>
      <span>Ulangi terus</span>
    </label>
    ${field('Volume (0–1)', 'musicSettings.volume', m.volume ?? 0.55, 'type="number" min="0" max="1" step="0.05"')}
    `,
    'Browser membatasi autoplay; tombol musik selalu tampil di undangan.',
  );
}

function genericProps(draft, sectionId) {
  const def = getSectionDef(sectionId);
  const extras = sectionId === 'welcome'
    ? field('Teks pembuka', 'welcomeMessage', draft.content.welcomeMessage || '')
    : '';
  return panel(
    def?.labelID || sectionId,
    `${extras}
     <p class="bprops__hint">Bagian ini mengikuti desain template. Konten lain dapat diedit dari bagian terkait.</p>`,
  );
}

function photoControl(path, url) {
  return `
  <div class="photo-slot" data-photo-path="${path}">
    <span class="photo-slot__thumb">${url ? `<img src="${escapeAttr(url)}" alt=""/>` : '<em>Kosong</em>'}</span>
    <label class="upload-btn ${url ? '' : 'upload-btn--primary'}">
      <input type="file" accept="image/jpeg,image/png,image/webp" hidden data-photo-upload/>
      ${url ? 'Ganti' : 'Unggah'}
    </label>
    ${url ? `<button type="button" class="text-link" data-photo-remove>Hapus</button>` : ''}
  </div>`;
}

/* ---------- Property wiring ---------- */

function wireProps(root, state, { persist, paintCanvas, repaintProps }) {
  const draft = state.draft;

  // text/date inputs — path based binding e.g. "groom.name", "events.0.title"
  root.querySelectorAll('[data-prop-input]').forEach((input) => {
    input.addEventListener('input', () => {
      let value = input.value;
      if (input.type === 'number') value = Number(value);
      setByPath(draft.content, input.name, value);
      persist();
      // Repaint only for structural fields; names/date affect canvas directly.
      if (/^(groom|bride)\.(name|nickname)$|^weddingDate$|^events\.\d+\.|^musicSettings\./.test(input.name)) {
        paintCanvas();
      }
    });
  });

  // checkboxes (music settings etc.)
  root.querySelectorAll('[data-prop-check]').forEach((input) => {
    input.addEventListener('change', () => {
      setByPath(draft.content, input.name, input.checked);
      persist();
      if (input.name.startsWith('musicSettings.')) paintCanvas();
    });
  });

  // add/remove event
  root.querySelector('[data-add-event]')?.addEventListener('click', () => {
    draft.content.events.push({ id: `event-${Date.now()}`, title: 'Acara Baru', date: draft.content.weddingDate || '', startTime: '', venue: '', address: '' });
    persist(); paintCanvas(); repaintProps();
  });
  root.querySelectorAll('[data-del-event]').forEach((btn) => {
    btn.addEventListener('click', () => {
      draft.content.events.splice(Number(btn.dataset.delEvent), 1);
      persist(); paintCanvas(); repaintProps();
    });
  });

  // gallery upload (multi)
  root.querySelector('[data-gallery-upload]')?.addEventListener('change', async (e) => {
    const files = [...e.target.files || []];
    if (!files.length) return;
    state.uploading = true;
    repaintProps();
    for (const file of files) {
      try {
        const hosted = await uploadImage(file, { preset: 'gallery', name: `${draft.id}-gallery` });
        draft.content.gallery.push({ url: hosted.url, thumbUrl: hosted.thumbUrl, provider: hosted.provider, width: hosted.width, height: hosted.height });
      } catch (err) {
        alert(`Gagal unggah: ${err.message}`);
      }
    }
    state.uploading = false;
    persist(); paintCanvas(); repaintProps();
  });

  // remove gallery photo
  root.querySelectorAll('[data-del-photo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      draft.content.gallery.splice(Number(btn.dataset.delPhoto), 1);
      persist(); paintCanvas(); repaintProps();
    });
  });

  // couple photo slots
  root.querySelectorAll('[data-photo-upload]').forEach((input) => {
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      const slot = input.closest('[data-photo-path]');
      const path = slot.dataset.photoPath;
      const label = slot.querySelector('.upload-btn');
      const original = label.textContent;
      label.textContent = 'Mengunggah...';
      try {
        const hosted = await uploadImage(file, { preset: 'hero', name: `${draft.id}-${path.replace('.', '-')}` });
        setByPath(draft.content, path, hosted.url);
        persist(); paintCanvas(); repaintProps();
      } catch (err) {
        alert(`Gagal unggah: ${err.message}`);
        label.textContent = original;
      }
    });
  });
  root.querySelectorAll('[data-photo-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const path = btn.closest('[data-photo-path]')?.dataset.photoPath;
      if (!path) return;
      setByPath(draft.content, path, '');
      persist(); paintCanvas(); repaintProps();
    });
  });
}

function setByPath(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cur[k] == null) cur[k] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    cur = cur[k];
  }
  cur[parts.at(-1)] = value;
}

/* ---------- Publish + share flow (Phase 3/5) ---------- */

function publishChecklist(draft) {
  const c = draft.content;
  return [
    { ok: Boolean(c.groom?.name && c.bride?.name), label: 'Nama mempelai terisi' },
    { ok: Boolean(c.weddingDate), label: 'Tanggal pernikahan terisi' },
    { ok: (c.events || []).some((e) => e.title && e.date), label: 'Minimal satu acara lengkap' },
    { ok: Boolean(c.coverImage), label: 'Foto sampul dipilih', warnOnly: true },
  ];
}

async function publishFlow(state, { persist, saveStatus }) {
  const draft = state.draft;
  const checks = publishChecklist(draft);
  const blocking = checks.filter((c) => !c.ok && !c.warnOnly);

  openModal({
    title: 'Siap publikasikan?',
    body: `
      <ul class="publish-checks">
        ${checks.map((c) => `<li class="${c.ok ? 'ok' : c.warnOnly ? 'warn' : 'bad'}">${c.ok ? '✓' : c.warnOnly ? '△' : '✕'} ${c.label}</li>`).join('')}
        ${blocking.length ? '<p class="bprops__hint">Lengkapi item bertanda ✕ sebelum publikasi.</p>' : ''}
        <p class="bprops__hint">Undangan yang dipublikasikan dapat dilihat siapa pun yang memiliki tautan.</p>
      </ul>`,
    actions: [
      { label: 'Kembali Edit' },
      {
        label: blocking.length ? 'Tidak Lengkap' : 'Publikasikan',
        kind: 'primary',
        closeOnClick: false,
        onClick: async (close) => {
          if (blocking.length) return;
          const btns = document.querySelectorAll('.env-modal__actions .btn');
          btns[btns.length - 1].textContent = 'Mempublikasikan...';
          draft.status = 'published';
          persist();
          saveStatus.textContent = 'Menyimpan ke cloud...';
          let cloud = false;
          try {
            const res = await saveInvitation(draft);
            cloud = res.cloud;
          } catch {
            cloud = false;
          }
          analyticsEvents.publishInvitation();
          close();
          showShareModal(state, { cloud });
        },
      },
    ],
  });
}

function showShareModal(state, { cloud }) {
  const draft = state.draft;
  const url = invitationUrl(draft.id);
  const msg = whatsappMessage({
    groomName: draft.content.groom?.name,
    brideName: draft.content.bride?.name,
    url,
  });

  openModal({
    title: 'Undangan Anda tayang ✨',
    body: `
      ${cloud ? '' : '<p class="bprops__hint">Mode lokal: Firebase belum dikonfigurasi. Tautan hanya berfungsi di perangkat ini sampai deploy + config selesai.</p>'}
      <div class="share-link-box">
        <input readonly value="${url}" data-share-url/>
        <button type="button" class="btn btn--ghost btn--sm" data-copy-link>Salin</button>
      </div>
      <div class="share-actions">
        <a class="btn btn--primary btn--sm" target="_blank" rel="noopener" href="${whatsappUrl(msg)}" data-share-wa>Bagikan via WhatsApp</a>
        <button type="button" class="btn btn--ghost btn--sm" data-share-native>Bagikan Lainnya</button>
      </div>
      <a href="/invite/${draft.id}" data-link class="text-link">Buka undangan →</a>`,
    actions: [{ label: 'Selesai', kind: 'primary' }],
  });

  document.querySelector('[data-copy-link]')?.addEventListener('click', async () => {
    const ok = await copyToClipboard(url);
    toast(ok ? 'Link tersalin' : 'Gagal menyalin', { type: ok ? 'success' : 'error' });
    if (ok) analyticsEvents.shareUrl();
  });
  document.querySelector('[data-share-wa]')?.addEventListener('click', () => analyticsEvents.shareWhatsapp());
  document.querySelector('[data-share-native]')?.addEventListener('click', async () => {
    const res = await nativeShare({ title: `${draft.content.groom?.name || ''} & ${draft.content.bride?.name || ''}`, text: msg, url });
    if (res === 'unsupported') toast('Share sheet tidak tersedia — gunakan tombol Salin.');
  });
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function escapeAttr(s) {
  return escapeHtml(s);
}
