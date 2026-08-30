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
        nav.innerHTML = `
          <div class="builder__nav-head">Bagian Undangan</div>
          ${state.draft.sections.map((s) => {
            const def = getSectionDef(s.id);
            return `
            <button type="button" class="bnav__item ${s.id === state.selectedSection ? 'is-active' : ''} ${s.enabled === false ? 'is-off' : ''}" data-nav-item="${s.id}">
              <span>${def?.labelID || s.id}</span>
              <span class="bnav__eye" title="${s.enabled === false ? 'Tampilkan' : 'Sembunyikan'}">${s.enabled === false ? '◌' : '◉'}</span>
            </button>`;
          }).join('')}
        `;
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
        const def = getSectionDef(state.selectedSection);
        const header = propsHeader(
          def?.labelID?.charAt(0) || '✦',
          def?.labelID || state.selectedSection,
          'Atur konten bagian ini',
        );
        props.innerHTML = header + propsFor(state);
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
    case 'cover': return coverProps(draft);
    case 'welcome': return welcomeProps(draft);
    case 'couple': return coupleProps(draft);
    case 'parents': return parentsProps(draft);
    case 'event': return eventsProps(draft);
    case 'countdown': return infoProps(draft);
    case 'story': return storyProps(draft);
    case 'gallery': return galleryProps(draft, state);
    case 'rsvp': return rsvpProps(draft);
    case 'gift': return giftProps(draft);
    case 'closing': return closingProps(draft);
    case 'music': return musicProps(draft);
    case 'quote': return quoteProps(draft);
    case 'info': return infoSectionProps(draft);
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

function propsHeader(iconChar, title, subtitle) {
  return `
  <header class="builder__props-head">
    <span class="builder__props-head-icon">${iconChar || '✦'}</span>
    <span class="builder__props-head-text">
      <strong>${title}</strong>
      <small>${subtitle}</small>
    </span>
  </header>`;
}

function field(label, name, value, attrs = '') {
  return `
  <label class="fld-ui fld-ui--sm">
    <span>${label}</span>
    <input name="${name}" value="${escapeAttr(value)}" ${attrs} data-prop-input/>
  </label>`;
}

function textarea(label, name, value, placeholder = '') {
  return `
  <label class="fld-ui fld-ui--sm">
    <span>${label}</span>
    <textarea name="${name}" rows="3" placeholder="${escapeAttr(placeholder)}" data-prop-input>${escapeHtml(value)}</textarea>
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
      <button type="button" class="bevent-add" data-add-event>+ Tambah Acara Baru</button>
    </div>
    `,
    'Akad dan resepsi biasanya cukup. Tambah acara lagi jika ada after party atau syukuran.',
  );
}

function galleryProps(draft, state) {
  const photos = draft.content.gallery;
  const pending = draft.content._pendingUploads || {};
  return panel(
    'Galeri Foto',
    `
    <div class="bgallery">
      ${photos.map((p, i) => `
        <figure class="bgallery__item">
          <img src="${escapeAttr(p.url)}" alt="" loading="lazy"/>
          ${p._local ? '<span class="bgallery__uploading">Mengunggah</span>' : ''}
          <button type="button" class="icon-btn icon-btn--danger" data-del-photo="${i}" title="Hapus">✕</button>
        </figure>`).join('')}
      <label class="upload-drop ${state.uploading ? 'is-busy' : ''}">
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden data-gallery-upload/>
        <strong>${state.uploading ? 'Mengunggah…' : '+ Tambah Foto'}</strong>
        <small>${state.uploading ? 'Mohon tunggu sebentar' : 'JPG, PNG, atau WebP · bisa banyak sekaligus'}</small>
      </label>
    </div>
    <p class="bprops__hint">Foto otomatis dikompresi ke maks 1400px. Saat diunggah, foto tampil instan dari perangkat lalu otomatis pindah ke server.</p>
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
  return panel(
    def?.labelID || sectionId,
    `<p class="bprops__hint">Bagian ini mengikuti desain template. Aktifkan/nonaktifkan dari daftar bagian di sebelah kiri.</p>`,
  );
}

/* ---------- Panel: Cover ---------- */
function coverProps(draft) {
  const c = draft.content;
  return panel(
    'Sampul',
    `
    ${field('Teks kecil di atas nama', 'coverEyebrow', c.coverEyebrow || 'THE WEDDING OF', 'maxlength="60"')}
    <div class="fld-ui fld-ui--sm">
      <span>Foto sampul</span>
      ${photoControl('coverImage', c.coverImage)}
    </div>
    `,
    'Foto sampul jadi latar belakang pertama yang dilihat tamu. Pakai foto portrait dengan pencahayaan lembut.',
  );
}

/* ---------- Panel: Welcome ---------- */
function welcomeProps(draft) {
  const c = draft.content;
  return panel(
    'Pembuka',
    `
    ${textarea('Teks pembuka', 'welcomeMessage', c.welcomeMessage || '', 'Kalimat sambutan untuk tamu...')}
    ${field('Nama yang mengundang (opsional)', 'hostName', c.hostName || '', 'placeholder="cth. Keluarga Bapak Hartono"')}
    `,
    'Bagian ini tampil tepat setelah tamu membuka sampul. Buat kalimat singkat yang hangat.',
  );
}

/* ---------- Panel: Parents ---------- */
function parentsProps(draft) {
  const p = draft.content.parents || {};
  return panel(
    'Orang Tua',
    `
    ${textarea('Orang tua mempelai pria', 'parents.groom', p.groom || '', 'cth. Bapak Hartono & Ibu Dewi Lestari')}
    ${textarea('Orang tua mempelai wanita', 'parents.bride', p.bride || '', 'cth. Bapak Bambang & Ibu Sri Handayani')}
    `,
    'Format penulisan bebas, pisahkan orang tua pria & wanita agar penempatannya simetris.',
  );
}

/* ---------- Panel: Story ---------- */
function storyProps(draft, state) {
  const items = draft.content.story || [];
  return panel(
    'Cerita',
    `
    <div class="bstory">
      ${items.map((s, i) => `
        <div class="bstory__item" data-story-index="${i}">
          <div class="bstory__head">
            <strong>${escapeHtml(s.title || `Momen ${i + 1}`)}</strong>
            <button type="button" class="icon-btn" data-del-story="${i}" title="Hapus">✕</button>
          </div>
          ${field('Waktu / Tahun', `story.${i}.date`, s.date || '', 'placeholder="cth. 2022"')}
          ${field('Judul', `story.${i}.title`, s.title || '')}
          ${textarea('Cerita singkat', `story.${i}.text`, s.text || '', 'Beberapa kalimat tentang momen ini...')}
          <div class="fld-ui fld-ui--sm">
            <span>Foto (opsional)</span>
            ${photoControl(`story.${i}.image`, s.image || '')}
          </div>
        </div>`).join('')}
      <button type="button" class="bevent-add" data-add-story>+ Tambah Momen</button>
    </div>
    `,
    'Ceritakan 2–4 momen penting. Foto opsional, boleh ditambahkan nanti.',
  );
}

/* ---------- Panel: RSVP ---------- */
function rsvpProps(draft) {
  const s = draft.content.rsvpSettings || {};
  return panel(
    'Konfirmasi Kehadiran',
    `
    <label class="fld-ui fld-ui--sm fld-ui--check">
      <input type="checkbox" name="rsvpSettings.enabled" ${s.enabled !== false ? 'checked' : ''} data-prop-check/>
      <span>Aktifkan RSVP</span>
    </label>
    <label class="fld-ui fld-ui--sm fld-ui--check">
      <input type="checkbox" name="rsvpSettings.askAttendance" ${s.askAttendance !== false ? 'checked' : ''} data-prop-check/>
      <span>Tanya kehadiran / berhalangan</span>
    </label>
    <label class="fld-ui fld-ui--sm fld-ui--check">
      <input type="checkbox" name="rsvpSettings.askGuestCount" ${s.askGuestCount !== false ? 'checked' : ''} data-prop-check/>
      <span>Tanya jumlah tamu</span>
    </label>
    ${field('Maksimal tamu per undangan', 'rsvpSettings.maxGuestCount', s.maxGuestCount || 5, 'type="number" min="1" max="20"')}
    <label class="fld-ui fld-ui--sm fld-ui--check">
      <input type="checkbox" name="rsvpSettings.allowMessage" ${s.allowMessage !== false ? 'checked' : ''} data-prop-check/>
      <span>Izinkan tamu tulis ucapan</span>
    </label>
    `,
    'Pengaturan ini berlaku untuk semua tamu yang mengisi RSVP.',
  );
}

/* ---------- Panel: Gift ---------- */
function giftProps(draft, state) {
  const g = draft.content.giftSettings || {};
  const accounts = g.accounts || [];
  return panel(
    'Hadiah',
    `
    <label class="fld-ui fld-ui--sm fld-ui--check">
      <input type="checkbox" name="giftSettings.enabled" ${g.enabled ? 'checked' : ''} data-prop-check/>
      <span>Tampilkan info hadiah</span>
    </label>
    ${textarea('Alamat kirim kado (opsional)', 'giftSettings.address', g.address || '', 'cth. Jl. Mawar No. 12, Jakarta')}
    <div class="bgift-accounts">
      <label class="bprops__hint">Rekening</label>
      ${accounts.map((a, i) => `
        <div class="bgift-account" data-gift-index="${i}">
          <div class="bgift-account__head">
            <strong>${escapeHtml((a.bank || 'Bank') + ' · ' + (a.holder || ''))}</strong>
            <button type="button" class="icon-btn" data-del-gift="${i}" title="Hapus">✕</button>
          </div>
          ${field('Bank', `giftSettings.accounts.${i}.bank`, a.bank || '')}
          ${field('Nomor rekening', `giftSettings.accounts.${i}.number`, a.number || '')}
          ${field('Atas nama', `giftSettings.accounts.${i}.holder`, a.holder || '')}
        </div>
      `).join('')}
      <button type="button" class="bevent-add" data-add-gift>+ Tambah Rekening</button>
    </div>
    `,
    'Bisa lebih dari satu rekening. Tamu tinggal ketuk untuk menyalin nomor.',
  );
}

/* ---------- Panel: Closing ---------- */
function closingProps(draft) {
  const c = draft.content;
  return panel(
    'Penutup',
    `
    ${textarea('Kalimat penutup', 'closingMessage', c.closingMessage || '', 'Ucapan terima kasih untuk tamu...')}
    <div class="fld-ui fld-ui--sm">
      <span>Foto penutup (opsional)</span>
      ${photoControl('closingImage', c.closingImage || '')}
    </div>
    `,
    'Bagian ini jadi penutup setelah tamu memberi ucapan atau konfirmasi.',
  );
}

/* ---------- Panel: Quote (section baru) ---------- */
function quoteProps(draft) {
  const q = draft.content.quoteSettings || {};
  return panel(
    'Kutipan',
    `
    ${textarea('Teks kutipan', 'quoteSettings.text', q.text || '', 'Kutipan, ayat, atau kalimat favorit...')}
    ${field('Sumber / Attribution (opsional)', 'quoteSettings.source', q.source || '', 'placeholder="cth. QS. Ar-Rum: 21"')}
    `,
    'Tampil dengan layout centered italic di antara section utama.',
  );
}

/* ---------- Panel: Info Penting (section baru) ---------- */
function infoSectionProps(draft) {
  const i = draft.content.infoSettings || {};
  return panel(
    'Info Penting',
    `
    ${field('Dress code (warna yang dihindari)', 'infoSettings.dressCode', i.dressCode || '', 'placeholder="cth. Hindari putih dan merah"')}
    ${textarea('Info akses / parkir / transport', 'infoSettings.access', i.access || '', 'Parkir tersedia di basement, akses dari pintu samping...')}
    ${textarea('Catatan tambahan', 'infoSettings.notes', i.notes || '', 'Info lain yang perlu tamu tahu...')}
    `,
    'Tamu tidak perlu scroll-balik ke info praktis — semua tampil di satu kartu.',
  );
}

function photoControl(path, url) {
  return `
  <div class="photo-slot" data-photo-path="${path}">
    <span class="photo-slot__thumb">${url ? `<img src="${escapeAttr(url)}" alt=""/>` : '<em>Kosong</em>'}</span>
    <span class="photo-slot__actions">
      <label class="upload-btn ${url ? '' : 'upload-btn--primary'}">
        <input type="file" accept="image/jpeg,image/png,image/webp" hidden data-photo-upload/>
        ${url ? 'Ganti Foto' : 'Pilih Foto'}
      </label>
      ${url ? `<button type="button" class="text-link" data-photo-remove>Hapus foto</button>` : ''}
    </span>
  </div>`;
}

/* ---------- Property wiring ---------- */

const REPAINT_ON_INPUT = new RegExp(
  [
    '^(groom|bride)\\.(name|nickname|photoUrl)$',
    '^weddingDate$',
    '^coverImage$',
    '^coverEyebrow$',
    '^welcomeMessage$',
    '^hostName$',
    '^closingMessage$',
    '^closingImage$',
    '^events\\.\\d+\\.(title|date|startTime|venue|address)$',
    '^musicSettings\\.',
    '^parents\\.(groom|bride)$',
    '^story\\.\\d+\\.',
    '^quoteSettings\\.',
    '^infoSettings\\.',
    '^giftSettings\\.address$',
  ].join('|')
);

function wireProps(root, state, { persist, paintCanvas, repaintProps }) {
  const draft = state.draft;

  // text/date inputs + textareas — path based binding e.g. "groom.name", "events.0.title"
  root.querySelectorAll('[data-prop-input]').forEach((input) => {
    input.addEventListener('input', () => {
      let value = input.value;
      if (input.type === 'number') value = Number(value);
      setByPath(draft.content, input.name, value);
      persist();
      // Repaint canvas for any field that affects the rendered invitation.
      if (REPAINT_ON_INPUT.test(input.name)) {
        paintCanvas();
      }
    });
  });

  // checkboxes (music settings etc.)
  root.querySelectorAll('[data-prop-check]').forEach((input) => {
    input.addEventListener('change', () => {
      setByPath(draft.content, input.name, input.checked);
      persist();
      if (input.name.startsWith('musicSettings.') || input.name.startsWith('rsvpSettings.') || input.name.startsWith('giftSettings.')) {
        paintCanvas();
      }
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

  // story items: add/remove
  root.querySelector('[data-add-story]')?.addEventListener('click', () => {
    if (!Array.isArray(draft.content.story)) draft.content.story = [];
    draft.content.story.push({ date: '', title: '', text: '', image: '' });
    persist(); paintCanvas(); repaintProps();
  });
  root.querySelectorAll('[data-del-story]').forEach((btn) => {
    btn.addEventListener('click', () => {
      draft.content.story.splice(Number(btn.dataset.delStory), 1);
      persist(); paintCanvas(); repaintProps();
    });
  });

  // gift accounts: add/remove
  root.querySelector('[data-add-gift]')?.addEventListener('click', () => {
    if (!draft.content.giftSettings) draft.content.giftSettings = { enabled: false, accounts: [], address: '' };
    if (!Array.isArray(draft.content.giftSettings.accounts)) draft.content.giftSettings.accounts = [];
    draft.content.giftSettings.accounts.push({ bank: '', number: '', holder: '' });
    persist(); paintCanvas(); repaintProps();
  });
  root.querySelectorAll('[data-del-gift]').forEach((btn) => {
    btn.addEventListener('click', () => {
      draft.content.giftSettings.accounts.splice(Number(btn.dataset.delGift), 1);
      persist(); paintCanvas(); repaintProps();
    });
  });

  // gallery upload (multi, optimistic local preview)
  root.querySelector('[data-gallery-upload]')?.addEventListener('change', async (e) => {
    const files = [...e.target.files || []];
    if (!files.length) return;
    e.target.value = '';
    state.uploading = true;
    repaintProps();
    const tasks = files.map((file) => uploadWithLocalPreview(file, draft, 'gallery'));
    await Promise.allSettled(tasks);
    state.uploading = false;
    persist(); paintCanvas(); repaintProps();
  });

  // remove gallery photo
  root.querySelectorAll('[data-del-photo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.delPhoto);
      const photo = draft.content.gallery[idx];
      if (photo?._local) URL.revokeObjectURL(photo.url);
      draft.content.gallery.splice(idx, 1);
      persist(); paintCanvas(); repaintProps();
    });
  });

  // couple / generic photo slots — optimistic local preview
  root.querySelectorAll('[data-photo-upload]').forEach((input) => {
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      input.value = '';
      const slot = input.closest('[data-photo-path]');
      const path = slot.dataset.photoPath;
      const label = slot.querySelector('.upload-btn');
      const original = label.textContent;
      label.textContent = 'Mengunggah...';
      await uploadWithLocalPreview(file, draft, 'hero', { path, setPath: true });
      label.textContent = original;
      persist(); paintCanvas(); repaintProps();
    });
  });
  root.querySelectorAll('[data-photo-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const path = btn.closest('[data-photo-path]')?.dataset.photoPath;
      if (!path) return;
      const current = getByPath(draft.content, path);
      if (current && /^blob:/.test(current)) URL.revokeObjectURL(current);
      setByPath(draft.content, path, '');
      persist(); paintCanvas(); repaintProps();
    });
  });
}

/**
 * Optimistic image upload: show local blob URL immediately, then swap to the
 * hosted URL once ImgBB responds. If the upload fails, keep the local URL
 * (with a `_local: true` marker) so the user still sees the photo.
 *
 * @param {File} file
 * @param {object} draft
 * @param {'hero'|'gallery'} preset
 * @param {{path?: string, setPath?: boolean}} [opts] when setPath=true, treat as a single-path slot
 */
async function uploadWithLocalPreview(file, draft, preset, opts = {}) {
  const localUrl = URL.createObjectURL(file);
  const placeholder = {
    url: localUrl,
    _local: true,
    _file: file, // keep handle for potential retry
    thumbUrl: localUrl,
    provider: 'local',
    width: null,
    height: null,
  };

  if (opts.setPath && opts.path) {
    setByPath(draft.content, opts.path, localUrl);
    if (!draft.content._pendingUploads) draft.content._pendingUploads = {};
    draft.content._pendingUploads[opts.path] = true;
  } else {
    const idx = draft.content.gallery.length;
    draft.content.gallery.push({ ...placeholder });
    if (!draft.content._pendingUploads) draft.content._pendingUploads = {};
    draft.content._pendingUploads[`gallery.${idx}`] = true;
  }

  // trigger a repaint via the caller; here we just record the optimistic state.

  try {
    const hosted = await uploadImage(file, { preset, name: `${draft.id}-${preset}-${Date.now()}` });
    if (opts.setPath && opts.path) {
      setByPath(draft.content, opts.path, hosted.url);
      delete draft.content._pendingUploads?.[opts.path];
    } else {
      // find by local URL and replace
      const i = draft.content.gallery.findIndex((p) => p.url === localUrl);
      if (i >= 0) {
        draft.content.gallery[i] = { ...hosted, _local: false };
        delete draft.content._pendingUploads?.[`gallery.${i}`];
      }
    }
    URL.revokeObjectURL(localUrl);
  } catch (err) {
    console.warn('[upload] gagal, foto tetap tersimpan lokal', err);
    // keep local URL; user sees a toast via caller if desired
    if (opts.setPath && opts.path) {
      delete draft.content._pendingUploads?.[opts.path];
    }
  }
}

function getByPath(obj, path) {
  return path.split('.').reduce((cur, k) => (cur == null ? cur : cur[k]), obj);
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
    title: 'Siap Tayang?',
    body: `
      <ul class="publish-checks">
        ${checks.map((c) => `<li class="${c.ok ? 'ok' : c.warnOnly ? 'warn' : 'bad'}">${c.ok ? '✓' : c.warnOnly ? '△' : '✕'} ${c.label}</li>`).join('')}
        ${blocking.length ? '<p class="bprops__hint">Lengkapi dulu yang bertanda ✕ sebelum tayang.</p>' : ''}
        <p class="bprops__hint">Siapapun yang punya tautan bisa buka undangan ini.</p>
      </ul>`,
    actions: [
      { label: 'Kembali Edit' },
      {
        label: blocking.length ? 'Belum Lengkap' : 'Tayangkan Sekarang',
        kind: 'primary',
        closeOnClick: false,
        onClick: async (close) => {
          if (blocking.length) return;
          const btns = document.querySelectorAll('.env-modal__actions .btn');
          btns[btns.length - 1].textContent = 'Menyiapkan...';
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
    title: 'Undangan Sudah Tayang ✨',
    body: `
      ${cloud ? '' : '<p class="bprops__hint">Belum pakai Firebase? Tautan hanya jalan di perangkat ini. Aktifkan Firebase biar bisa dishare ke tamu.</p>'}
      <div class="share-link-box">
        <input readonly value="${url}" data-share-url/>
        <button type="button" class="btn btn--ghost btn--sm" data-copy-link>Salin</button>
      </div>
      <div class="share-actions">
        <a class="btn btn--primary btn--sm" target="_blank" rel="noopener" href="${whatsappUrl(msg)}" data-share-wa>Kirim via WhatsApp</a>
        <button type="button" class="btn btn--ghost btn--sm" data-share-native>Bagikan Lainnya</button>
      </div>
      <a href="/invite/${draft.id}" data-link class="text-link">Buka undangan →</a>`,
    actions: [{ label: 'Selesai', kind: 'primary' }],
  });

  document.querySelector('[data-copy-link]')?.addEventListener('click', async () => {
    const ok = await copyToClipboard(url);
    toast(ok ? 'Tautan tersalin' : 'Gagal menyalin', { type: ok ? 'success' : 'error' });
    if (ok) analyticsEvents.shareUrl();
  });
  document.querySelector('[data-share-wa]')?.addEventListener('click', () => analyticsEvents.shareWhatsapp());
  document.querySelector('[data-share-native]')?.addEventListener('click', async () => {
    const res = await nativeShare({ title: `${draft.content.groom?.name || ''} & ${draft.content.bride?.name || ''}`, text: msg, url });
    if (res === 'unsupported') toast('Share sheet tidak tersedia — pakai tombol Salin saja.');
  });
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function escapeAttr(s) {
  return escapeHtml(s);
}
