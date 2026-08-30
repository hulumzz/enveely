// Enveely — Creation wizard (Design-1.md §14).
// Step 1: design (template+variant via query or picker)
// Step 2: couple basics (names + date) -> creates draft -> opens builder.

import { renderPage } from '../ui/app-shell.js';
import { templateFamilies } from '../data/templates.js';
import { getVariantsFor, getVariant } from '../data/variants.js';
import { createDraft, saveDraft } from '../services/draft-store.js';
import { navigate } from '../router.js';
import { analyticsEvents } from '../services/analytics.js';
import { invitationFrame, hydrateInvitationFrames } from '../ui/invitation-frame.js';

export function renderCreate(query = new URLSearchParams()) {
  const templateId = query.get('template') || '';
  const variantId = query.get('variant') || '';
  const tpl = templateId ? templateFamilies.find((t) => t.id === templateId) : null;
  const variants = tpl ? getVariantsFor(tpl.id) : [];
  const activeVariant = variantId && getVariant(variantId) ? variantId : variants[0]?.id || '';

  renderPage(
    `
    <section class="section create-page">
      <div class="container create-page__inner">
        <header class="create-head">
          <div class="create-head__progress">
            <span class="create-head__dot is-done"></span>
            <span class="create-head__bar"></span>
            <span class="create-head__dot ${tpl ? 'is-done' : 'is-active'}"></span>
          </div>
          <p class="eyebrow">Langkah ${tpl ? '2' : '1'} dari 2 — ${tpl ? 'Hampir selesai' : 'Mulai dari sini'}</p>
          <h1>${tpl ? 'Isi Data Mempelai' : 'Pilih Desain Favorit'}</h1>
          <p class="muted">${tpl ? 'Ceritakan sedikit tentang kalian. Semuanya bisa diubah lagi di editor nanti.' : 'Setiap keluarga punya karakter visual sendiri — pilih yang paling terasa seperti kalian.'}</p>
        </header>

        ${tpl ? basicsForm(tpl, activeVariant) : designPicker()}
      </div>
    </section>
    `,
    (root) => {
      // Design selection
      root.querySelectorAll('[data-pick-template]').forEach((el) => {
        el.addEventListener('click', () => {
          const id = el.dataset.pickTemplate;
          const firstVariant = getVariantsFor(id)[0]?.id || '';
          navigate(`/create?template=${id}&variant=${firstVariant}`, { replace: true });
          renderCreate(new URLSearchParams({ template: id, variant: firstVariant }));
        });
      });
      root.querySelectorAll('[data-pick-variant]').forEach((el) => {
        el.addEventListener('click', () => {
          navigate(`/create?template=${tpl.id}&variant=${el.dataset.pickVariant}`, { replace: true });
          renderCreate(new URLSearchParams({ template: tpl.id, variant: el.dataset.pickVariant }));
        });
      });

      // Variant thumbnails — klik untuk ganti variant di step 2
      root.querySelectorAll('[data-variant-thumb]').forEach((el) => {
        el.addEventListener('click', () => {
          navigate(`/create?template=${tpl.id}&variant=${el.dataset.variantThumb}`, { replace: true });
          renderCreate(new URLSearchParams({ template: tpl.id, variant: el.dataset.variantThumb }));
        });
      });

      // Basics form: live preview update
      const form = root.querySelector('#create-basics');
      const previewBox = root.querySelector('[data-live-preview]');
      if (form && previewBox) {
        const updatePreview = () => {
          const data = new FormData(form);
          const groom = (data.get('groomName') || '').toString().trim() || '—';
          const bride = (data.get('brideName') || '').toString().trim() || '—';
          const date = (data.get('weddingDate') || '').toString();
          previewBox.querySelector('[data-preview-groom]').textContent = groom;
          previewBox.querySelector('[data-preview-bride]').textContent = bride;
          previewBox.querySelector('[data-preview-date]').textContent = date
            ? new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Tanggal akan tampil di sini';
        };
        form.addEventListener('input', updatePreview);
        updatePreview();
      }

      // Basics form submit
      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        if (!data.groomName || !data.brideName) {
          // gentle shake + highlight
          form.classList.add('is-shake');
          form.querySelectorAll('[required]').forEach((i) => i.classList.toggle('is-invalid', !i.value.trim()));
          setTimeout(() => form.classList.remove('is-shake'), 500);
          return;
        }

        const draft = createDraft(tpl.id, activeVariant);
        draft.content.groom.name = String(data.groomName).trim();
        draft.content.groom.nickname = String(data.groomNickname || data.groomName).trim();
        draft.content.bride.name = String(data.brideName).trim();
        draft.content.bride.nickname = String(data.brideNickname || data.brideName).trim();
        draft.content.weddingDate = data.weddingDate || '';
        saveDraft(draft);
        analyticsEvents.createInvitation(tpl.id);
        navigate(`/builder/${draft.id}`);
      });
    },
  );
}

function designPicker() {
  return `
  <div class="design-picker">
    ${templateFamilies.map((tpl, i) => {
      const variants = getVariantsFor(tpl.id);
      return `
      <article class="pick-card" data-pick-template="${tpl.id}" role="button" tabindex="0"
               aria-label="Pilih ${tpl.name}" style="--i:${i}">
        <div class="pick-card__media">
          <div class="pick-card__frame-stack">
            <span class="pick-card__frame pick-card__frame--back"></span>
            <span class="pick-card__frame pick-card__frame--mid"></span>
            <span class="pick-card__frame pick-card__frame--front">${invitationFrame({ templateId: tpl.id, frame: familyFrameForPicker(tpl.id) })}</span>
          </div>
          <span class="pick-card__badge" style="--badge-bg:${familyBadgeBg(tpl.id)};--badge-fg:${familyBadgeFg(tpl.id)}">${tpl.moodLabel}</span>
        </div>
        <div class="pick-card__body">
          <h3>${tpl.name}</h3>
          <p class="muted">${familyShortDescForPicker(tpl.id)}</p>
          <div class="pick-card__variants" aria-label="Varian ${tpl.name}">
            ${variants.map((v) => `<span class="pick-card__variant-dot" style="--dot:${pickVariantDot(tpl.id, v.id)}" title="${v.name}"></span>`).join('')}
            <span class="pick-card__variants-count">${variants.length} variasi</span>
          </div>
          <span class="pick-card__cta">Pilih Desain Ini →</span>
        </div>
      </article>`;
    }).join('')}
  </div>`;
}

function basicsForm(tpl, variantId) {
  const variants = getVariantsFor(tpl.id);
  return `
  <div class="basics-layout">
    <form id="create-basics" class="basics-form" novalidate>
      <div class="basics-form__header">
        <p class="eyebrow">Tentang Mempelai</p>
        <h2 class="basics-form__title">Mari Mulai dengan Cerita Kalian.</h2>
        <p class="muted">Isi nama dan tanggal terlebih dahulu. Sisanya bisa dilengkapi nanti di editor.</p>
      </div>

      <div class="basics-form__step">
        <div class="basics-form__step-tag">01</div>
        <h3 class="basics-form__step-title">Mempelai Pria</h3>
        <div class="basics-form__row">
          <label class="fld-ui">
            <span>Nama Lengkap <em>wajib</em></span>
            <input name="groomName" required maxlength="60" placeholder="cth. Raka Aditya" autocomplete="off"/>
            <small class="fld-ui__hint">Nama panjang tampil di sampul undangan.</small>
          </label>
          <label class="fld-ui">
            <span>Nama Panggilan</span>
            <input name="groomNickname" maxlength="30" placeholder="cth. Raka" autocomplete="off"/>
            <small class="fld-ui__hint">Buat sapaan singkat seperti "Raka &amp; Alya".</small>
          </label>
        </div>
      </div>

      <div class="basics-form__step">
        <div class="basics-form__step-tag">02</div>
        <h3 class="basics-form__step-title">Mempelai Wanita</h3>
        <div class="basics-form__row">
          <label class="fld-ui">
            <span>Nama Lengkap <em>wajib</em></span>
            <input name="brideName" required maxlength="60" placeholder="cth. Alya Paramita" autocomplete="off"/>
            <small class="fld-ui__hint">Nama panjang tampil di sampul undangan.</small>
          </label>
          <label class="fld-ui">
            <span>Nama Panggilan</span>
            <input name="brideNickname" maxlength="30" placeholder="cth. Alya" autocomplete="off"/>
            <small class="fld-ui__hint">Buat sapaan singkat seperti "Raka &amp; Alya".</small>
          </label>
        </div>
      </div>

      <div class="basics-form__step">
        <div class="basics-form__step-tag">03</div>
        <h3 class="basics-form__step-title">Tanggal Bahagia</h3>
        <label class="fld-ui fld-ui--date">
          <span>Kapan Hari Pernikahannya?</span>
          <input type="date" name="weddingDate"/>
          <small class="fld-ui__hint">Hitung mundur otomatis mengikuti tanggal ini.</small>
        </label>
      </div>

      <div class="basics-form__footer">
        <p class="basics-form__assurance">
          <span class="basics-form__check">✓</span> Belum siap sekalian? Simpan dulu, lanjutkan kapan saja &mdash; tanpa login.
        </p>
        <button type="submit" class="btn btn--primary btn--lg basics-form__submit">
          Lanjut ke Editor
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>

    <aside class="basics-preview">
      <p class="eyebrow">Pratinjau</p>
      <h3 class="basics-preview__title">${tpl.name}${variantId ? ` &mdash; ${getVariant(variantId)?.name || ''}` : ''}</h3>

      <div class="basics-preview__switch" role="tablist" aria-label="Pilih varian ${tpl.name}">
        ${variants.map((v) => `
          <button type="button" class="chip ${v.id === variantId ? 'is-active' : ''}" data-variant-thumb="${v.id}" role="tab" aria-selected="${v.id === variantId}">${v.name}</button>
        `).join('')}
      </div>

      <div class="basics-preview__frame" data-live-preview>
        ${invitationFrame({ templateId: tpl.id, variantId, frame: 'arch' })}
        <div class="basics-preview__overlay">
          <p class="basics-preview__caption">Sampul Undangan</p>
          <h4 class="basics-preview__names">
            <span data-preview-groom>—</span>
            <span class="basics-preview__amp">&amp;</span>
            <span data-preview-bride>—</span>
          </h4>
          <p class="basics-preview__date" data-preview-date>Tanggal akan tampil di sini</p>
        </div>
      </div>

      <div class="basics-preview__meta">
        <p class="muted">${tpl.moodLabel} &middot; ${tpl.densityLabel}</p>
        <a href="/create" data-link class="text-link">Ganti desain</a>
      </div>

      <ul class="basics-preview__tips">
        <li><span>●</span> Foto, acara, dan galeri bisa dilengkapin di editor setelah ini.</li>
        <li><span>●</span> Tidak ada deadline &mdash; simpan draft kapan saja.</li>
        <li><span>●</span> Data tersimpan lokal sampai kalian daftar/login.</li>
      </ul>
    </aside>
  </div>`;
}

// --- helpers for picker (mirrors landing helpers, locally scoped) ---
function familyFrameForPicker(id) {
  return ({ amora: 'arch', elysian: 'editorial', serena: 'phone', lumiere: 'phone', nusantara: 'arch', meadow: 'polaroid' })[id] || 'editorial';
}
function familyBadgeBg(id) {
  return ({ amora: '#faf6f1', elysian: '#f7f4ee', serena: '#fbfaf8', lumiere: '#111013', nusantara: '#f6efe4', meadow: '#f7f3ea' })[id] || '#faf6f1';
}
function familyBadgeFg(id) {
  return ({ amora: '#8b6f5a', elysian: '#2f2a25', serena: '#55504a', lumiere: '#c8b48c', nusantara: '#7c3f2c', meadow: '#6b7a54' })[id] || '#8b6f5a';
}
function familyShortDescForPicker(id) {
  return ({
    amora: 'Hangat, floral, dan terasa dekat.',
    elysian: 'Editorial, mewah, dan penuh spasi.',
    serena: 'Minimal, tenang, fokus pada nama.',
    lumiere: 'Sinematik, gelap megah, penuh foto.',
    nusantara: 'Tradisional modern dengan aksen batik.',
    meadow: 'Rustic, polaroid, dan botanical.',
  })[id] || '';
}
function pickVariantDot(tplId, variantId) {
  // pull color override from the variant
  const v = getVariant(variantId);
  return v?.colorOverrides?.accent || v?.colorOverrides?.primary || '#8b6f5a';
}
