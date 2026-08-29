// Enveely — Landing page (premium redesign).
// Real invitation frames (render engine), editorial hero collage with local
// demo photography, interactive DNA showcase, bento features, timeline,
// photo CTA band. All copy via i18n; no emoji icons.

import { renderPage } from '../ui/app-shell.js';
import { t } from '../i18n.js';
import { analyticsEvents } from '../services/analytics.js';
import { templateFamilies } from '../data/templates.js';
import { invitationFrame, hydrateInvitationFrames } from '../ui/invitation-frame.js';
import { icon } from '../core/icons.js';

const DEMO = {
  jawa: '/demo/jawa.webp',
  sunda: '/demo/sunda.webp',
  modern: '/demo/modern.webp',
  luxury: '/demo/luxury.webp',
  nusantara: '/demo/nusantara.webp',
  candid: '/demo/candid-laughing.webp',
  ring: '/demo/ring-hand.webp',
  melati: '/demo/melati-pengantin.webp',
  batik: '/demo/batik-texture.webp',
  pendopo: '/demo/pendopo.webp',
};

export function renderLanding() {
  analyticsEvents.landingView();

  renderPage(
    `
    <!-- ============ HERO ============ -->
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__copy">
          <p class="hero__eyebrow">Undangan Pernikahan Digital</p>
          <h1 class="hero__title">Buat Undangan yang Terasa<br /><em>seperti Kalian.</em></h1>
          <p class="hero__subtitle">
            Pilih desain favorit, isi dengan cerita cinta kalian, lalu bagikan kepada
            orang-orang tersayang, semuanya selesai dalam hitungan menit,
            tanpa perlu keahlian desain apa pun.
          </p>
          <div class="hero__cta">
            <a href="/create" data-link class="btn btn--primary btn--lg">Mulai Gratis ${icon('arrowRight', { size: 18 })}</a>
            <a href="/templates" data-link class="btn btn--ghost btn--lg">Jelajahi 18 Desain</a>
          </div>
          <div class="hero__trust">
            <span>${icon('check', { size: 16 })} Gratis untuk memulai</span>
            <span>${icon('check', { size: 16 })} Langsung coba tanpa login</span>
            <span>${icon('check', { size: 16 })} Siap dibagikan ke WhatsApp</span>
          </div>
        </div>

        <div class="hero__collage" aria-hidden="true">
          <span class="hero__badge">${icon('sparkle', { size: 15 })} Desain eksklusif Enveely</span>
          <div data-hero-main>${invitationFrame({ templateId: 'amora', variantId: 'amora-garden', frame: 'arch' })}</div>
          <div data-hero-phone>${invitationFrame({ templateId: 'lumiere', variantId: 'lumiere-gallery', frame: 'phone' })}</div>
          <img class="hero__chip-photo" src="${DEMO.ring}" alt="" loading="lazy" width="150" height="150"/>
        </div>
      </div>
    </section>

    <!-- ============ MARQUEE ============ -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        ${[0, 1].map(() => `
          <span class="marquee__item">${templateFamilies.map((f) => f.name).join('</span><span class="marquee__item">')}</span>
        `).join('')}
      </div>
    </div>

    <!-- ============ WHY US / SHOWCASE ============ -->
    <section id="why-us" class="showcase">
      <div class="container">
        <header class="showcase__head reveal">
          <h2>Satu Cerita, Banyak Gaya.</h2>
          <p>Data pasangan yang sama, tiga nuansa desain yang berbeda. Coba sendiri —
             ketuk untuk berganti gaya dan temukan mana yang paling menggambarkan kalian.</p>
        </header>

        <div class="showcase__switch reveal" role="tablist" aria-label="Pilih gaya desain">
          <button type="button" class="chip is-active" data-showcase="amora" role="tab" aria-selected="true">Amora — Romantis</button>
          <button type="button" class="chip" data-showcase="serena" role="tab" aria-selected="false">Serena — Minimalis</button>
          <button type="button" class="chip" data-showcase="lumiere" role="tab" aria-selected="false">Lumière — Sinematik</button>
        </div>

        <div class="showcase__stage reveal" data-showcase-stage></div>
        <p class="showcase__caption" data-showcase-caption></p>
      </div>
    </section>

    <!-- ============ PRODUCT / FAMILIES ============ -->
    <section id="product" class="families">
      <div class="container">
        <header class="reveal">
          <p class="eyebrow">Koleksi Desain</p>
          <h2 class="section__title" style="text-align:left;margin-top:12px">Temukan Desain yang Terasa Seperti Kalian.</h2>
          <p class="muted" style="text-align:left;margin-top:12px;max-width:56ch">Enam keluarga desain, delapan belas variasi karakter — dari yang hangat dan romantis hingga modern yang elegan. Semuanya bisa kalian sesuaikan sendiri, sesederhana mengisi formulir.</p>
        </header>
        <div class="families__grid">
          ${templateFamilies.map((f, i) => `
            <article class="family-card reveal" style="--reveal-delay:${i * 60}ms">
              <a href="/templates/${f.id}" data-link class="family-card__media" aria-label="${f.name}">
                ${invitationFrame({ templateId: f.id, frame: 'editorial' })}
              </a>
              <div class="family-card__body">
                <h3 class="family-card__name">${f.name}</h3>
                <p class="family-card__meta">${f.moodLabel} · ${f.densityLabel}</p>
                <div class="family-card__actions">
                  <a href="/templates/${f.id}" data-link class="btn btn--ghost btn--sm">Lihat Detail</a>
                  <a href="/templates/${f.id}/preview" data-link class="btn btn--primary btn--sm">Coba Live</a>
                </div>
              </div>
            </article>`).join('')}
        </div>
      </div>
    </section>

    <!-- ============ FEATURES (bento) ============ -->
    <section class="features">
      <div class="container">
        <header class="reveal">
          <p class="eyebrow">Fitur Unggulan</p>
          <h2 class="section__title" style="text-align:left;margin-top:12px">Semua yang Kalian Butuhkan,<br/>Sudah Siap Pakai.</h2>
        </header>
        <div class="features__grid">
          ${feature({
            icon: 'layers', title: 'Banyak Acara, Satu Undangan',
            desc: 'Akad, resepsi, hingga after party — setiap acara punya waktu, lokasi, dan petunjuk arahnya sendiri, tertata rapi dalam satu undangan.',
          })}
          ${feature({
            icon: 'clock', title: 'Hitung Mundur Penuh Antusiasme',
            desc: 'Ajak tamu menghitung detik menuju hari bahagia — tampil menyatu dengan gaya desain pilihan kalian.',
          })}
          ${feature({
            icon: 'image', title: 'Galeri Ringan, Foto Tetap Jernih',
            desc: 'Unggah sepuasnya. Foto dikompresi otomatis agar tetap tajam namun hemat kuota tamu yang membuka undangan.',
            img: DEMO.candid,
          })}
          ${feature({
            icon: 'pin', title: 'Lokasi Mudah Ditemukan',
            desc: 'Peta tertanam langsung di undangan, lengkap dengan tombol navigasi menuju aplikasi peta favorit tamu.',
          })}
          ${feature({
            icon: 'mail', title: 'RSVP & Ucapan Tersimpan Rapi',
            desc: 'Tamu dapat memastikan kehadiran dan menitipkan doa — semuanya terkumpul rapi, siap kalian baca kapan saja.',
          })}
          ${feature({
            icon: 'link', title: 'Satu Tautan untuk Semua Tamu',
            desc: 'Sebarkan lewat WhatsApp atau Instagram Story — undangan selalu tampil cantik dengan pratinjau yang rapi.',
            img: DEMO.batik,
          })}
        </div>
      </div>
    </section>

    <!-- ============ HOW IT WORKS ============ -->
    <section id="how-it-works" class="how">
      <div class="container">
        <header class="reveal">
          <p class="eyebrow">Sesederhana Ini</p>
          <h2 class="section__title" style="text-align:left;margin-top:12px">Dari Cerita ke Undangan,<br/>Hanya Empat Langkah.</h2>
        </header>
        <ol class="how__timeline" aria-label="Empat langkah membuat undangan">
          ${step('1', 'palette', 'Pilih desain favorit', 'Telusuri koleksi kami dan temukan gaya yang paling terasa seperti kalian.')}
          ${step('2', 'rings', 'Isi dengan cerita kalian', 'Nama, tanggal, acara, dan foto — desain akan tetap indah secara otomatis.')}
          ${step('3', 'eye', 'Pratinjau persis seperti tamu', 'Periksa tampilan di HP sebelum tayang, supaya percaya diri saat dibagikan.')}
          ${step('4', 'send', 'Bagikan dengan bangga', 'Publikasikan dan sebarkan tautan elegan ke WhatsApp dalam satu ketukan.')}
        </ol>
      </div>
    </section>

    <!-- ============ CLOSING CTA BAND ============ -->
    <section class="cta-band">
      <div class="cta-band__bg">
        <img src="${DEMO.pendopo}" alt="" loading="lazy"/>
      </div>
      <div class="container cta-band__inner">
        <h2>Siap Mengundang Orang-orang Tercinta?</h2>
        <p>Mulai gratis hari ini — pilih desain, tuangkan cerita kalian, dan biarkan Enveely merapikan sisanya.</p>
        <div class="cta-band__actions">
          <a href="/create" data-link class="btn btn--primary btn--lg">Buat Undangan Sekarang ${icon('arrowRight', { size: 18 })}</a>
          <a href="/templates" data-link class="btn btn--ghost btn--lg">Lihat Contoh Desain</a>
        </div>
      </div>
    </section>
    `,
    (root) => {
      setupHeroRotation(root);
      setupShowcase(root);
      hydrateInvitationFrames(root);
      setupReveal(root);
      setupSmoothAnchors(root);
    },
  );

  function feature({ icon: ic, title, desc, img }) {
    return `
    <article class="feature-card reveal ${img ? 'feature-card--photo' : ''}">
      ${img
        ? `<img class="feature-card__img" src="${img}" alt="" loading="lazy" width="96" height="96"/>`
        : `<span class="feature-card__icon">${icon(ic)}</span>`}
      <div>
        <h3>${title}</h3>
        <p>${desc}</p>
      </div>
    </article>`;
  }

  function step(num, iconKey, title, desc) {
    return `
    <li class="how__step reveal" style="--reveal-delay:${num * 80}ms">
      <span class="how__num">${icon(iconKey)}<strong>${num}</strong></span>
      <h3>${title}</h3>
      <p>${desc}</p>
    </li>`;
  }
}

/** Rotate the main hero frame across families every few seconds. */
function setupHeroRotation(root) {
  const slot = root.querySelector('[data-hero-main]');
  if (!slot) return;
  const order = [
    { templateId: 'amora', variantId: 'amora-garden' },
    { templateId: 'elysian', variantId: 'elysian-ivory' },
    { templateId: 'nusantara', variantId: 'nusantara-puspa' },
  ];
  let index = 0;
  setInterval(() => {
    index = (index + 1) % order.length;
    const next = order[index];
    slot.style.transition = 'opacity 400ms ease';
    slot.style.opacity = '0';
    setTimeout(() => {
      slot.innerHTML = invitationFrame({ ...next, frame: 'arch' });
      hydrateInvitationFrames(slot);
      slot.style.opacity = '1';
    }, 400);
  }, 5200);
}

/** Interactive "same couple, different DNA" showcase. */
function setupShowcase(root) {
  const stage = root.querySelector('[data-showcase-stage]');
  const caption = root.querySelector('[data-showcase-caption]');
  if (!stage || !caption) return;

  const DNA = {
    amora: {
      variant: 'amora-garden',
      text: '<strong>Amora</strong> menyambut tamu dengan huruf serif yang hangat, ornamen floral halus, dan lengkungan arch yang lembut — sempurna untuk kisah yang penuh ketulusan.',
    },
    serena: {
      variant: 'serena-paper',
      text: '<strong>Serena</strong> mempercayakan segalanya pada kesederhanaan: garis tipis, ruang yang lapang, dan fokus penuh pada nama kalian. Untuk pasangan yang tenang dan modern.',
    },
    lumiere: {
      variant: 'lumiere-gallery',
      text: '<strong>Lumière</strong> tampil sinematik — latar gelap megah, foto besar, dan sentuhan emas. Untuk malam pernikahan yang ingin terasa mewah dan tak terlupakan.',
    },
  };

  const paint = (key) => {
    stage.classList.add('is-switching');
    setTimeout(() => {
      stage.innerHTML = invitationFrame({ templateId: key, variantId: DNA[key].variant, frame: 'arch' });
      caption.innerHTML = DNA[key].text;
      hydrateInvitationFrames(stage);
      requestAnimationFrame(() => stage.classList.remove('is-switching'));
    }, 260);
  };

  root.querySelectorAll('[data-showcase]').forEach((chip) => {
    chip.addEventListener('click', () => {
      root.querySelectorAll('[data-showcase]').forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-selected', String(active));
      });
      paint(chip.dataset.showcase);
    });
  });

  // initial paint
  stage.innerHTML = invitationFrame({ templateId: 'amora', variantId: DNA.amora.variant, frame: 'arch' });
  caption.innerHTML = DNA.amora.text;
}


/**
 * Staggered scroll-reveal with a gentle pop (rise + scale).
 * Elements inside the same parent get automatic 60ms stagger; groups can
 * override via data-reveal-stagger. IntersectionObserver only — no scroll
 * listeners, so scrolling stays on the compositor.
 */
function setupReveal(root) {
  const items = [...root.querySelectorAll('.reveal')];
  if (!items.length) return;

  // Auto-stagger siblings that become visible together.
  const groups = new Map();
  items.forEach((el) => {
    if (el.style.getPropertyValue('--reveal-delay')) return;
    const key = el.parentElement;
    const idx = groups.get(key) || 0;
    el.style.setProperty('--reveal-delay', `${Math.min(idx * 60, 360)}ms`);
    groups.set(key, idx + 1);
  });

  const show = (el) => {
    el.classList.add('is-visible');
    el.addEventListener('transitionend', () => {
      el.style.transitionDelay = '0ms';
      el.style.setProperty('--reveal-delay', '0ms');
    }, { once: true });
  };

  if (!('IntersectionObserver' in window)) {
    items.forEach(show);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        show(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => io.observe(el));
}

/**
 * Smooth-scroll for in-page anchors (/#why-us etc.). When already on the
 * landing route we intercept and glide; when arriving from another page the
 * router re-renders landing first, then we glide after paint.
 */
function setupSmoothAnchors(root) {
  const glideTo = (id) => {
    const target = document.getElementById(id);
    if (!target) return false;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  };

  root.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="/#"]');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute('href').slice(2);
    history.pushState({}, '', `/#${id}`);
    glideTo(id);
  });

  // Arrived via navbar from another route: URL already carries #section.
  if (window.location.hash.length > 1) {
    requestAnimationFrame(() => glideTo(window.location.hash.slice(1)));
  }
}

