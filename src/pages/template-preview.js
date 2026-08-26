// Enveely — Template preview page (Design-1.md §13).
// Shows family info, variant list, DNA summary, and a placeholder canvas
// that will host the live renderer once section components land.

import { renderPage } from '../ui/app-shell.js';
import { t } from '../i18n.js';
import { getTemplate } from '../data/templates.js';
import { getVariantsFor } from '../data/variants.js';
import { navigate } from '../router.js';
import { analyticsEvents } from '../services/analytics.js';

export function renderTemplatePreview(templateId) {
  const tpl = getTemplate(templateId);
  if (!tpl) {
    navigate('/templates', { replace: true });
    return;
  }
  analyticsEvents.templatePreview(tpl.id);

  const variants = getVariantsFor(tpl.id);

  renderPage(
    `
    <section class="section preview-page">
      <div class="container">
        <a href="/templates" data-link class="back-link">← ${t('common.back')}</a>
        <header class="preview-head">
          <h1>${tpl.name}</h1>
          <p>${tpl.moodLabel}</p>
        </header>

        <div class="preview-toolbar">
          <a class="btn btn--primary btn--sm" href="/templates/${tpl.id}/preview" data-link>Buka Live Preview</a>
          <span class="chip is-static">${variants.length} Variasi</span>
          <span class="chip is-static">${tpl.densityLabel}</span>
        </div>

        <div class="variant-grid">
          ${variants
            .map(
              (v) => `
            <article class="variant-card">
              <div class="tpl-preview tpl-preview--${tpl.id} variant-card__preview">
                <span>${v.name}</span>
              </div>
              <div class="variant-card__body">
                <h3>${tpl.name} — ${v.name}</h3>
                <p class="muted">Density: ${v.density} · Ornamen: ${v.ornamentSet}</p>
                <div class="tpl-card__actions">
                  <a class="btn btn--ghost btn--sm" href="/templates/${tpl.id}/preview/${v.id}" data-link>${t('common.preview')}</a>
                  <button type="button" class="btn btn--primary btn--sm" data-use="${v.id}">${t('common.useDesign')}</button>
                </div>
              </div>
            </article>`,
            )
            .join('')}
        </div>

        <aside class="dna-panel">
          <h2>Design DNA</h2>
          <ul>
            <li><strong>Tipografi:</strong> ${stripQuotes(tpl.fonts.display)} + ${stripQuotes(tpl.fonts.body)}</li>
            <li><strong>Layout:</strong> ${Object.values(tpl.layouts).slice(0, 4).join(', ')}</li>
            <li><strong>Motion:</strong> ${tpl.motion.reveal}</li>
            <li><strong>Density:</strong> ${tpl.imageDensity}</li>
          </ul>
        </aside>
      </div>
    </section>
    `,
    (root) => {
      root.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-use]');
        if (btn) navigate(`/create?template=${tpl.id}&variant=${btn.dataset.use}`);
      });
    },  );
}

function stripQuotes(fontStr) {
  return fontStr.replace(/'/g, '').split(',')[0];
}
