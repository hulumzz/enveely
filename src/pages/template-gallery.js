// Enveely — Template gallery page (Design-1.md §12).
// Filter by mood, sort options, cards with Preview / Use Design actions.

import { renderPage } from '../ui/app-shell.js';
import { t } from '../i18n.js';
import { templateFamilies } from '../data/templates.js';
import { getVariantsFor } from '../data/variants.js';
import { navigate } from '../router.js';
import { analyticsEvents } from '../services/analytics.js';

const FILTERS = [
  { id: 'all', label: 'Semua' },
  { id: 'romantic', label: 'Romantis' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'traditional', label: 'Tradisional' },
];

export function renderTemplateGallery() {
  renderPage(
    `
    <section class="section gallery-page">
      <div class="container">
        <h1 class="section__title">Pilih Desain Kalian</h1>
        <p class="section__subtitle">Setiap template punya karakter visual lengkap — bukan sekadar warna berbeda.</p>

        <div class="gallery-filters" role="tablist" aria-label="Filter template">
          ${FILTERS.map((f) => `<button type="button" class="chip" data-filter="${f.id}" role="tab">${f.label}</button>`).join('')}
        </div>

        <div class="gallery-grid" id="gallery-grid"></div>
      </div>
    </section>
    `,
    (root) => {
      const grid = root.querySelector('#gallery-grid');
      let active = 'all';

      const draw = () => {
        const items = templateFamilies.filter((tpl) => active === 'all' || tpl.mood.includes(active));
        grid.innerHTML = items
          .map((tpl) => {
            const variants = getVariantsFor(tpl.id);
            return `
            <article class="tpl-card" data-template="${tpl.id}">
              <div class="tpl-card__preview tpl-preview tpl-preview--${tpl.id}">
                <span class="tpl-preview__name">${tpl.name}</span>
              </div>
              <div class="tpl-card__body">
                <h3 class="tpl-card__name">${tpl.name}</h3>
                <p class="tpl-card__meta">${tpl.moodLabel} · ${tpl.densityLabel}</p>
                <p class="tpl-card__variants">${variants.length} variasi</p>
                <div class="tpl-card__actions">
                  <a href="/templates/${tpl.id}" data-link class="btn btn--ghost btn--sm">${t('common.preview')}</a>
                  <button type="button" class="btn btn--primary btn--sm" data-use="${tpl.id}">${t('common.useDesign')}</button>
                </div>
              </div>
            </article>`;
          })
          .join('');
      };

      root.querySelectorAll('.chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          active = chip.dataset.filter;
          root.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
          draw();
        });
      });
      root.querySelector('.chip[data-filter="all"]')?.classList.add('is-active');

      grid.addEventListener('click', (e) => {
        const useBtn = e.target.closest('[data-use]');
        if (useBtn) {
          analyticsEvents.viewTemplate(useBtn.dataset.use);
          navigate(`/create?template=${useBtn.dataset.use}`);
        }
      });

      draw();
    },
  );
}
