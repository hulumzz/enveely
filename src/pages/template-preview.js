// Enveely — Template preview page (Design-1.md §13).
// Real section previews and full-size variant covers.

import { wirePreviewCarousel } from '../ui/preview-carousel.js';
import { renderPage } from '../ui/app-shell.js';
import { t } from '../i18n.js';
import { getTemplate } from '../data/templates.js';
import { getVariantsFor } from '../data/variants.js';
import { navigate } from '../router.js';
import { analyticsEvents } from '../services/analytics.js';
import { invitationFrame, hydrateInvitationFrames } from '../ui/invitation-frame.js';
import { getTemplatePlan, formatRupiah, planDurationLabel } from '../data/plans.js';



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
        <div class="preview-overview">
        <div class="preview-intro">
        <header class="preview-head">
          <p class="eyebrow">Keluarga Desain</p>
          <h1>${tpl.name}</h1>
          <p class="preview-head__sub">${tpl.moodLabel} &middot; ${tpl.densityLabel} &middot; ${variants.length} variasi</p>
          <p class="preview-head__price">${defaultPlan?.price ? `Mulai ${formatRupiah(defaultPlan.price)}` : 'Mulai gratis'} <span>${planDurationLabel(defaultPlan)}</span></p>
        </header>

        <div class="preview-toolbar">
          <a class="btn btn--primary" href="/templates/${tpl.id}/preview" data-link>Lihat di Layar Penuh</a>
          <button type="button" class="btn btn--primary btn--primary-solid" data-use="${defaultVariant}">Pakai Desain Ini</button>
        </div>

        </div>
        <!-- Visual slider: tiap section keluarga template diperlihatkan -->
        <section class="preview-slider" data-preview-slider>
          <div class="preview-slider__bar">
            <span class="preview-slider__label">Pratinjau Tiap Bagian</span>
            <span class="preview-slider__hint">Geser untuk lihat cover, galeri, dan detail ${tpl.name}.</span>
          </div>
          <div class="preview-slider__viewport" tabindex="0" role="region" aria-label="Pratinjau bagian undangan">
            <div class="preview-slider__track" data-slider-track>
              ${previewSlide({ tpl, variantId: defaultVariant, kind: 'cover', label: 'Sampul', sub: 'Layar pertama yang dilihat tamu.' })}
              ${previewSlide({ tpl, variantId: defaultVariant, kind: 'couple', label: 'Mempelai', sub: 'Cara template menampilkan nama & foto kalian.' })}
              ${previewSlide({ tpl, variantId: defaultVariant, kind: 'gallery', label: 'Galeri', sub: 'Komposisi foto dalam undangan.' })}
              ${previewSlide({ tpl, variantId: defaultVariant, kind: 'event', label: 'Acara', sub: 'Tata letak tanggal & lokasi.' })}
              ${previewSlide({ tpl, variantId: defaultVariant, kind: 'rsvp', label: 'Konfirmasi Kehadiran', sub: 'Tempat tamu memberi konfirmasi.' })}
            </div>
          </div>
          <p class="preview-slider__caption" data-slide-caption aria-live="polite"></p>
          <div class="preview-slider__nav">
            <button type="button" class="preview-slider__arrow" data-slider-prev aria-label="Sebelumnya">&larr;</button>
            <ol class="preview-slider__dots" data-slider-dots></ol>
            <button type="button" class="preview-slider__arrow" data-slider-next aria-label="Berikutnya">&rarr;</button>
          </div>
        </section>

        </div>
        <!-- Variant cards: ringkas, dengan warna spesifik tiap varian -->
        <section class="variant-section">
          <header class="variant-section__head">
            <h2>Tiga Variasi ${tpl.name}</h2>
            <p>Bandingkan komposisi, bingkai foto, dan suasananya. Pilih yang paling dekat dengan cerita kalian.</p>
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
                </div>
                <div class="variant-card__body">
                  ${(() => { const plan = getTemplatePlan(v.id); return `<div class="variant-card__price"><strong>${plan?.price ? formatRupiah(plan.price) : 'Gratis'}</strong><span>${planDurationLabel(plan)}</span></div>`; })()}
                  <h3>${tpl.name} &mdash; ${v.name}</h3>
                  <p class="muted">${variantDescription(v.id)}</p>
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
  return `<div class="preview-slide preview-slide--mock" data-caption="${label} — ${sub}">
    ${invitationFrame({ templateId: tpl.id, variantId, frame: 'editorial', section: kind })}
  </div>`;
}

function variantDescription(variantId) {
  const map = {
    'amora-garden': 'Floral halus di atas krem lembut — untuk taman musim semi.',
    'amora-moonlit': 'Latar gelap, garis emas tipis — untuk malam penuh bintang.',
    'amora-vintage-rose': 'Lapisan kertas, aksen mawar — untuk kesan romantis klasik.',
    'elysian-ivory': 'Tata letak editorial di atas gading — fokus pada tipografi.',
    'elysian-noir': 'Kontras gelap elegan, garis emas — untuk perayaan yang megah.',
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
    'tempwed-classic': 'Paviliun floral dengan potret lengkung dan bingkai berlapis.',
    'tempwed-golden-hour': 'Medali bundar, cahaya senja, dan detail keemasan.',
    'tempwed-midnight-garden': 'Taman malam dengan potret tinggi dan cahaya lembut.',
  };
  return map[variantId] || 'Variasi karakter dalam keluarga yang sama.';
}

function setupSlider(root) {
  const track = root.querySelector('[data-slider-track]');
  const dots = root.querySelector('[data-slider-dots]');
  if (!track || !dots) return;
  const labels = [...track.children].map(slide => slide.dataset.caption);
  dots.innerHTML = labels.map((label, i) => `<li><button type="button" class="preview-slider__dot" aria-label="${label}" data-slide-go="${i}"></button></li>`).join('');
  wirePreviewCarousel({ viewport: root.querySelector('.preview-slider__viewport'), track,
    buttons: dots.querySelectorAll('button'), prev: root.querySelector('[data-slider-prev]'),
    next: root.querySelector('[data-slider-next]'), caption: root.querySelector('[data-slide-caption]'), labels });
}
