// Enveely — Landing page (premium redesign).
// Real invitation frames (render engine), editorial hero collage with local
// demo photography, interactive DNA showcase, bento features, timeline,
// photo CTA band. Landing copy stays close to this view; no emoji icons.

import { renderPage } from '../ui/app-shell.js';
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
          <h1 class="hero__title">Undangan yang Terasa<br /><em>Seistimewa Hari Kalian.</em></h1>
          <p class="hero__subtitle">
            Pilih desain favorit, lengkapi cerita kalian, lalu bagikan ke orang-orang tercinta.
            Semua siap dalam hitungan menit, tanpa perlu jago desain.
          </p>
          <div class="hero__cta">
            <a href="/create" data-link class="btn btn--primary btn--lg">Buat Undangan Gratis ${icon('arrowRight', { size: 18 })}</a>
            <a href="/templates" data-link class="btn btn--ghost btn--lg">Jelajahi Desain</a>
          </div>
          <div class="hero__trust">
            <span>${icon('check', { size: 16 })} Mulai gratis, tanpa kartu kredit</span>
            <span>${icon('check', { size: 16 })} Coba desain dulu, daftar saat siap</span>
            <span>${icon('check', { size: 16 })} Siap dibagikan lewat WhatsApp</span>
          </div>
        </div>

        <div class="hero__collage" aria-hidden="true">
          <span class="hero__badge">${icon('sparkle', { size: 15 })} Koleksi desain Enveely</span>
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
          <p class="eyebrow">Lebih dari Sekadar Ganti Warna</p>
          <h2>Satu Cerita, Banyak Cara untuk Terasa Spesial.</h2>
          <p>Setiap keluarga desain punya komposisi, tipografi, ornamen, dan cara menampilkan foto yang berbeda. Pilih gaya yang paling dekat dengan cerita kalian.</p>
        </header>

        <div class="showcase__switch reveal" role="tablist" aria-label="Pilih gaya desain">
          <button type="button" class="chip is-active" data-showcase="amora" role="tab" aria-selected="true">
            <span class="chip__dot" style="--dot:#8b6f5a"></span> Amora · Romantis
          </button>
          <button type="button" class="chip" data-showcase="serena" role="tab" aria-selected="false">
            <span class="chip__dot" style="--dot:#55504a"></span> Serena · Minimalis
          </button>
          <button type="button" class="chip" data-showcase="lumiere" role="tab" aria-selected="false">
            <span class="chip__dot" style="--dot:#c8b48c"></span> Lumière · Sinematik
          </button>
        </div>

        <div class="showcase__viewport reveal" data-showcase-stage></div>

        <div class="showcase__caption-card" data-showcase-caption></div>

        <div class="showcase__dna reveal">
          <div class="showcase__dna-item">
            <span class="showcase__dna-label">Komposisi</span>
            <strong data-dna="layout">Potret Lengkung</strong>
          </div>
          <div class="showcase__dna-item">
            <span class="showcase__dna-label">Tipografi</span>
            <strong data-dna="fonts">Cormorant + Manrope</strong>
          </div>
          <div class="showcase__dna-item">
            <span class="showcase__dna-label">Ornamen</span>
            <strong data-dna="ornament">Floral Halus</strong>
          </div>
          <div class="showcase__dna-item">
            <span class="showcase__dna-label">Porsi Foto</span>
            <strong data-dna="density">Sedang</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ PRODUCT / FAMILIES ============ -->
    <section id="product" class="families">
      <div class="container">
        <header class="reveal">
          <p class="eyebrow">Pilihan Desain</p>
          <h2 class="section__title" style="text-align:left;margin-top:12px">Temukan Desain yang Mewakili Cerita Kalian.</h2>
          <p class="muted" style="text-align:left;margin-top:12px;max-width:56ch">Enam keluarga desain untuk berbagai nuansa, dari floral yang hangat hingga tampilan sinematik. Masing-masing tersedia dalam tiga variasi warna.</p>
        </header>
        <div class="families__grid">
          ${templateFamilies.map((f, i) => `
            <article class="family-card reveal family-card--${f.id}" style="--reveal-delay:${i * 60}ms" data-family="${f.id}">
              <a href="/templates/${f.id}" data-link class="family-card__media" aria-label="${f.name}">
                <div class="family-card__frame-stack">
                  <span class="family-card__frame family-card__frame--back"></span>
                  <span class="family-card__frame family-card__frame--mid"></span>
                  <span class="family-card__frame family-card__frame--front">${invitationFrame({ templateId: f.id, frame: familyFrame(f.id) })}</span>
                </div>
                <span class="family-card__badge" style="--badge-bg:${familyBadgeBg(f.id)};--badge-fg:${familyBadgeFg(f.id)}">${familyMoodLabel(f.id)}</span>
              </a>
              <div class="family-card__body">
                <h3 class="family-card__name">${f.name}</h3>
                <p class="family-card__meta">${familyShortDesc(f.id)}</p>
                <ul class="family-card__chips" aria-label="Ciri desain">
                  ${familyChips(f.id).map((c) => `<li>${c}</li>`).join('')}
                </ul>
                <div class="family-card__actions">
                  <a href="/templates/${f.id}" data-link class="btn btn--ghost btn--sm">Kenali Desain</a>
                  <a href="/templates/${f.id}/preview" data-link class="btn btn--primary btn--sm">Lihat Pratinjau</a>
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
          <p class="eyebrow">Yang Sudah Kami Siapkan</p>
          <h2 class="section__title" style="text-align:left;margin-top:12px">Semua Detail Penting,<br/>Ada dalam Satu Undangan.</h2>
        </header>
        <div class="features__grid">
          ${feature({
            icon: 'layers', title: 'Semua Rangkaian Acara, Tetap Rapi',
            desc: 'Atur akad, resepsi, hingga after party dalam satu undangan, lengkap dengan waktu, lokasi, dan tombol petunjuk arah.',
          })}
          ${feature({
            icon: 'clock', title: 'Hitung Mundur Menuju Hari H',
            desc: 'Ajak tamu ikut menantikan hari spesial kalian dengan hitung mundur yang menyatu dengan gaya undangan.',
          })}
          ${feature({
            icon: 'image', title: 'Galeri Foto yang Ringan Dibuka',
            desc: 'Unggah foto favorit kalian. Kami mengoptimalkannya agar tetap tajam dan nyaman dibuka tamu.',
            img: DEMO.candid,
          })}
          ${feature({
            icon: 'pin', title: 'Lokasi yang Mudah Dituju',
            desc: 'Peta tampil langsung di undangan, lengkap dengan tombol navigasi ke aplikasi peta pilihan tamu.',
          })}
          ${feature({
            icon: 'mail', title: 'RSVP dan Doa Tamu, Terkumpul Rapi',
            desc: 'Tamu bisa konfirmasi kehadiran dan meninggalkan ucapan. Semuanya dapat kalian lihat dari dashboard.',
          })}
          ${feature({
            icon: 'link', title: 'Satu Tautan, Siap Dibagikan',
            desc: 'Bagikan lewat WhatsApp atau Instagram Story dengan pratinjau yang tetap enak dilihat.',
            img: DEMO.batik,
          })}
        </div>
      </div>
    </section>

    <!-- ============ HOW IT WORKS ============ -->
    <section id="how-it-works" class="how">
      <div class="container">
        <header class="reveal">
          <p class="eyebrow">Mulai dengan Mudah</p>
          <h2 class="section__title" style="text-align:left;margin-top:12px">Dari Cerita Kalian Menjadi Undangan,<br/>Hanya Empat Langkah.</h2>
        </header>
        <ol class="how__timeline">
          ${step('Pilih desain favorit', 'Jelajahi koleksi kami dan temukan gaya yang paling mencerminkan kalian.')}
          ${step('Lengkapi cerita kalian', 'Masukkan nama, tanggal, rangkaian acara, dan foto. Tata letaknya akan menyesuaikan.')}
          ${step('Cek sebelum dibagikan', 'Lihat tampilannya di ponsel, persis seperti yang akan diterima tamu.')}
          ${step('Bagikan ke orang terdekat', 'Saat sudah siap, publikasikan dan kirim tautannya lewat WhatsApp. RSVP pun mulai masuk.')}
        </ol>
      </div>
    </section>

    <!-- ============ CLOSING CTA BAND ============ -->
    <section class="cta-band">
      <div class="cta-band__bg">
        <img src="${DEMO.pendopo}" alt="" loading="lazy"/>
      </div>
      <div class="container cta-band__inner">
        <h2>Saatnya Mengundang dengan Cara yang Lebih Berkesan.</h2>
        <p>Pilih desain yang kalian suka, isi cerita kalian, lalu biarkan Enveely merapikan tampilannya.</p>
        <div class="cta-band__actions">
          <a href="/create" data-link class="btn btn--primary btn--lg">Mulai Buat Undangan Gratis ${icon('arrowRight', { size: 18 })}</a>
          <a href="/templates" data-link class="btn btn--ghost btn--lg">Lihat Semua Desain</a>
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

  function step(title, desc) {
    return `
    <li class="how__step reveal">
      <span class="how__num"></span>
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
      frame: 'arch',
      title: 'Amora',
      tagline: 'Romantis · Floral',
      text: 'Lengkungan arch yang lembut, huruf serif yang hangat, dan ornamen floral halus membuat Amora terasa dekat dan tulus. Cocok untuk kisah yang ingin terasa personal sejak undangan pertama dibuka.',
      layout: 'Potret Lengkung',
      fonts: 'Cormorant + Manrope',
      ornament: 'Floral Halus',
      density: 'Sedang',
    },
    serena: {
      variant: 'serena-paper',
      frame: 'phone',
      title: 'Serena',
      tagline: 'Minimalis · Modern',
      text: 'Garis tipis, ruang yang lega, dan tipografi yang tenang membuat Serena tampil bersih tanpa kehilangan kehangatan. Nama kalian menjadi pusat perhatian, pas untuk gaya yang elegan dan tidak berlebihan.',
      layout: 'Tengah Minimalis',
      fonts: 'Cormorant + Inter',
      ornament: 'Tanpa Ornamen',
      density: 'Sedikit',
    },
    lumiere: {
      variant: 'lumiere-gallery',
      frame: 'phone',
      title: 'Lumière',
      tagline: 'Sinematik · Galeri',
      text: 'Latar gelap yang dramatis, foto besar, dan aksen emas hangat memberi Lumière nuansa sinematik. Pilihan tepat untuk perayaan malam yang ingin tampil berkelas dan penuh suasana.',
      layout: 'Foto Penuh',
      fonts: 'DM Serif + Manrope',
      ornament: 'Geometris Tipis',
      density: 'Banyak',
    },
  };

  const paint = (key) => {
    const cfg = DNA[key];
    stage.classList.add('is-switching');
    setTimeout(() => {
      stage.innerHTML = `
        <div class="showcase__device showcase__device--${cfg.frame}" data-dna-device>
          ${invitationFrame({ templateId: key, variantId: cfg.variant, frame: cfg.frame })}
        </div>
        <div class="showcase__meta">
          <p class="showcase__meta-eyebrow">Gaya Desain</p>
          <h3>${cfg.title}</h3>
          <p class="showcase__meta-tag">${cfg.tagline}</p>
        </div>`;
      caption.innerHTML = `
        <span class="showcase__caption-kicker">Mengenal ${cfg.title}</span>
        <p>${cfg.text}</p>`;
      const dna = root.querySelectorAll('[data-dna]');
      dna.forEach((el) => {
        const k = el.dataset.dna;
        if (k === 'layout') el.textContent = cfg.layout;
        if (k === 'fonts') el.textContent = cfg.fonts;
        if (k === 'ornament') el.textContent = cfg.ornament;
        if (k === 'density') el.textContent = cfg.density;
      });
      hydrateInvitationFrames(stage);
      requestAnimationFrame(() => stage.classList.remove('is-switching'));
    }, 220);
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
  paint('amora');
}

/** Pilih bingkai mockup yang mencerminkan karakter tiap keluarga. */
function familyFrame(id) {
  return ({
    amora: 'arch',
    elysian: 'editorial',
    serena: 'phone',
    lumiere: 'phone',
    nusantara: 'arch',
    meadow: 'polaroid',
  })[id] || 'editorial';
}

function familyBadgeBg(id) {
  return ({
    amora: '#faf6f1', elysian: '#f7f4ee', serena: '#fbfaf8',
    lumiere: '#111013', nusantara: '#f6efe4', meadow: '#f7f3ea',
  })[id] || '#faf6f1';
}
function familyBadgeFg(id) {
  return ({
    amora: '#8b6f5a', elysian: '#2f2a25', serena: '#55504a',
    lumiere: '#c8b48c', nusantara: '#7c3f2c', meadow: '#6b7a54',
  })[id] || '#8b6f5a';
}

function familyShortDesc(id) {
  return ({
    amora: 'Lengkungan floral yang lembut dengan tipografi hangat.',
    elysian: 'Tata letak editorial yang lega dan berkelas.',
    serena: 'Garis tipis dan ruang lega yang fokus pada nama kalian.',
    lumiere: 'Foto besar, latar gelap, dan aksen emas yang hangat.',
    nusantara: 'Sentuhan tradisi, motif batik, dan bingkai yang hangat.',
    meadow: 'Nuansa botanikal dengan polaroid dan tulisan tangan.',
  })[id] || '';
}

function familyMoodLabel(id) {
  return ({
    amora: 'Romantis · Floral',
    elysian: 'Mewah · Editorial',
    serena: 'Minimalis · Modern',
    lumiere: 'Sinematik · Modern',
    nusantara: 'Tradisional · Modern',
    meadow: 'Rustik · Botanikal',
  })[id] || '';
}

function familyChips(id) {
  return ({
    amora: ['Floral', 'Lengkung Arch', 'Hangat'],
    elysian: ['Editorial', 'Tipografi', 'Mewah'],
    serena: ['Minimalis', 'Bersih', 'Modern'],
    lumiere: ['Galeri', 'Sinematik', 'Aksen Emas'],
    nusantara: ['Tradisi', 'Batik', 'Berbingkai'],
    meadow: ['Rustik', 'Polaroid', 'Botanikal'],
  })[id] || [];
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

