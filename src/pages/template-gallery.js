// Enveely — Template gallery page (Design-1.md §12).
// Filter by mood, sort options, cards with hero photos from /public/demo
// and live invitation preview frames. Each family shows distinct imagery.

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
  { id: 'luxury', label: 'Luxury' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'traditional', label: 'Tradisional' },
  { id: 'floral', label: 'Floral' },
  { id: 'rustic', label: 'Rustic' },
];

// Pemetaan foto hero untuk tiap keluarga (lebih variatif, sesuai karakter)
const FAMILY_HERO = {
  amora: ['/demo/jawa.webp', '/demo/melati-pengantin.webp', '/demo/candid-laughing.webp'],
  elysian: ['/demo/luxury.webp', '/demo/ring-hand.webp', '/demo/modern.webp'],
  serena: ['/demo/modern.webp', '/demo/candid-laughing.webp', '/demo/jawa.webp'],
  lumiere: ['/demo/luxury.webp', '/demo/pendopo.webp', '/demo/modern.webp'],
  nusantara: ['/demo/nusantara.webp', '/demo/batik-texture.webp', '/demo/pendopo.webp'],
  meadow: ['/demo/candid-laughing.webp', '/demo/batik-texture.webp', '/demo/ring-hand.webp'],
};

function familyShortDesc(id) {
  return ({
    amora: 'Hangat, floral, dan terasa dekat.',
    elysian: 'Editorial, mewah, dan penuh spasi.',
    serena: 'Minimal, tenang, fokus pada nama.',
    lumiere: 'Sinematik, gelap megah, penuh foto.',
    nusantara: 'Tradisional modern dengan aksen batik.',
    meadow: 'Rustic, polaroid, dan botanical.',
  })[id] || '';
}

function familyFrame(id) {
  return ({ amora: 'arch', elysian: 'editorial', serena: 'phone', lumiere: 'phone', nusantara: 'arch', meadow: 'polaroid' })[id] || 'editorial';
}

export function renderTemplateGallery() {
  renderPage(
    `
    <section class="section gallery-page">
      <div class="container">
        <header class="gallery-head reveal">
          <p class="eyebrow">Koleksi 6 Keluarga Desain</p>
          <h1 class="section__title">Pilih Desain yang Paling Terasa Seperti Kalian.</h1>
          <p class="section__subtitle">Tiap keluarga punya tata letak, tipografi, dan cara menampilkan foto yang berbeda. Geser preview di tiap kartu untuk melihat detailnya.</p>
        </header>

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
          .map((tpl, i) => {
            const variants = getVariantsFor(tpl.id);
            const price = getFamilyPriceRange(tpl.id);
            const hero = FAMILY_HERO[tpl.id] || ['/demo/jawa.webp', '/demo/modern.webp', '/demo/luxury.webp'];
            return `
            <article class="tpl-card tpl-card--${tpl.id}" data-template="${tpl.id}" style="--i:${i}">
              <div class="tpl-card__preview">
                <div class="tpl-card__slider" data-slider>
                  <div class="tpl-card__slider-track">
                    <div class="tpl-card__slide tpl-card__slide--mock">
                      <div class="tpl-card__mock" data-mock>
                        ${invitationFrame({ templateId: tpl.id, frame: familyFrame(tpl.id) })}
                      </div>
                      <span class="tpl-card__slide-label">Tampilan Undangan</span>
                    </div>
                    ${hero.map((src, idx) => `
                      <div class="tpl-card__slide">
                        <img src="${src}" alt="Foto ${idx + 1} ${tpl.name}" loading="lazy" />
                        <span class="tpl-card__slide-label">Foto ${idx + 1}</span>
                      </div>
                    `).join('')}
                  </div>
                  <div class="tpl-card__slider-controls">
                    <button type="button" class="tpl-card__dot is-active" data-slide="0" aria-label="Slide 1"></button>
                    <button type="button" class="tpl-card__dot" data-slide="1" aria-label="Slide 2"></button>
                    <button type="button" class="tpl-card__dot" data-slide="2" aria-label="Slide 3"></button>
                    <button type="button" class="tpl-card__dot" data-slide="3" aria-label="Slide 4"></button>
                  </div>
                </div>
                <span class="tpl-card__badge" style="--badge-bg:${familyBadgeBg(tpl.id)};--badge-fg:${familyBadgeFg(tpl.id)}">${tpl.moodLabel}</span>
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

        // Hydrate mock previews + wire slider dots
        hydrateInvitationFrames(grid);
        grid.querySelectorAll('.tpl-card').forEach((card) => {
          const slides = card.querySelectorAll('.tpl-card__dot');
          const track = card.querySelector('.tpl-card__slider-track');
          if (!track || !slides.length) return;
          slides.forEach((dot) => {
            dot.addEventListener('click', () => {
              slides.forEach((d) => d.classList.toggle('is-active', d === dot));
              track.style.transform = `translateX(-${Number(dot.dataset.slide) * 100}%)`;
            });
          });
        });
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

function familyBadgeBg(id) {
  return ({ amora: '#faf6f1', elysian: '#f7f4ee', serena: '#fbfaf8', lumiere: '#111013', nusantara: '#f6efe4', meadow: '#f7f3ea' })[id] || '#faf6f1';
}
function familyBadgeFg(id) {
  return ({ amora: '#8b6f5a', elysian: '#2f2a25', serena: '#55504a', lumiere: '#c8b48c', nusantara: '#7c3f2c', meadow: '#6b7a54' })[id] || '#8b6f5a';
}
