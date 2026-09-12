// Enveely — Template preview page (Design-1.md §13).
// Shows family info, variant list, DNA summary, plus per-section preview
// gallery of the 10 demo photos as a slider — so users can see how each
// template handles real imagery.

import { renderPage } from '../ui/app-shell.js';
import { t } from '../i18n.js';
import { getTemplate } from '../data/templates.js';
import { getVariantsFor } from '../data/variants.js';
import { navigate } from '../router.js';
import { analyticsEvents } from '../services/analytics.js';
import { invitationFrame, hydrateInvitationFrames } from '../ui/invitation-frame.js';
import { getTemplatePlan, formatRupiah, planDurationLabel } from '../data/plans.js';

const DEMO_PHOTOS = [
  '/demo/jawa.webp',
  '/demo/sunda.webp',
  '/demo/modern.webp',
  '/demo/luxury.webp',
  '/demo/nusantara.webp',
  '/demo/candid-laughing.webp',
  '/demo/ring-hand.webp',
  '/demo/melati-pengantin.webp',
  '/demo/batik-texture.webp',
  '/demo/pendopo.webp',
];

export function renderTemplatePreview(templateId) {
  const tpl = getTemplate(templateId);
  if (!tpl) {
    navigate('/templates', { replace: true });
    return;
  }
  analyticsEvents.templatePreview(tpl.id);

  const variants = getVariantsFor(tpl.id);
  const defaultVariant = variants[0]?.id;
  const defaultPlan = getTemplatePlan(defaultVariant);

  renderPage(
    `
    <section class="section preview-page">
      <div class="container">
        <a href="/templates" data-link class="back-link">← ${t('common.back')}</a>
        <header class="preview-head reveal">
          <p class="eyebrow">Keluarga Desain</p>
          <h1>${tpl.name}</h1>
          <p class="preview-head__sub">${tpl.moodLabel} &middot; ${tpl.densityLabel} &middot; ${variants.length} variasi</p>
          <p class="preview-head__price">${defaultPlan?.price ? `Mulai ${formatRupiah(defaultPlan.price)}` : 'Mulai gratis'} <span>${planDurationLabel(defaultPlan)}</span></p>
        </header>

        <div class="preview-toolbar reveal">
          <a class="btn btn--primary" href="/templates/${tpl.id}/preview" data-link>Lihat di Layar Penuh</a>
          <button type="button" class="btn btn--primary btn--primary-solid" data-use="${defaultVariant}">Pakai Desain Ini</button>
        </div>

        <!-- Visual slider: tiap section keluarga template diperlihatkan -->
        <section class="preview-slider reveal" data-preview-slider>
          <div class="preview-slider__bar">
            <span class="preview-slider__label">Pratinjau Tiap Bagian</span>
            <span class="preview-slider__hint">Geser untuk lihat cover, galeri, dan detail ${tpl.name}.</span>
          </div>
          <div class="preview-slider__viewport">
            <div class="preview-slider__track" data-slider-track>
              ${previewSlide({ tpl, variantId: defaultVariant, kind: 'cover', label: 'Sampul', sub: 'Layar pertama yang dilihat tamu.' })}
              ${previewSlide({ tpl, variantId: defaultVariant, kind: 'couple', label: 'Mempelai', sub: 'Cara template menampilkan nama & foto kalian.' })}
              ${DEMO_PHOTOS.slice(0, 4).map((src, i) => `
                <div class="preview-slide">
                  <img src="${src}" alt="Foto ${i + 1}" loading="lazy"/>
                  <span class="preview-slide__label">Foto ${i + 1}</span>
                  <span class="preview-slide__sub">${photoCaption(i)}</span>
                </div>
              `).join('')}
              ${previewSlide({ tpl, variantId: defaultVariant, kind: 'event', label: 'Acara', sub: 'Tata letak tanggal & lokasi.' })}
              ${previewSlide({ tpl, variantId: defaultVariant, kind: 'rsvp', label: 'RSVP & Ucapan', sub: 'Tempat tamu memberi konfirmasi.' })}
            </div>
          </div>
          <div class="preview-slider__nav">
            <button type="button" class="preview-slider__arrow" data-slider-prev aria-label="Sebelumnya">&larr;</button>
            <ol class="preview-slider__dots" data-slider-dots></ol>
            <button type="button" class="preview-slider__arrow" data-slider-next aria-label="Berikutnya">&rarr;</button>
          </div>
        </section>

        <!-- Variant cards: ringkas, dengan warna spesifik tiap varian -->
        <section class="variant-section">
          <header class="variant-section__head">
            <h2>Tiga Variasi ${tpl.name}</h2>
            <p>Tiap variasi punya warna dan ornament sendiri, tapi masih satu keluarga desain &mdash; jadi apapun pilihannya, tampilannya tetap koheren.</p>
          </header>
          <div class="variant-grid">
            ${variants
              .map(
                (v) => `
              <article class="variant-card variant-card--${v.id}">
                <div class="variant-card__preview">
                  <div class="variant-card__stack">
                    <span class="variant-card__layer" style="background:${v.colorOverrides?.accent || tpl.colors.accent};opacity:.15"></span>
                    <span class="variant-card__layer" style="background:${v.colorOverrides?.accent || tpl.colors.accent};opacity:.3"></span>
                    <span class="variant-card__mock">${invitationFrame({ templateId: tpl.id, variantId: v.id, frame: 'editorial' })}</span>
                  </div>
                  <span class="variant-card__pill" style="background:${v.colorOverrides?.accent || tpl.colors.accent};color:${v.colorOverrides?.bg || tpl.colors.bg}">${v.name}</span>
                </div>
                <div class="variant-card__body">
                  ${(() => { const plan = getTemplatePlan(v.id); return `<div class="variant-card__price"><strong>${plan?.price ? formatRupiah(plan.price) : 'Gratis'}</strong><span>${planDurationLabel(plan)}</span></div>`; })()}
                  <h3>${tpl.name} &mdash; ${v.name}</h3>
                  <p class="muted">${variantDescription(v.id)}</p>
                  <ul class="variant-card__chips">
                    <li>${v.density} foto</li>
                    <li>${v.layoutStrategy.replace(/([A-Z])/g, ' $1').toLowerCase()}</li>
                    <li>${v.ornamentSet.replace(/-/g, ' ')}</li>
                  </ul>
                  <div class="variant-card__actions">
                    <a class="btn btn--ghost btn--sm" href="/templates/${tpl.id}/preview/${v.id}" data-link>${t('common.preview')}</a>
                    <button type="button" class="btn btn--primary btn--sm" data-use="${v.id}">${t('common.useDesign')}</button>
                  </div>
                </div>
              </article>`,
              )
              .join('')}
          </div>
        </section>

        <aside class="dna-panel">
          <h2>DNA Desain ${tpl.name}</h2>
          <ul>
            <li><strong>Tipografi</strong> ${stripQuotes(tpl.fonts.display)} + ${stripQuotes(tpl.fonts.body)}</li>
            <li><strong>Layout keluarga</strong> ${Object.values(tpl.layouts).slice(0, 4).map(stripLayout).join(' &middot; ')}</li>
            <li><strong>Animasi</strong> ${tpl.motion.reveal}</li>
            <li><strong>Kepadatan foto</strong> ${tpl.imageDensity}</li>
            <li><strong>Palet warna</strong> ${Object.values(tpl.colors).join(' &middot; ')}</li>
          </ul>
        </aside>
      </div>
    </section>
    `,
    (root) => {
      hydrateInvitationFrames(root);
      setupSlider(root);
      root.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-use]');
        if (btn) navigate(`/create?template=${tpl.id}&variant=${btn.dataset.use}`);
      });
    },
  );
}

function previewSlide({ tpl, variantId, kind, label, sub }) {
  return `
    <div class="preview-slide preview-slide--mock">
      ${invitationFrame({ templateId: tpl.id, variantId, frame: 'editorial' })}
      <span class="preview-slide__label">${label}</span>
      <span class="preview-slide__sub">${sub}</span>
    </div>`;
}

function photoCaption(i) {
  return ['Momen candid', 'Detail dekorasi', 'Potret berdua', 'Suasana acara'][i] || 'Foto pilihan';
}

function variantDescription(variantId) {
  const map = {
    'amora-garden': 'Floral halus di atas krem lembut — untuk taman musim semi.',
    'amora-moonlit': 'Latar gelap, garis emas tipis — untuk malam penuh bintang.',
    'amora-vintage-rose': 'Lapisan kertas, aksen mawar — untuk kesan romantis klasik.',
    'elysian-ivory': 'Tata letak editorial di atas gading — fokus pada tipografi.',
    'elysian-noir': 'Kontras gelap elegan, garis emas — untuk典礼 yang megah.',
    'elysian-champagne': 'Nuansa champagne, garis dobel — untuk keanggunan hangat.',
    'serena-paper': 'Putih bersih, garis tipis — kesan modern tenang.',
    'serena-modern-white': 'Grid rapi tanpa frame — fokus penuh pada foto.',
    'serena-ink': 'Latar gelap, tipografi putih — untuk pasangan modern.',
    'lumiere-gallery': 'Galeri penuh, foto besar — untuk pasangan fotogenik.',
    'lumiere-film': 'Border film, aksen emas — sinematik dan megah.',
    'lumiere-clean': 'Spasi putih bersih, foto medium — modern tanpa ribet.',
    'nusantara-sagara': 'Warna laut dan tanah — arsitektur dan struktur.',
    'nusantara-puspa': 'Botanikal floral, aksen oranye — hangat dan meriah.',
    'nusantara-terra': 'Tanah liat dan earthy — tradisional yang membumi.',
    'meadow-picnic': 'Polaroid dan doodle — playful dan santai.',
    'meadow-garden': 'Botanical hijau — segar dan natural.',
    'meadow-film': 'Grain analog — hangat dan nostalgia.',
    'botanica-dusty-rose': 'Botanical watercolor, ranting lembut, nuansa dusty rose dan kanvas gading.',
    'botanica-mauve-intimate': 'Aksen mauve dan burgundy dalam — intim, hangat, dan editorial.',
    'botanica-blush-cream': 'Blush lembut di atas krem hangat — romantis, tenang, dan bersahaja.',
  };
  return map[variantId] || 'Variasi karakter dalam keluarga yang sama.';
}

function stripLayout(s) {
  return String(s).replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();
}

function stripQuotes(fontStr) {
  return fontStr.replace(/'/g, '').split(',')[0];
}

function setupSlider(root) {
  const viewport = root.querySelector('[data-preview-slider] .preview-slider__viewport');
  const track = root.querySelector('[data-slider-track]');
  const dotsHost = root.querySelector('[data-slider-dots]');
  const prev = root.querySelector('[data-slider-prev]');
  const next = root.querySelector('[data-slider-next]');
  if (!viewport || !track || !dotsHost) return;

  const slides = track.children;
  const total = slides.length;
  let index = 0;

  // Build dot indicators
  dotsHost.innerHTML = Array.from({ length: total }, (_, i) =>
    `<li><button type="button" class="preview-slider__dot ${i === 0 ? 'is-active' : ''}" data-slide-go="${i}" aria-label="Slide ${i + 1}"></button></li>`
  ).join('');

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsHost.querySelectorAll('button').forEach((d, i) => d.classList.toggle('is-active', i === index));
  };

  prev?.addEventListener('click', () => { index = (index - 1 + total) % total; update(); });
  next?.addEventListener('click', () => { index = (index + 1) % total; update(); });
  dotsHost.addEventListener('click', (e) => {
    const dot = e.target.closest('[data-slide-go]');
    if (!dot) return;
    index = Number(dot.dataset.slideGo);
    update();
  });

  // Touch swipe support
  let startX = 0;
  viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    const dx = (e.changedTouches[0].clientX - startX);
    if (Math.abs(dx) < 40) return;
    index = dx < 0 ? (index + 1) % total : (index - 1 + total) % total;
    update();
  }, { passive: true });

  update();
}
