// Enveely — Creation wizard (Design-1.md §14).
// Step 1: design (template+variant via query or picker)
// Step 2: couple basics (names + date) -> creates draft -> opens builder.

import { renderPage } from '../ui/app-shell.js';
import { templateFamilies } from '../data/templates.js';
import { getVariantsFor, getVariant } from '../data/variants.js';
import { createDraft, saveDraft } from '../services/draft-store.js';
import { navigate } from '../router.js';
import { analyticsEvents } from '../services/analytics.js';

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
          <p class="eyebrow">LANGKAH ${tpl ? '2' : '1'} DARI 2</p>
          <h1>${tpl ? 'Data Dasar' : 'Pilih Desain'}</h1>
          <p class="muted">${tpl ? 'Nama dan tanggal bisa diubah kapan saja di editor.' : 'Semua desain bisa diganti nanti tanpa kehilangan konten.'}</p>
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

      // Basics form submit
      const form = root.querySelector('#create-basics');
      form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        if (!data.groomName || !data.brideName) return;

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
    ${templateFamilies.map((tpl) => {
      const variants = getVariantsFor(tpl.id);
      return `
      <article class="pick-card" data-pick-template="${tpl.id}" role="button" tabindex="0"
               aria-label="Pilih ${tpl.name}">
        <div class="tpl-preview tpl-preview--${tpl.id} pick-card__preview"><span>${tpl.name}</span></div>
        <div class="pick-card__body">
          <h3>${tpl.name}</h3>
          <p class="muted">${tpl.moodLabel}</p>
          <div class="pick-card__variants">
            ${variants.map((v) => `<button type="button" class="chip chip--mini" data-pick-variant="${v.id}">${v.name}</button>`).join('')}
          </div>
        </div>
      </article>`;
    }).join('')}
  </div>`;
}

function basicsForm(tpl, variantId) {
  return `
  <form id="create-basics" class="basics-form" novalidate>
    <div class="basics-form__chosen">
      <div class="tpl-preview tpl-preview--${tpl.id} basics-form__thumb"><span>${tpl.name}</span></div>
      <div>
        <strong>${tpl.name}${variantId ? ` — ${getVariant(variantId)?.name || ''}` : ''}</strong>
        <p class="muted">${tpl.moodLabel} · ${tpl.densityLabel}</p>
        <a href="/create" data-link class="text-link">Ganti desain</a>
      </div>
    </div>

    <div class="form-row">
      <label class="fld-ui">
        <span>Nama Mempelai Pria *</span>
        <input name="groomName" required maxlength="60" placeholder="cth. Raka Aditya" autocomplete="off"/>
      </label>
      <label class="fld-ui">
        <span>Panggilan</span>
        <input name="groomNickname" maxlength="30" placeholder="cth. Raka" autocomplete="off"/>
      </label>
    </div>
    <div class="form-row">
      <label class="fld-ui">
        <span>Nama Mempelai Wanita *</span>
        <input name="brideName" required maxlength="60" placeholder="cth. Alya Paramita" autocomplete="off"/>
      </label>
      <label class="fld-ui">
        <span>Panggilan</span>
        <input name="brideNickname" maxlength="30" placeholder="cth. Alya" autocomplete="off"/>
      </label>
    </div>
    <label class="fld-ui">
      <span>Tanggal Pernikahan</span>
      <input type="date" name="weddingDate"/>
    </label>

    <button type="submit" class="btn btn--primary btn--lg">Buka Editor →</button>
  </form>`;
}
