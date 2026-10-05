// Enveely — Template gallery page (Design-1.md §12).
// Each card shows three real variant covers in a native horizontal carousel.

import { wirePreviewCarousel } from '../ui/preview-carousel.js';
import { renderPage } from '../ui/app-shell.js';
import { t } from '../i18n.js';
import { templateFamilies } from '../data/templates.js';
import { getVariantsFor } from '../data/variants.js';
import { navigate } from '../router.js';
import { analyticsEvents } from '../services/analytics.js';
import { invitationFrame, hydrateInvitationFrames } from '../ui/invitation-frame.js';
import { getFamilyPriceRange, formatRupiah } from '../data/plans.js';

const FILTERS = [
  { id: 'all', label: 'Semua' },
  { id: 'romantic', label: 'Romantis' },
  { id: 'botanical', label: 'Botanical' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'traditional', label: 'Tradisional' },
  { id: 'floral', label: 'Floral' },
  { id: 'rustic', label: 'Rustic' },
];

function familyShortDesc(id) {
  return ({
    blocka: 'Dunia blok 3D, pulau melayang, dan pesta yang penuh warna.',
    mayura: 'Taman merak, sulur berlapis, dan bingkai Art Nouveau.',
    pusaka: 'Panggung wayang, batik, dan bingkai ukiran di setiap bagian.',
    amora: 'Hangat, floral, dan terasa dekat.',
    elysian: 'Kertas berlapis, emboss, dan detail couture.',
    serena: 'Istana, bingkai kerajaan, dan merpati yang berterbangan.',
    lumiere: 'Foto besar, sorot cahaya, dan detail sinematik.',
    nusantara: 'Warna berani, anyaman, dan detail keemasan.',
    meadow: 'Buku cerita pedesaan, burung, lentera, dan bingkai taman.',
    tempwed: 'Paviliun floral, potret berlapis, dan gerak lembut.',
    botanica: 'Romantis, botanical watercolor, dan nuansa dusty rose.',
  })[id] || '';
}

export function renderTemplateGallery() {
  renderPage(
    `
    <section class="section gallery-page">
      <div class="container">
        <header class="gallery-head reveal">
          <p class="eyebrow">Koleksi Desain Pilihan</p>
          <h1 class="section__title">Pilih Desain yang Paling Terasa Seperti Kalian.</h1>
          <p class="section__subtitle">Tiap keluarga punya tata letak, tipografi, dan cara menampilkan foto yang berbeda. Geser pratinjau di tiap kartu untuk membandingkan variasinya.</p>
        </header>

        <div class="gallery-filters" role="group" aria-label="Filter template">
          ${FILTERS.map((f) => `<button type="button" class="chip" data-filter="${f.id}" aria-pressed="false">${f.label}</button>`).join('')}
        </div>

        <div class="gallery-grid" id="gallery-grid"></div>
      </div>
    </section>
    `,
    (root) => {
      const grid = root.querySelector('#gallery-grid');
      let active = 'all';
      let carouselCleanups = [];

      const draw = () => {
        carouselCleanups.forEach(cleanup => cleanup?.());
        carouselCleanups = [];
        const items = templateFamilies.filter((tpl) => active === 'all' || tpl.mood.includes(active));
        grid.innerHTML = items
          .map((tpl, i) => {
            const variants = getVariantsFor(tpl.id);
            const price = getFamilyPriceRange(tpl.id);
            return `
            <article class="tpl-card tpl-card--${tpl.id}" data-template="${tpl.id}" style="--i:${i}">
              <div class="tpl-card__preview">
                <div class="tpl-card__slider" data-slider tabindex="0" role="region" aria-label="Variasi desain ${tpl.name}">
                  <div class="tpl-card__slider-track">
                    ${variants.map(v => `<div class="tpl-card__slide tpl-card__slide--mock">
                      ${invitationFrame({ templateId: tpl.id, variantId: v.id, frame: 'editorial' })}
                    </div>`).join('')}
                  </div>
                </div>
              </div>
              <div class="tpl-card__slider-footer">
                <span data-slide-caption>${variants[0]?.name || tpl.name}</span>
                <div class="tpl-card__slider-controls" role="group" aria-label="Pilih variasi">
                  ${variants.map((v, n) => `<button type="button" class="tpl-card__dot" data-slide="${n}" aria-label="${v.name}"></button>`).join('')}
                </div>
              </div>
              <div class="tpl-card__body">
                <h3 class="tpl-card__name">${tpl.name}</h3>
                <p class="tpl-card__meta">${familyShortDesc(tpl.id)}</p>
                <p class="tpl-card__price">${price?.min === 0 ? 'Mulai gratis' : `Mulai ${formatRupiah(price?.min)}`} <small>· ${price?.min === 0 ? '7 hari' : '3 bulan'}</small></p>
                <ul class="tpl-card__chips">
                  <li class="tpl-card__chip">${tpl.densityLabel}</li>
                  <li class="tpl-card__chip">${variants.length} Variasi</li>
                </ul>
                <div class="tpl-card__actions">
                  <a href="/templates/${tpl.id}" data-link class="btn btn--ghost btn--sm">${t('common.preview')}</a>
                  <button type="button" class="btn btn--primary btn--sm" data-use="${tpl.id}">${t('common.useDesign')}</button>
                </div>
              </div>
            </article>`;
          })
          .join('');

        hydrateInvitationFrames(grid);
        grid.querySelectorAll('.tpl-card').forEach(card => {
          carouselCleanups.push(wirePreviewCarousel({
            viewport: card.querySelector('[data-slider]'), track: card.querySelector('.tpl-card__slider-track'),
            buttons: card.querySelectorAll('[data-slide]'), caption: card.querySelector('[data-slide-caption]'),
            labels: getVariantsFor(card.dataset.template).map(v => v.name),
          }));
        });
      };

      root.querySelectorAll('.chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          active = chip.dataset.filter;
          root.querySelectorAll('[data-filter]').forEach(c => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', String(c === chip)); });
          draw();
        });
      });
      root.querySelector('[data-filter="all"]')?.classList.add('is-active');
      root.querySelector('[data-filter="all"]')?.setAttribute('aria-pressed', 'true');

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
